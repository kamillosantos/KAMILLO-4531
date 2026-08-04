import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, X, MessageCircle } from "lucide-react";
import { navItems, site } from "../../lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(4,6,15,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="container-x flex items-center justify-between h-[72px]">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span
            className="grid place-items-center w-9 h-9 rounded-lg font-display font-extrabold text-white text-lg"
            style={{ background: "linear-gradient(135deg,#3b82f6,#22d3ee)" }}
          >
            K
          </span>
          <span className="font-display font-bold text-[1.05rem] text-white leading-none">
            Kamillo<span className="text-[#60a5fa]">.</span>Santos
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.92rem] font-medium text-[#a9b6d6] hover:text-white transition-colors no-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-2 btn-primary !py-2.5 !px-5 !text-[0.9rem]"
        >
          <MessageCircle size={17} /> Diagnóstico gratuito
        </a>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-[var(--border)]">
          <div className="container-x py-5 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[#c6d2ec] hover:text-white no-underline border-b border-[var(--border)]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 justify-center"
            >
              <MessageCircle size={18} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
