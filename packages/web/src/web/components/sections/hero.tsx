import { motion } from "motion/react";
import { MessageCircle, ArrowDown, ShieldCheck, TrendingUp, Search } from "lucide-react";
import { Hero3D } from "../hero-3d";
import { site } from "../../lib/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-mesh pt-24 pb-16">
      <div className="absolute inset-0 grid-texture opacity-70" />
      <div className="absolute inset-0 md:left-[42%] pointer-events-none md:pointer-events-auto opacity-70 md:opacity-100">
        <Hero3D />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />

      <div className="container-x relative z-10">
        <div className="max-w-2xl">
          <motion.span
            className="chip"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShieldCheck size={14} className="text-[#22d3ee]" /> {site.role}
          </motion.span>

          <motion.h1
            className="mt-6 text-[clamp(2.3rem,5.5vw,4rem)] font-extrabold leading-[1.05]"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <span className="text-white">Assessoria de </span>
            <span className="text-gradient">Marketing Digital</span>
            <span className="text-white"> que vira máquina de leads</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-[1.15rem] leading-relaxed text-[#a9b6d6] max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            Com <strong className="text-white">Kamillo Santos</strong>, gestor de tráfego sênior:
            estratégia, tráfego pago, gestão de mídias sociais, pesquisa de mercado e otimização de
            sites (SEO) para atrair clientes de forma <strong className="text-white">previsível e
            escalável</strong>.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
          >
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageCircle size={19} /> Solicitar diagnóstico gratuito
            </a>
            <a href="#servicos" className="btn-ghost">
              Ver serviços <ArrowDown size={17} />
            </a>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[#8ea0c6] text-[0.9rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.34 }}
          >
            <span className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#60a5fa]" /> ROAS previsível
            </span>
            <span className="flex items-center gap-2">
              <Search size={16} className="text-[#22d3ee]" /> SEO semântico
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#8b5cf6]" /> CPA controlado
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
