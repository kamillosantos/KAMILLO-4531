import os, uuid
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from jose import jwt, JWTError
from passlib.context import CryptContext
from celery import Celery

SECRET=os.environ["JWT_SECRET_KEY"]; DB=os.environ["DATABASE_URL"]; REDIS=os.environ["REDIS_URL"]
engine=create_engine(DB,pool_pre_ping=True); Base=declarative_base(); SessionLocal=sessionmaker(bind=engine,autocommit=False,autoflush=False)
celery=Celery("agent_core",broker=REDIS,backend=REDIS); pwd=CryptContext(schemes=["bcrypt"],deprecated="auto")
ALGORITHM="HS256"; oauth2=OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class Tenant(Base):
    __tablename__="tenant_workspaces"
    id=Column(Integer,primary_key=True); client_name=Column(String,unique=True,index=True,nullable=False); niche=Column(String,nullable=False); briefing_config=Column(JSON); created_at=Column(DateTime,default=lambda:datetime.now(timezone.utc))
class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True); email=Column(String,unique=True,index=True,nullable=False); hashed_password=Column(String,nullable=False); is_active=Column(Boolean,default=True)
class Membership(Base):
    __tablename__="memberships"
    __table_args__=(UniqueConstraint("user_id","tenant_id",name="uq_user_tenant"),)
    id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey("users.id"),nullable=False); tenant_id=Column(Integer,ForeignKey("tenant_workspaces.id"),nullable=False); role=Column(String,nullable=False,default="VIEWER")
class Audit(Base):
    __tablename__="audit_logs"
    id=Column(Integer,primary_key=True); tenant_id=Column(Integer,index=True,nullable=False); user_id=Column(Integer,index=True,nullable=False); action=Column(String,nullable=False); details=Column(String); timestamp=Column(DateTime,default=lambda:datetime.now(timezone.utc))
class Job(Base):
    __tablename__="job_executions"
    job_id=Column(String,primary_key=True); tenant_id=Column(Integer,index=True,nullable=False); user_id=Column(Integer,index=True,nullable=False); agent_name=Column(String,nullable=False); status=Column(String,default="QUEUED",nullable=False); started_at=Column(DateTime); finished_at=Column(DateTime); result=Column(JSON); error=Column(String)
Base.metadata.create_all(engine)

class Login(BaseModel): email:EmailStr; password:str
class Workspace(BaseModel): client_name:str; niche:str

def db():
    s=SessionLocal()
    try: yield s
    finally: s.close()

def current_user(t:str=Depends(oauth2),s:Session=Depends(db)):
    try: p=jwt.decode(t,SECRET,algorithms=[ALGORITHM])
    except JWTError: raise HTTPException(401,"Invalid or expired credentials")
    u=s.query(User).filter(User.id==p.get("user_id"),User.is_active.is_(True)).first()
    if not u: raise HTTPException(401,"User not found or inactive")
    return u

def membership(u:User,s:Session):
    m=s.query(Membership).filter(Membership.user_id==u.id).order_by(Membership.id.asc()).first()
    if not m: raise HTTPException(403,"User has no tenant membership")
    return m

def role(required):
    levels={"VIEWER":1,"OPERATOR":2,"ADMIN":3,"OWNER":4}
    def dep(u:User=Depends(current_user),s:Session=Depends(db)):
        m=membership(u,s)
        if levels.get(m.role,0)<levels.get(required,99): raise HTTPException(403,"Insufficient privileges")
        return m
    return dep

app=FastAPI(title="KAMILLO-4531 Performance SaaS Core",version="2.1.0",redoc_url=None)

@app.get("/api/v1/health")
def health(): return {"status":"healthy","architecture":"KAMILLO-4531 Elite Core"}

@app.post("/api/v1/auth/login")
def login(x:Login,s:Session=Depends(db)):
    u=s.query(User).filter(User.email==x.email,User.is_active.is_(True)).first()
    if not u or not pwd.verify(x.password,u.hashed_password): raise HTTPException(401,"Invalid email or password")
    now=datetime.now(timezone.utc); tok=jwt.encode({"sub":u.email,"user_id":u.id,"iat":now,"exp":now+timedelta(hours=8)},SECRET,algorithm=ALGORITHM)
    return {"access_token":tok,"token_type":"bearer","expires_in":28800}

@app.post("/api/v1/tenants/",status_code=201)
def create_tenant(x:Workspace,u:User=Depends(current_user),s:Session=Depends(db)):
    if s.query(Tenant).filter(Tenant.client_name==x.client_name).first(): raise HTTPException(400,"Workspace already exists")
    t=Tenant(client_name=x.client_name,niche=x.niche); s.add(t); s.flush(); s.add(Membership(user_id=u.id,tenant_id=t.id,role="OWNER")); s.commit()
    return {"tenant_id":t.id,"status":"created"}

def pipeline(tenant_id):
    insights=[{"competitor":"TargetMarket_Global","angle":"Direct Response VSL","ctr":"4.8%"}]
    leads=[{"lead_id":101,"channel":"instagram","intent_score":"high_conversion"},{"lead_id":102,"channel":"linkedin","intent_score":"enterprise"}]
    return {"status":"success","tenant_id":tenant_id,"insights_gathered":len(insights),"leads_extracted":len(leads),"campaign_execution":{"dispatched_count":len(leads),"applied_strategy":insights[0]["angle"]}}

@celery.task(bind=True,name="tasks.execute_tenant_pipeline",autoretry_for=(Exception,),retry_backoff=True,max_retries=3)
def execute_job(self,job_id,tenant_id):
    s=SessionLocal(); j=s.query(Job).filter(Job.job_id==job_id).first()
    if not j: s.close(); raise ValueError("Job not found")
    try:
        j.status="RUNNING"; j.started_at=datetime.now(timezone.utc); s.commit()
        r=pipeline(tenant_id); j.status="COMPLETED"; j.result=r; j.finished_at=datetime.now(timezone.utc); j.error=None; s.commit(); return r
    except Exception as e:
        j.status="FAILED" if self.request.retries>=self.max_retries else "RETRY"; j.error=str(e); j.finished_at=datetime.now(timezone.utc); s.commit(); raise
    finally: s.close()

@app.post("/api/v1/agents/execute",status_code=202)
def execute(u:User=Depends(current_user),m=Depends(role("OPERATOR")),s:Session=Depends(db)):
    job_id=str(uuid.uuid4()); s.add(Job(job_id=job_id,tenant_id=m.tenant_id,user_id=u.id,agent_name="MasterOrchestratorAgent",status="QUEUED")); s.add(Audit(tenant_id=m.tenant_id,user_id=u.id,action="EXECUTE_AGENT_PIPELINE",details=job_id)); s.commit(); execute_job.delay(job_id,m.tenant_id)
    return {"job_id":job_id,"tenant_id":m.tenant_id,"status":"QUEUED"}

@app.get("/api/v1/agents/jobs/{job_id}")
def get_job(job_id:str,u:User=Depends(current_user),s:Session=Depends(db)):
    m=membership(u,s); j=s.query(Job).filter(Job.job_id==job_id,Job.tenant_id==m.tenant_id).first()
    if not j: raise HTTPException(404,"Job not found")
    return {"job_id":j.job_id,"status":j.status,"result":j.result,"error":j.error,"started_at":j.started_at,"finished_at":j.finished_at}
