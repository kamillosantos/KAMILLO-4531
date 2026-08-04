import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "../reveal";
import { faqs } from "../../data/faq";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 bg-[var(--bg-2)] border-y border-[var(--border)]">
      <div className="container-x">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <span className="eyebrow">Dúvidas frequentes</span>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-white leading-tight">
            Perguntas <span className="text-gradient-blue">frequentes</span>
          </h2>
        </Reveal>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => {
            const active = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div
                  className="glass rounded-xl overflow-hidden transition-colors"
                  style={{ borderColor: active ? "rgba(96,165,250,0.4)" : "var(--border)" }}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 bg-transparent border-none cursor-pointer"
                    onClick={() => setOpen(active ? null : i)}
                    aria-expanded={active}
                  >
                    <span className="text-white font-semibold text-[1.02rem]">{f.q}</span>
                    <Plus
                      size={20}
                      className="text-[#60a5fa] shrink-0 transition-transform duration-300"
                      style={{ transform: active ? "rotate(45deg)" : "none" }}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300"
                    style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[#a9b6d6] text-[0.96rem] leading-relaxed m-0">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
