import type { Hono } from "hono";

type CreativeBrief = {
  brief: string;
  format?: "16:9" | "9:16" | "1:1" | "4:5";
  durationSeconds?: number;
  destination?: "youtube" | "instagram" | "web" | "internal";
  style?: string;
  language?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function configured(name: string) {
  return Boolean(process.env[name]?.trim());
}

function engineCatalog() {
  return [
    { id: "9router", role: "llm-director", mode: "api", configured: configured("NINE_ROUTER_API_KEY") && configured("NINE_ROUTER_BASE_URL"), capability: "briefing, roteiro, storyboard e plano de produção" },
    { id: "google-vids", role: "creative-editor", mode: "human-handoff", configured: configured("KJS_GOOGLE_VIDS_WORKFLOW_URL"), capability: "edição e montagem assistida; sem API pública de automação presumida" },
    { id: "youtube-create", role: "mobile-editor", mode: "human-handoff", configured: configured("KJS_YOUTUBE_CREATE_WORKFLOW_URL"), capability: "edição mobile e exportação; sem API pública de automação presumida" },
    { id: "youtube-data-api", role: "publishing", mode: "oauth-api", configured: configured("YOUTUBE_ACCESS_TOKEN"), capability: "upload/publicação via YouTube Data API após OAuth e consentimento" },
    { id: "obs", role: "capture-composition", mode: "adapter", configured: configured("KJS_OBS_CONTROL_URL"), capability: "captura e composição" },
    { id: "ffmpeg", role: "media-processing", mode: "worker", configured: configured("KJS_FFMPEG_WORKER_URL"), capability: "transcodificação, normalização e empacotamento" },
    { id: "srs", role: "live-ingest-delivery", mode: "adapter", configured: configured("KJS_SRS_API_URL"), capability: "ingestão e distribuição ao vivo" },
    { id: "data-genius", role: "observability", mode: "event-sink", configured: configured("DATA_GENIUS_INGEST_URL") && configured("DATA_GENIUS_INGEST_TOKEN"), capability: "eventos operacionais verificáveis" },
  ];
}

async function callDirector(input: CreativeBrief, requestId: string) {
  const base = (process.env.NINE_ROUTER_BASE_URL || "https://9router.com/v1").replace(/\/+$/, "");
  const key = process.env.NINE_ROUTER_API_KEY;
  const model = process.env.NINE_ROUTER_MODEL;
  if (!key || !model) throw new Error("NINE_ROUTER_API_KEY e NINE_ROUTER_MODEL precisam estar configurados no servidor.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Você é o diretor executivo audiovisual KJS. Responda somente JSON válido com: concept, logline, audience, script, storyboard (array de cenas com scene, duration_seconds, visual, camera, audio, transition), production_plan (array), required_assets (array), postproduction, delivery_specs, rights_and_consent, risks, next_approval. Não afirme que gerou/renderizou/publicou arquivos. Não invente capacidades de ferramentas. Separe plano de execução. Use português brasileiro." },
          { role: "user", content: JSON.stringify({ request_id: requestId, ...input }) },
        ],
      }),
    });
    if (!response.ok) throw new Error(`9Router respondeu HTTP ${response.status}.`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("9Router retornou resposta vazia.");
    let plan: unknown;
    try { plan = JSON.parse(content); } catch { throw new Error("A resposta do diretor não veio em JSON válido."); }
    return plan;
  } finally {
    clearTimeout(timeout);
  }
}

export function mountCreativeOrchestrator(app: Hono) {
  app.get("/api/creative/health", (c) => c.json({
    service: "KJS Creative Orchestrator",
    status: "available",
    timestamp: new Date().toISOString(),
    engines: engineCatalog(),
    execution_policy: "planning_only_until_each_engine_is_authorized_and_connected",
  }));

  app.get("/api/creative/engines", (c) => c.json({ engines: engineCatalog() }));

  app.post("/api/creative/plan", async (c) => {
    const expected = process.env.KJS_CREATIVE_API_TOKEN;
    if (!expected) return c.json({ error: "KJS_CREATIVE_API_TOKEN não configurado no servidor." }, 503);
    const auth = c.req.header("authorization") || "";
    const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!safeEqual(supplied, expected)) return c.json({ error: "Não autorizado." }, 401);

    const requestId = crypto.randomUUID();
    let input: CreativeBrief;
    try {
      const raw = await c.req.text();
      if (raw.length > 32_000) return c.json({ error: "Briefing excede 32 KB." }, 413);
      const body = JSON.parse(raw) as Partial<CreativeBrief>;
      if (typeof body.brief !== "string" || body.brief.trim().length < 20 || body.brief.length > 12_000) {
        return c.json({ error: "brief deve conter de 20 a 12.000 caracteres." }, 400);
      }
      input = {
        brief: body.brief.trim(),
        format: ["16:9", "9:16", "1:1", "4:5"].includes(String(body.format)) ? body.format as CreativeBrief["format"] : "16:9",
        durationSeconds: Number.isInteger(body.durationSeconds) ? Math.min(3600, Math.max(5, Number(body.durationSeconds))) : 60,
        destination: ["youtube", "instagram", "web", "internal"].includes(String(body.destination)) ? body.destination as CreativeBrief["destination"] : "internal",
        style: typeof body.style === "string" ? body.style.slice(0, 300) : "cinematográfico",
        language: typeof body.language === "string" ? body.language.slice(0, 40) : "pt-BR",
      };
    } catch {
      return c.json({ error: "JSON inválido." }, 400);
    }

    try {
      const plan = await callDirector(input, requestId);
      console.info(JSON.stringify({ event: "creative_plan_created", request_id: requestId, timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "unknown", source: "kjs-creative-orchestrator" }));
      return c.json({
        request_id: requestId,
        status: "PLAN_READY_FOR_HUMAN_APPROVAL",
        generated_at: new Date().toISOString(),
        plan,
        engines: engineCatalog(),
        execution_note: "Nenhum render, upload, edição em Google Vids/YouTube Create ou publicação foi executado por esta chamada.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha interna no diretor.";
      console.error(JSON.stringify({ event: "creative_plan_failed", request_id: requestId, timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "unknown", source: "kjs-creative-orchestrator", error: message }));
      return c.json({ request_id: requestId, status: "FAILED", error: message }, 502);
    }
  });
}
