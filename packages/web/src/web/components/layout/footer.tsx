import { Link } from "wouter";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { site } from "../../lib/site";
import { services } from "../../data/services";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg-2)]">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="grid place-items-center w-9 h-9 rounded-lg font-display font-extrabold text-white text-lg"
                style={{ background: "linear-gradient(135deg,#3b82f6,#22d3ee)" }}
              >
                K
              </span>
              <span className="font-display font-bold text-white">
                Kamillo<span className="text-[#60a5fa]">.</span>Santos
              </span>
            </div>
            <p className="text-[#93a2c4] text-[0.95rem] leading-relaxed max-w-sm">
              Assessoria de marketing digital e gestão de tráfego sênior. Engenharia de
              aquisição para escala previsível: estratégia, tráfego pago, mídias sociais,
              pesquisa de mercado e SEO.
            </p>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 !py-3 !px-6 !text-[0.92rem]"
            >
              <MessageCircle size={17} /> Solicitar diagnóstico
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-[0.95rem]">Serviços</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {services.map((s) => (
                <li key={s.slug}>
                  <a
                    href="/#servicos"
                    className="text-[#93a2c4] hover:text-white text-[0.9rem] no-underline transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-[0.95rem]">Navegação</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              <li>
                <Link to="/blog" className="text-[#93a2c4] hover:text-white text-[0.9rem] no-underline">
                  Blog & Conteúdo
                </Link>
              </li>
              <li>
                <a href="/#metodo" className="text-[#93a2c4] hover:text-white text-[0.9rem] no-underline">
                  Método C.P.A.V.
                </a>
              </li>
              <li>
                <a href="/#sobre" className="text-[#93a2c4] hover:text-white text-[0.9rem] no-underline">
                  Sobre Kamillo
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-[#93a2c4] hover:text-white text-[0.9rem] no-underline">
                  Perguntas frequentes
                </a>
              </li>
            </ul>
            <div className="mt-6 space-y-2.5 text-[#93a2c4] text-[0.88rem]">
              <p className="flex items-center gap-2 m-0">
                <MessageCircle size={15} className="text-[#25d366]" /> Atendimento via WhatsApp
              </p>
              <p className="flex items-center gap-2 m-0">
                <MapPin size={15} className="text-[#60a5fa]" /> Atendimento em todo o Brasil
              </p>
            </div>
          </div>
        </div>

        <div className="divider-line my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#6f7fa3] text-[0.82rem]">
          <p className="m-0">
            © {new Date().getFullYear()} {site.name} · Assessoria de Marketing Digital. Todos os
            direitos reservados.
          </p>
          <p className="m-0">Gestor de Tráfego Sênior · Growth · SEO</p>
        </div>
      </div>
    </footer>
  );
}
