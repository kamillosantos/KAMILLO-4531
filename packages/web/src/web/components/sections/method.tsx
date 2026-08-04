import { Reveal } from "../reveal";

const steps = [
  {
    letter: "C",
    title: "Captura",
    desc: "Atraímos a demanda certa com tráfego pago e SEO semântico — quem já busca pela sua solução e quem tem o perfil ideal.",
  },
  {
    letter: "P",
    title: "Persuasão",
    desc: "Oferta clara, páginas que convertem e conteúdo que constrói autoridade para transformar visitantes em interessados.",
  },
  {
    letter: "A",
    title: "Aquisição",
    desc: "Rastreamento confiável e otimização por dados para reduzir o CPA e conquistar clientes de forma escalável.",
  },
  {
    letter: "V",
    title: "Valor",
    desc: "Remarketing, nutrição e foco em LTV para maximizar o retorno de cada cliente ao longo do tempo.",
  },
];

export function Method() {
  return (
    <section id="metodo" className="relative py-24 bg-[var(--bg-2)] border-y border-[var(--border)]">
      <div className="absolute inset-0 grid-texture opacity-40" />
      <div className="container-x relative">
        <Reveal className="max-w-2xl mb-14">
          <span className="eyebrow">Metodologia proprietária</span>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-white leading-tight">
            Método <span className="text-gradient-blue">C.P.A.V.</span>
          </h2>
          <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
            O framework que transforma marketing em engenharia de aquisição. Quatro estágios que
            trabalham juntos para gerar crescimento previsível.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.letter} delay={i * 0.1}>
              <div className="glass card-hover rounded-2xl p-7 h-full relative overflow-hidden">
                <span
                  className="absolute -top-4 -right-2 font-display font-extrabold text-[6rem] leading-none select-none"
                  style={{ color: "rgba(96,165,250,0.08)" }}
                >
                  {s.letter}
                </span>
                <div
                  className="grid place-items-center w-11 h-11 rounded-xl font-display font-extrabold text-white text-lg mb-5"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#22d3ee)" }}
                >
                  {s.letter}
                </div>
                <h3 className="text-[1.2rem] font-bold text-white">{s.title}</h3>
                <p className="mt-2.5 text-[#93a2c4] text-[0.92rem] leading-relaxed relative z-10">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
