import { useState } from "react";
import { Loader2, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Reveal } from "../reveal";
import { useCreateLead } from "../../queries/leads";
import { services } from "../../data/services";
import { site } from "../../lib/site";

export function LeadForm() {
  const createLead = useCreateLead();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    company: "",
    service: services[0].title,
    message: "",
  });
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createLead.isPending) return;
    createLead.mutate(
      { ...form, source: "site-form" },
      { onSuccess: () => setDone(true) },
    );
  };

  return (
    <section id="contato" className="relative py-24 bg-mesh">
      <div className="absolute inset-0 grid-texture opacity-40" />
      <div className="container-x relative">
        <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto glow-primary">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] items-center">
            <Reveal>
              <span className="eyebrow">Diagnóstico gratuito</span>
              <h2 className="mt-4 text-[clamp(1.7rem,3.5vw,2.4rem)] font-extrabold text-white leading-tight">
                Vamos construir sua <span className="text-gradient-blue">máquina de leads</span>?
              </h2>
              <p className="mt-4 text-[#a9b6d6] leading-relaxed">
                Preencha o formulário ou fale direto no WhatsApp. Você recebe um diagnóstico do seu
                marketing e um plano de ação — sem compromisso.
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-6"
                style={{ background: "rgba(37,211,102,0.12)", borderColor: "rgba(37,211,102,0.4)" }}
              >
                <MessageCircle size={18} className="text-[#25d366]" /> Prefiro o WhatsApp
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={54} className="text-[#22d3ee] mx-auto" />
                  <h3 className="mt-4 text-white font-bold text-xl">Recebido!</h3>
                  <p className="mt-2 text-[#a9b6d6]">
                    Obrigado, {form.name.split(" ")[0] || "tudo certo"}. Em breve entro em contato.
                    Para agilizar, chame no WhatsApp.
                  </p>
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6"
                    style={{ background: "linear-gradient(100deg,#25d366,#1faf51)" }}
                  >
                    <MessageCircle size={18} /> Falar agora
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-3.5">
                  <Field label="Nome" value={form.name} onChange={set("name")} required placeholder="Seu nome" />
                  <Field
                    label="WhatsApp ou e-mail"
                    value={form.contact}
                    onChange={set("contact")}
                    required
                    placeholder="(00) 00000-0000"
                  />
                  <Field
                    label="Empresa (opcional)"
                    value={form.company}
                    onChange={set("company")}
                    placeholder="Nome da empresa"
                  />
                  <div>
                    <label className="block text-[#93a2c4] text-[0.82rem] font-semibold mb-1.5">
                      Serviço de interesse
                    </label>
                    <select
                      value={form.service}
                      onChange={set("service")}
                      className="w-full rounded-lg bg-[rgba(4,6,15,0.6)] border border-[var(--border)] px-4 py-3 text-white text-[0.95rem] outline-none focus:border-[#3b82f6]"
                    >
                      {services.map((s) => (
                        <option key={s.slug} value={s.title} className="bg-[#0b1122]">
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#93a2c4] text-[0.82rem] font-semibold mb-1.5">
                      Mensagem (opcional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      rows={2}
                      placeholder="Conte rapidamente seu objetivo"
                      className="w-full rounded-lg bg-[rgba(4,6,15,0.6)] border border-[var(--border)] px-4 py-3 text-white text-[0.95rem] outline-none focus:border-[#3b82f6] resize-none"
                    />
                  </div>
                  {createLead.isError && (
                    <p className="text-[#f87171] text-sm">
                      Algo deu errado. Tente novamente ou fale no WhatsApp.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={createLead.isPending}
                    className="btn-primary w-full justify-center disabled:opacity-70"
                  >
                    {createLead.isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={17} /> Solicitar diagnóstico gratuito
                      </>
                    )}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-[#93a2c4] text-[0.82rem] font-semibold mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg bg-[rgba(4,6,15,0.6)] border border-[var(--border)] px-4 py-3 text-white text-[0.95rem] outline-none focus:border-[#3b82f6] placeholder:text-[#5f6f92]"
      />
    </div>
  );
}
