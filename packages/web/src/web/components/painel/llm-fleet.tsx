import { Activity, Bot, Cloud, Cpu, Gauge, ShieldAlert } from "lucide-react";

type FleetNode = {
  id: string;
  name: string;
  role: string;
  provider: string;
  status: "NOT_CONNECTED" | "ORCHESTRATOR_ONLY";
  evidence: string;
};

const NODES: FleetNode[] = [
  {
    id: "cloud-imperator",
    name: "KJS Cloud Imperador",
    role: "Orquestrador central",
    provider: "Control plane KJS",
    status: "ORCHESTRATOR_ONLY",
    evidence: "Arquitetura definida; despacho multi-LLM e telemetria ainda não comprovados.",
  },
  {
    id: "gpt",
    name: "GPT KJS Autônomo",
    role: "Raciocínio, planejamento e síntese",
    provider: "OpenAI API",
    status: "NOT_CONNECTED",
    evidence: "Nenhuma chamada OpenAI API ou credencial operacional comprovada no repositório.",
  },
  {
    id: "meta",
    name: "Meta KJS Autônomo",
    role: "Agente especializado Meta / Llama",
    provider: "Meta AI / endpoint autorizado",
    status: "NOT_CONNECTED",
    evidence: "Nenhum endpoint de inferência Meta configurado ou evento de execução registrado.",
  },
  {
    id: "gemini",
    name: "Gemini KJS Autônomo",
    role: "Pesquisa, análise multimodal e validação",
    provider: "Google Gemini API",
    status: "NOT_CONNECTED",
    evidence: "Nenhuma chamada Gemini API ou credencial operacional comprovada no repositório.",
  },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#1f242d] bg-[#0d0f12] p-3">
      <div className="text-[10px] uppercase tracking-wider text-[#606d80]">{label}</div>
      <div className="mt-2 text-sm font-semibold text-amber-300">{value}</div>
    </div>
  );
}

export function LLMFleet() {
  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <Activity className="h-5 w-5" />
          <h1 className="text-sm font-bold uppercase tracking-widest">KJS LLM Fleet · Cloud Imperador</h1>
        </div>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-[#8994a5]">
          Central de produtividade multi-modelo. Indicadores só serão preenchidos por chamadas reais,
          logs persistidos e resultados auditáveis. Ausência de registro significa dado desconhecido,
          nunca produtividade zero ou execução presumida.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Chamadas reais" value="SEM TELEMETRIA" />
        <Metric label="Tarefas concluídas" value="SEM TELEMETRIA" />
        <Metric label="Latência p50 / p95" value="SEM TELEMETRIA" />
        <Metric label="Custo por tarefa" value="SEM TELEMETRIA" />
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {NODES.map((node) => {
          const orchestrator = node.status === "ORCHESTRATOR_ONLY";
          return (
            <article key={node.id} className="rounded border border-[#1f242d] bg-[#0d0f12] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded border border-[#26313d] bg-[#111820] p-2 text-[#00f0ff]">
                    {node.id === "cloud-imperator" ? <Cloud className="h-5 w-5" /> : node.id === "gpt" ? <Bot className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#e0e6ed]">{node.name}</h2>
                    <p className="mt-1 text-[10px] text-[#8994a5]">{node.role}</p>
                  </div>
                </div>
                <span className={`rounded border px-2 py-1 text-[9px] font-bold tracking-wider ${orchestrator ? "border-amber-500/40 text-amber-300" : "border-red-500/40 text-red-300"}`}>
                  {orchestrator ? "ORQUESTRADOR · SEM DISPATCH" : "NÃO CONECTADO"}
                </span>
              </div>
              <div className="mt-4 text-[10px] text-[#606d80]">PROVEDOR: {node.provider}</div>
              <p className="mt-2 min-h-10 text-xs leading-5 text-[#aab4c2]">{node.evidence}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Metric label="Execuções" value="NÃO DISPONÍVEL" />
                <Metric label="Sucesso / erro" value="NÃO DISPONÍVEL" />
                <Metric label="Tokens / custo" value="NÃO DISPONÍVEL" />
                <Metric label="Tempo / tarefa" value="NÃO DISPONÍVEL" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-amber-300">
          <ShieldAlert className="h-4 w-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Ativação operacional pendente</h2>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#aab4c2]">
          O código atual não contém adaptadores ativos para OpenAI, Meta Llama ou Gemini,
          nem uma fila de despacho multi-modelo com telemetria. Para ativar chamadas reais:
          configurar credenciais no secret manager, implementar adaptadores oficiais,
          persistir cada execução e validar permissões, limites e custos. Nenhuma chave deve
          ser inserida no frontend ou commitada no Git.
        </p>
      </div>

      <div className="rounded border border-[#1f242d] bg-[#0d0f12] p-4">
        <div className="mb-3 flex items-center gap-2 text-[#00f0ff]">
          <Gauge className="h-4 w-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Contrato de produtividade</h2>
        </div>
        <div className="grid gap-2 text-xs text-[#aab4c2] sm:grid-cols-2">
          <p>• Volume: chamadas iniciadas e tarefas únicas.</p>
          <p>• Qualidade: sucesso técnico e avaliação humana.</p>
          <p>• Eficiência: tokens, custo e latência por tarefa.</p>
          <p>• Confiabilidade: erros, retries e disponibilidade.</p>
          <p>• Resultado: entregas aceitas e retrabalho.</p>
          <p>• Proveniência: modelo, versão, timestamp e correlation ID.</p>
        </div>
      </div>
    </section>
  );
}
