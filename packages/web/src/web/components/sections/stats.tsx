import { Reveal } from "../reveal";

const stats = [
  { value: "+10 anos", label: "de experiência em tráfego e growth" },
  { value: "Google Partner", label: "parceiro oficial · Premier 2024" },
  { value: "Data-driven", label: "decisões por CPA, ROAS e LTV" },
  { value: "Brasil", label: "atendimento remoto em todo o país" },
];

export function Stats() {
  return (
    <section className="relative bg-[var(--bg-2)] border-y border-[var(--border)]">
      <div className="container-x py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center md:text-left">
              <div className="font-display font-extrabold text-[1.7rem] md:text-[2rem] text-gradient-blue leading-none">
                {s.value}
              </div>
              <div className="mt-2 text-[#93a2c4] text-[0.88rem] leading-snug">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
