import { createClient } from "@libsql/client";
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const r = await c.execute("select id,name,contact,source,created_at from leads where source='garimpo' order by id desc limit 3");
console.log(JSON.stringify(r.rows, null, 2));
