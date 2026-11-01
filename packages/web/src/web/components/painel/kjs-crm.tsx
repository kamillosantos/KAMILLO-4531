import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, MessageSquare, Plus, Send, UserRound, LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import { orpc } from "../../lib/api";

const HUMAN_URL = "https://wa.me/message/GQHHPYO4I6NPC1";
const panel = "rounded-lg border border-[#1f242d] bg-[#0d0f12]";
const field = "w-full rounded border border-[#283241] bg-[#050505] px-3 py-2 font-mono text-xs text-[#e0e6ed] outline-none focus:border-[#00f0ff]";

type Conversation = {
  id: number; contactName: string; contact: string; channel: string;
  status: string; assignedTo: string | null; updatedAt: Date | string;
};
type Message = {
  id: number; conversationId: number; direction: string; senderType: string;
  content: string; createdAt: Date | string;
};

export function KjsCrm() {
  const qc = useQueryClient();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch("/api/crm/session", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => setAuthenticated(Boolean(d.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  const conversationsQuery = useQuery({
    ...orpc.inbox.list.queryOptions(),
    enabled: authenticated,
    refetchInterval: authenticated ? 15000 : false,
  });
  const conversations = (conversationsQuery.data ?? []) as Conversation[];
  const messagesQuery = useQuery({
    ...orpc.inbox.messages.queryOptions({ input: { conversationId: selectedId ?? 0 } }),
    enabled: authenticated && selectedId !== null,
    refetchInterval: authenticated && selectedId !== null ? 8000 : false,
  });
  const messages = (messagesQuery.data ?? []) as Message[];

  const createConversation = useMutation(orpc.inbox.create.mutationOptions({
    onSuccess: async (conversation) => {
      setSelectedId(conversation.id);
      setNewName(""); setNewContact(""); setConsentConfirmed(false); setShowNew(false);
      await qc.invalidateQueries({ queryKey: orpc.inbox.list.key() });
    },
  }));
  const receiveMessage = useMutation(orpc.inbox.receive.mutationOptions({
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orpc.inbox.list.key() });
      if (selectedId !== null) await qc.invalidateQueries({ queryKey: orpc.inbox.messages.key() });
    },
  }));
  const replyMessage = useMutation(orpc.inbox.reply.mutationOptions({
    onSuccess: async () => {
      setMessage("");
      await qc.invalidateQueries({ queryKey: orpc.inbox.list.key() });
      await qc.invalidateQueries({ queryKey: orpc.inbox.messages.key() });
    },
  }));
  const handoff = useMutation(orpc.inbox.handoff.mutationOptions({
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orpc.inbox.list.key() });
    },
  }));

  async function login(e: React.FormEvent) {
    e.preventDefault(); setLoginError("");
    const response = await fetch("/api/crm/session", {
      method: "POST", credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setLoginError(data.error ?? "Não foi possível autenticar."); return; }
    setAuthenticated(true); setPassword("");
  }

  async function logout() {
    await fetch("/api/crm/session", { method: "DELETE", credentials: "same-origin" });
    setAuthenticated(false); setSelectedId(null);
    qc.clear();
  }

  function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !message.trim()) return;
    replyMessage.mutate({ conversationId: selectedId, content: message.trim() });
  }

  function simulateInbound() {
    if (!selectedId) return;
    receiveMessage.mutate({
      conversationId: selectedId,
      content: "Olá, gostaria de entender como a KJS pode ajudar minha empresa a vender mais.",
    });
  }

  if (checking) return <div className="p-8 font-mono text-xs text-[#606d80]">Verificando acesso seguro…</div>;

  if (!authenticated) return (
    <div className="mx-auto max-w-md py-12">
      <div className={panel + " p-6"}>
        <div className="mb-4 flex items-center gap-2 text-[#00ff66]"><ShieldCheck className="h-5 w-5" /><span className="font-mono text-xs font-bold tracking-widest">KJS CRM · ACESSO RESTRITO</span></div>
        <p className="mb-5 font-mono text-xs leading-6 text-[#9aa6b2]">Entre com a senha administrativa configurada no servidor para acessar leads e histórico de conversas.</p>
        <form onSubmit={login} className="space-y-3">
          <input className={field} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha administrativa" required />
          {loginError && <p className="font-mono text-xs text-red-400">{loginError}</p>}
          <button className="w-full rounded bg-[#00ff66] px-4 py-2.5 font-mono text-xs font-bold text-black">Entrar no CRM</button>
        </form>
      </div>
    </div>
  );

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[#00ff66]"><MessageSquare className="h-4 w-4" /><span className="font-mono text-xs font-bold tracking-widest">KJS IMPERADOR · CRM & INBOX</span></div>
          <p className="mt-1 font-mono text-[10px] text-[#606d80]">Pipeline de conversas · histórico persistente · transferência humana</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 rounded border border-[#283241] px-3 py-2 font-mono text-[10px] text-[#9aa6b2]"><LogOut className="h-3 w-3" /> Sair</button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className={panel + " p-3"}><div className="font-mono text-[9px] text-[#606d80]">CONVERSAS</div><div className="mt-1 text-xl font-bold text-[#e0e6ed]">{conversations.length}</div></div>
        <div className={panel + " p-3"}><div className="font-mono text-[9px] text-[#606d80]">BOT ATIVO</div><div className="mt-1 text-xl font-bold text-[#00f0ff]">{conversations.filter((c) => c.status === "bot").length}</div></div>
        <div className={panel + " p-3"}><div className="font-mono text-[9px] text-[#606d80]">AGUARDANDO HUMANO</div><div className="mt-1 text-xl font-bold text-amber-300">{conversations.filter((c) => c.status === "waiting_human").length}</div></div>
        <div className={panel + " p-3"}><div className="font-mono text-[9px] text-[#606d80]">ATENDIMENTO HUMANO</div><div className="mt-1 text-xl font-bold text-[#00ff66]">{conversations.filter((c) => c.status === "human").length}</div></div>
      </div>

      <div className="grid min-h-[560px] gap-3 lg:grid-cols-[300px_1fr]">
        <aside className={panel + " flex flex-col p-3"}>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#9aa6b2]">CAIXA DE ENTRADA</span>
            <button onClick={() => setShowNew((v) => !v)} className="rounded border border-[#283241] p-1.5 text-[#00ff66]" aria-label="Nova conversa"><Plus className="h-4 w-4" /></button>
          </div>
          {showNew && <form className="mb-3 space-y-2 rounded border border-[#283241] p-2" onSubmit={(e) => { e.preventDefault(); createConversation.mutate({ contactName: newName, contact: newContact, channel: "manual", consentRecorded: true }); }}>
            <input className={field} placeholder="Nome do contato" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            <input className={field} placeholder="WhatsApp / e-mail" value={newContact} onChange={(e) => setNewContact(e.target.value)} required />
            <button className="w-full rounded bg-[#00ff66] px-3 py-2 font-mono text-[10px] font-bold text-black" disabled={createConversation.isPending}>Criar conversa</button>
          </form>}
          <div className="space-y-1 overflow-y-auto">
            {conversations.map((c) => <button key={c.id} onClick={() => setSelectedId(c.id)} className={"w-full rounded border p-3 text-left " + (selectedId === c.id ? "border-[#00f0ff] bg-[#101a20]" : "border-transparent hover:bg-[#151a20]")}>
              <div className="flex items-center justify-between gap-2"><span className="truncate font-mono text-xs font-bold text-[#e0e6ed]">{c.contactName}</span><span className="text-[9px] text-[#606d80]">#{c.id}</span></div>
              <div className="mt-1 truncate font-mono text-[10px] text-[#606d80]">{c.contact}</div>
              <div className="mt-2 font-mono text-[9px] uppercase text-[#00f0ff]">{c.status.replace("_", " ")}</div>
            </button>)}
            {!conversations.length && <p className="py-8 text-center font-mono text-[10px] text-[#606d80]">Nenhuma conversa registrada.</p>}
          </div>
        </aside>

        <div className={panel + " flex min-w-0 flex-col p-3"}>
          {selected ? <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f242d] pb-3">
              <div><div className="font-mono text-sm font-bold text-[#e0e6ed]">{selected.contactName}</div><div className="mt-1 font-mono text-[10px] text-[#606d80]">{selected.contact} · {selected.channel}</div></div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handoff.mutate({ conversationId: selected.id })} className="rounded border border-amber-500/40 px-3 py-2 font-mono text-[10px] text-amber-300">Assumir atendimento</button>
                <a href={HUMAN_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded border border-[#00ff66]/40 px-3 py-2 font-mono text-[10px] text-[#00ff66]">WhatsApp humano <ExternalLink className="h-3 w-3" /></a>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {messages.map((m) => <div key={m.id} className={"flex " + (m.direction === "outbound" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[85%] rounded-lg border px-3 py-2 " + (m.senderType === "bot" ? "border-[#00f0ff]/30 bg-[#07151a]" : m.senderType === "human" ? "border-[#00ff66]/30 bg-[#0b160f]" : "border-[#283241] bg-[#050505]")}>
                  <div className="mb-1 flex items-center gap-1 font-mono text-[9px] uppercase text-[#7d8a98]">{m.senderType === "bot" ? <Bot className="h-3 w-3" /> : m.senderType === "human" ? <UserRound className="h-3 w-3" /> : null}{m.senderType}</div>
                  <p className="whitespace-pre-wrap font-mono text-xs leading-5 text-[#e0e6ed]">{m.content}</p>
                </div>
              </div>)}
              {!messages.length && <p className="py-12 text-center font-mono text-xs text-[#606d80]">Histórico vazio.</p>}
            </div>
            <div className="border-t border-[#1f242d] pt-3">
              <form onSubmit={sendReply} className="flex gap-2">
                <input className={field} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Responder como atendente humano…" />
                <button disabled={replyMessage.isPending || !message.trim()} className="rounded bg-[#00ff66] px-4 text-black disabled:opacity-40" aria-label="Enviar resposta"><Send className="h-4 w-4" /></button>
              </form>
              <button onClick={simulateInbound} className="mt-2 font-mono text-[9px] text-[#606d80] underline">Simular mensagem de contato para testar o bot</button>
            </div>
          </> : <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-[#606d80]"><Bot className="h-8 w-8 text-[#00f0ff]" /><p className="font-mono text-xs">Selecione uma conversa ou crie um novo contato.</p></div>}
        </div>
      </div>
      <div className="rounded border border-amber-500/20 bg-amber-500/5 p-3 font-mono text-[10px] leading-5 text-[#a9a18d]">
        Chatbot inicial baseado em regras, com histórico persistente no banco. A conexão WhatsApp/Meta, webhook de entrada e envio automático ainda dependem de credenciais e configuração do provedor. O botão WhatsApp abre o canal humano informado; não sincroniza mensagens automaticamente.
      </div>
    </section>
  );
}
