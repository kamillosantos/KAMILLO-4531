import { useMemo, useState } from "react";
import {
  Film,
  Clapperboard,
  BookOpen,
  GraduationCap,
  Megaphone,
  Radio,
  WandSparkles,
  ImagePlus,
  Mic,
  ShieldCheck,
  Activity,
  Sparkles,
  Youtube,
  Instagram,
  MonitorPlay,
  FileVideo,
  Clock3,
  CircleDot,
  Camera,
  AudioLines,
  Gauge,
} from "lucide-react";

type Category = "anime" | "audiobook" | "course";
type ProductionMode =
  | "vsl"
  | "advertising"
  | "filmed-theatre"
  | "live"
  | "cinema"
  | "documentary"
  | "education"
  | "social"
  | "ugc";

const CATEGORIES: {
  id: Category;
  title: string;
  description: string;
  icon: typeof Film;
}[] = [
  {
    id: "anime",
    title: "Anime Studio",
    description: "Personagens, universos, episódios, trailers e séries.",
    icon: Film,
  },
  {
    id: "audiobook",
    title: "Audiobooks ilustrados",
    description: "Capítulos narrados, cenas ilustradas e trilha sonora.",
    icon: BookOpen,
  },
  {
    id: "course",
    title: "Cursos com IA",
    description: "Aulas com roteiro, apresentador autorizado, voz e materiais.",
    icon: GraduationCap,
  },
];

const MODES: { id: ProductionMode; title: string; icon: typeof Film }[] = [
  { id: "vsl", title: "VSL", icon: Clapperboard },
  { id: "advertising", title: "Propaganda", icon: Megaphone },
  { id: "filmed-theatre", title: "Teatro filmado", icon: Film },
  { id: "live", title: "Live Studio", icon: Radio },
  { id: "cinema", title: "Cinema", icon: FileVideo },
  { id: "documentary", title: "Documentário", icon: BookOpen },
  { id: "education", title: "Educação", icon: GraduationCap },
  { id: "social", title: "Social Video", icon: MonitorPlay },
  { id: "ugc", title: "UGC Studio", icon: Camera },
];

const MODEL_OPTIONS = [
  { value: "auto", label: "Auto — selecionar melhor modelo" },
  { value: "openai", label: "OpenAI — roteiro e multimodal" },
  { value: "google", label: "Google — Gemini / Nano Banana / Vids" },
  { value: "manus", label: "Manus — agente executor" },
  { value: "manual", label: "Seleção manual / outro provedor" },
];

const PLATFORM_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "both", label: "YouTube + Instagram" },
  { value: "export", label: "Exportar para outras plataformas" },
];

const labelFor = (items: { id: string; title: string }[], id: string) =>
  items.find((item) => item.id === id)?.title ?? id;

export function ImperatorMovie() {
  const [category, setCategory] = useState<Category>("anime");
  const [mode, setMode] = useState<ProductionMode>("cinema");
  const [model, setModel] = useState("auto");
  const [platform, setPlatform] = useState("youtube");
  const [brief, setBrief] = useState("");
  const [duration, setDuration] = useState("60");
  const [ratio, setRatio] = useState("16:9");
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [likenessConsent, setLikenessConsent] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [audioName, setAudioName] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [resolution, setResolution] = useState("4k");
  const [frameRate, setFrameRate] = useState("24");
  const [vfx, setVfx] = useState<string[]>(["compositing", "particles"]);
  const [audioMix, setAudioMix] = useState("surround");
  const [audioCodec, setAudioCodec] = useState("dolby-atmos");
  const [ugcStyle, setUgcStyle] = useState("testimonial");
  const [colorGrade, setColorGrade] = useState("cinematic");

  const selectedCategory = useMemo(
    () => CATEGORIES.find((item) => item.id === category)!,
    [category],
  );

  const prepareBrief = () => setPrepared(true);
  const toggleVfx = (value: string) => {
    setVfx((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setPrepared(false);
  };

  return (
    <section className="space-y-6 text-[#e0e6ed]">
      <header className="relative overflow-hidden rounded-xl border border-[#27313d] bg-gradient-to-br from-[#111a25] via-[#0b1017] to-[#101018] p-6">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#00ff66]/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#00ff66]">
              <Sparkles className="h-4 w-4" /> KJS Creative Intelligence
            </div>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">
              IMPERATOR MOVIE <span className="text-[#00ff66]">Ω</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9ba8b8]">
              Agente de direção e produção audiovisual multimodelo. Crie o
              briefing, escolha o formato e prepare o fluxo de produção.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-[#00ff66]/30 bg-[#00ff66]/10 px-3 py-2 text-[10px] font-bold tracking-wider text-[#00ff66]">
            <CircleDot className="h-3 w-3" /> AGENTE EM CONFIGURAÇÃO
          </div>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {CATEGORIES.map((item, index) => {
          const Icon = item.icon;
          const active = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategory(item.id);
                setPrepared(false);
              }}
              className={`rounded-xl border p-4 text-left transition hover:border-[#00ff66]/50 ${
                active
                  ? "border-[#00ff66] bg-[#0d1c17] shadow-[0_0_24px_rgba(0,255,102,0.08)]"
                  : "border-[#27313d] bg-[#0d1117]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#68788b]">
                  0{index + 1}
                </span>
                <Icon className={`h-5 w-5 ${active ? "text-[#00ff66]" : "text-[#91a0b2]"}`} />
              </div>
              <div className="text-sm font-bold">{item.title}</div>
              <p className="mt-2 text-xs leading-5 text-[#8795a6]">{item.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <div className="space-y-5 rounded-xl border border-[#27313d] bg-[#0d1117] p-5">
          <div className="flex items-center gap-2">
            <Clapperboard className="h-4 w-4 text-[#00ff66]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Direção de produção</h2>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
              Modo de criação
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MODES.map((item) => {
                const Icon = item.icon;
                const active = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMode(item.id);
                      setPrepared(false);
                    }}
                    className={`flex min-h-16 flex-col items-start justify-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${
                      active
                        ? "border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]"
                        : "border-[#27313d] text-[#a8b3c1] hover:bg-[#151c25]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="movie-brief" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
              Ideia, tema ou briefing
            </label>
            <textarea
              id="movie-brief"
              value={brief}
              onChange={(event) => {
                setBrief(event.target.value);
                setPrepared(false);
              }}
              rows={5}
              placeholder="Descreva a história, objetivo, público, mensagem, personagens ou experiência audiovisual..."
              className="w-full resize-y rounded-lg border border-[#27313d] bg-[#070b10] px-4 py-3 text-sm text-[#e0e6ed] outline-none placeholder:text-[#536174] focus:border-[#00ff66]/70"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="movie-model" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                Orquestrador de modelos
              </label>
              <select
                id="movie-model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70"
              >
                {MODEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="movie-platform" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                Destino
              </label>
              <select
                id="movie-platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70"
              >
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="movie-duration" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                Duração pretendida
              </label>
              <select
                id="movie-duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70"
              >
                <option value="15">15 segundos</option>
                <option value="30">30 segundos</option>
                <option value="60">1 minuto</option>
                <option value="180">3 minutos</option>
                <option value="600">10 minutos</option>
                <option value="custom">Personalizada / longa</option>
              </select>
            </div>
            <div>
              <label htmlFor="movie-ratio" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                Proporção
              </label>
              <select
                id="movie-ratio"
                value={ratio}
                onChange={(event) => setRatio(event.target.value)}
                className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70"
              >
                <option value="16:9">16:9 — horizontal</option>
                <option value="9:16">9:16 — vertical</option>
                <option value="1:1">1:1 — quadrado</option>
                <option value="4:5">4:5 — retrato</option>
                <option value="custom">Personalizada</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#344252] bg-[#080c12] p-4 hover:border-[#00ff66]/60">
              <ImagePlus className="h-5 w-5 shrink-0 text-[#00ff66]" />
              <span className="min-w-0">
                <span className="block text-xs font-bold">Foto de referência</span>
                <span className="block truncate text-[10px] text-[#738196]">{photoName || "Selecionar imagem (opcional)"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")}
                />
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#344252] bg-[#080c12] p-4 hover:border-[#00ff66]/60">
              <Mic className="h-5 w-5 shrink-0 text-[#00ff66]" />
              <span className="min-w-0">
                <span className="block text-xs font-bold">Áudio de referência</span>
                <span className="block truncate text-[10px] text-[#738196]">{audioName || "Selecionar áudio (opcional)"}</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="sr-only"
                  onChange={(event) => setAudioName(event.target.files?.[0]?.name ?? "")}
                />
              </span>
            </label>
          </div>

          <div className="space-y-4 rounded-lg border border-[#27313d] bg-[#080c12] p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#00ff66]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Cinema Pro · UGC · VFX</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="movie-resolution" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                  Resolução de master
                </label>
                <select id="movie-resolution" value={resolution} onChange={(event) => { setResolution(event.target.value); setPrepared(false); }} className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70">
                  <option value="1080p">Full HD · 1080p</option>
                  <option value="4k">4K UHD</option>
                  <option value="6k">6K</option>
                  <option value="8k">8K · master premium</option>
                  <option value="source">Resolução máxima da fonte</option>
                </select>
              </div>
              <div>
                <label htmlFor="movie-fps" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                  Cadência de imagem
                </label>
                <select id="movie-fps" value={frameRate} onChange={(event) => { setFrameRate(event.target.value); setPrepared(false); }} className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70">
                  <option value="24">24 fps · cinema</option>
                  <option value="25">25 fps · broadcast</option>
                  <option value="30">30 fps · digital</option>
                  <option value="50">50 fps · motion</option>
                  <option value="60">60 fps · high frame rate</option>
                </select>
              </div>
              <div>
                <label htmlFor="movie-grade" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                  Direção de cor
                </label>
                <select id="movie-grade" value={colorGrade} onChange={(event) => { setColorGrade(event.target.value); setPrepared(false); }} className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70">
                  <option value="cinematic">Cinema · film look</option>
                  <option value="documentary">Natural · documentário</option>
                  <option value="commercial">Publicidade · clean</option>
                  <option value="vintage">Vintage · película</option>
                  <option value="custom">Custom LUT / referência</option>
                </select>
              </div>
              <div>
                <label htmlFor="movie-ugc" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                  Linguagem UGC
                </label>
                <select id="movie-ugc" value={ugcStyle} onChange={(event) => { setUgcStyle(event.target.value); setPrepared(false); }} className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70">
                  <option value="testimonial">Depoimento / testimonial</option>
                  <option value="unboxing">Unboxing / demonstração</option>
                  <option value="creator">Creator / selfie editorial</option>
                  <option value="storytime">Storytime / experiência</option>
                  <option value="tutorial">Tutorial / prova de uso</option>
                  <option value="hybrid">Híbrido UGC + cinema</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">Efeitos especiais e pós-produção</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["compositing", "Composição / chroma"],
                  ["particles", "Partículas / atmos"],
                  ["motion", "Motion graphics"],
                  ["cgi", "CGI / 3D"],
                  ["cleanup", "Cleanup / remoção"],
                  ["transitions", "Transições avançadas"],
                  ["stabilization", "Estabilização"],
                  ["upscale", "Upscale / restauração"],
                  ["tracking", "Tracking / matchmove"],
                ].map(([value, label]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md border border-[#27313d] bg-[#0b1017] px-2 py-2 text-[10px] text-[#a6b2c1]">
                    <input type="checkbox" checked={vfx.includes(value)} onChange={() => toggleVfx(value)} className="accent-[#00ff66]" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-[#27313d] bg-[#080c12] p-4">
            <div className="flex items-center gap-2">
              <AudioLines className="h-4 w-4 text-[#00ff66]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Cinema Audio · Digital Surround</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="movie-audio" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                  Mixagem
                </label>
                <select id="movie-audio" value={audioMix} onChange={(event) => { setAudioMix(event.target.value); setPrepared(false); }} className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70">
                  <option value="stereo">Estéreo</option>
                  <option value="surround">5.1 Digital Surround</option>
                  <option value="7.1">7.1 Surround</option>
                  <option value="immersive">Áudio imersivo / espacial</option>
                  <option value="adaptive">Adaptável à plataforma</option>
                </select>
              </div>
              <div>
                <label htmlFor="movie-codec" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8190a2]">
                  Entrega / formato de áudio
                </label>
                <select id="movie-codec" value={audioCodec} onChange={(event) => { setAudioCodec(event.target.value); setPrepared(false); }} className="w-full rounded-lg border border-[#27313d] bg-[#070b10] px-3 py-3 text-xs text-[#d8e0e9] outline-none focus:border-[#00ff66]/70">
                  <option value="dolby-atmos">Dolby Atmos — se suportado</option>
                  <option value="pcm">PCM / WAV master</option>
                  <option value="aac">AAC — distribuição digital</option>
                  <option value="eac3">Dolby Digital Plus / E-AC-3</option>
                </select>
              </div>
            </div>
            <p className="text-[10px] leading-4 text-[#738196]">
              Mixagem 5.1/7.1/Atmos exige trilhas e renderizador compatíveis. O seletor define a especificação desejada; não afirma que a plataforma de destino aceite esse formato.
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-[#27313d] bg-[#080c12] p-4">
            <div className="flex items-center gap-2 text-xs font-bold">
              <ShieldCheck className="h-4 w-4 text-[#00ff66]" /> Autorização de imagem e voz
            </div>
            <label className="flex items-start gap-2 text-xs leading-5 text-[#a6b2c1]">
              <input type="checkbox" checked={likenessConsent} onChange={(event) => setLikenessConsent(event.target.checked)} className="mt-1 accent-[#00ff66]" />
              Confirmo que tenho autorização para utilizar a imagem da pessoa retratada.
            </label>
            <label className="flex items-start gap-2 text-xs leading-5 text-[#a6b2c1]">
              <input type="checkbox" checked={voiceConsent} onChange={(event) => setVoiceConsent(event.target.checked)} className="mt-1 accent-[#00ff66]" />
              Confirmo que tenho autorização para utilizar a voz fornecida.
            </label>
            <p className="text-[10px] leading-4 text-[#68788b]">
              Os arquivos selecionados permanecem apenas no navegador nesta versão. Nenhum upload ou clonagem de voz é executado.
            </p>
          </div>

          <button
            type="button"
            onClick={prepareBrief}
            disabled={!brief.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00ff66] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#041008] transition hover:bg-[#52ff98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <WandSparkles className="h-4 w-4" /> Preparar briefing de produção
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-[#27313d] bg-[#0d1117] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#00ff66]" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Telemetria do agente</h2>
            </div>
            <div className="space-y-3">
              {[
                ["Interface do agente", "Disponível", "ok"],
                ["Orquestração de modelos", "Integração pendente", "pending"],
                ["Renderização 4K/8K e VFX", "Pipeline não conectado", "pending"],
                ["Mixagem surround / Atmos", "Pipeline de áudio pendente", "pending"],
                ["YouTube / Instagram", "Autorização pendente", "pending"],
                ["Data Genius", "Instrumentação pendente", "pending"],
              ].map(([name, status, state]) => (
                <div key={name} className="flex items-center justify-between gap-3 border-b border-[#202a35] pb-2 last:border-0">
                  <span className="text-[11px] text-[#9ba8b8]">{name}</span>
                  <span className={`text-right text-[10px] ${state === "ok" ? "text-[#00ff66]" : "text-[#e5b96b]"}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#27313d] bg-[#0d1117] p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#00ff66]" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Privacidade e cookies</h2>
            </div>
            <p className="text-xs leading-5 text-[#8f9cad]">
              Medição própria será ativada somente após configuração de finalidade, retenção e mecanismo de consentimento aplicável. Esta interface ainda não grava cookies nem envia eventos de produção.
            </p>
            <div className="mt-3 rounded-md bg-[#080c12] p-3 text-[10px] text-[#e5b96b]">
              STATUS: aguardando integração auditável
            </div>
          </div>

          <div className="rounded-xl border border-[#27313d] bg-[#0d1117] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#00ff66]" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Resumo do projeto</h2>
            </div>
            {prepared ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-[#00ff66]">Briefing preparado localmente</div>
                <div className="text-[#aab5c3]">{selectedCategory.title} · {labelFor(MODES, mode)}</div>
                <div className="text-[#8290a1]">Modelo: {MODEL_OPTIONS.find((item) => item.value === model)?.label}</div>
                <div className="text-[#8290a1]">Destino: {PLATFORM_OPTIONS.find((item) => item.value === platform)?.label}</div>
                <div className="text-[#8290a1]">Duração: {duration === "custom" ? "Personalizada" : `${duration} segundos`} · {ratio}</div>
                <div className="text-[#8290a1]">Master: {resolution.toUpperCase()} · {frameRate} fps · {colorGrade}</div>
                <div className="text-[#8290a1]">UGC: {ugcStyle} · VFX: {vfx.length ? vfx.join(", ") : "nenhum selecionado"}</div>
                <div className="text-[#8290a1]">Áudio: {audioMix} · {audioCodec}</div>
                {(photoName || audioName) && <div className="text-[#8290a1]">Referências: {[photoName, audioName].filter(Boolean).join(" · ")}</div>}
                {(photoName || audioName) && (!likenessConsent && photoName || !voiceConsent && audioName) && (
                  <div className="rounded bg-[#2b2113] p-2 text-[10px] text-[#e5b96b]">Confirme as autorizações aplicáveis antes de qualquer uso de imagem ou voz.</div>
                )}
                <p className="border-t border-[#27313d] pt-2 leading-5 text-[#8290a1]">{brief}</p>
                <p className="text-[10px] text-[#e5b96b]">Prévia local — especificação de master selecionada; geração, renderização e publicação ainda não foram executadas.</p>
              </div>
            ) : (
              <p className="text-xs leading-5 text-[#8290a1]">
                Selecione uma categoria, um modo e descreva a produção. O resumo aparecerá aqui antes de qualquer integração externa.
              </p>
            )}
          </div>
        </aside>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#27313d] bg-[#0a0e13] px-4 py-3 text-[10px] text-[#718094]">
        <span className="flex items-center gap-2"><Youtube className="h-3.5 w-3.5" /><Instagram className="h-3.5 w-3.5" /> Destinos preparados; publicação depende de conexão autorizada.</span>
        <span>AGENT ID: KJS-IMPERATOR-MOVIE-Ω</span>
      </footer>
    </section>
  );
}
