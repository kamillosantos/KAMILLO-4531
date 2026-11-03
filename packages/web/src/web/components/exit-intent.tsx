import { useEffect, useState } from "react";
import { X, MessageCircle, Sparkles } from "lucide-react";
import { site } from "../lib/site";

const KEY = "ks_exit_shown";

export function ExitIntent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;

    let armed = true;
    const onLeave = (e: MouseEvent) => {
      if (armed && e.clientY <= 0) {
        setOpen(true);
        armed = false;
        sessionStorage.setItem(KEY, "1");
        document.removeEventListener("mouseleave", onLeave);
      }
    };
    // Arm after a short delay so it doesn't trigger immediately
    const t = setTimeout(() => document.addEventListener("mouseleave", onLeave), 6000);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-[9999] m-0 grid h-full w-full max-h-none max-w-none place-items-center border-0 bg-transparent p-5"
      style={{ background: "rgba(2,6,17,0.82)", backdropFilter: "blur(10px)" }}
      aria-modal="true"
      aria-label="Oferta de diagnóstico gratuito"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 h-full w-full cursor-default border-0 bg-transparent"
        aria-label="Fechar oferta de diagnóstico"
        onClick={() => setOpen(false)}
      />
      <div
        className="glass relative z-10 w-full max-w-[520px] rounded-2xl p-8 text-center glow-primary"
        style={{ borderColor: "rgba(96,165,250,0.4)" }}
      >
        <button
          className="absolute top-4 right-4 text-[#93a2c4] hover:text-white"
          onClick={() => setOpen(false)}
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        <span className="chip mx-auto mb-5">
          <Sparkles size={14} /> Diagnóstico gratuito
        </span>
        <h2 className="text-[1.7rem] font-extrabold text-white leading-tight mb-3">
          Antes de sair: <span className="text-gradient-blue">quer mais clientes?</span>
        </h2>
        <p className="text-[#a9b6d6] leading-relaxed mb-7">
          Receba um diagnóstico gratuito do seu marketing e descubra onde estão as maiores
          oportunidades de aquisição no seu nicho — sem compromisso.
        </p>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center"
          style={{ background: "linear-gradient(100deg,#25d366,#1faf51)" }}
          onClick={() => setOpen(false)}
        >
          <MessageCircle size={19} /> Quero meu diagnóstico gratuito
        </a>
        <button
          className="mt-4 text-[#6f7fa3] text-sm hover:text-[#93a2c4] bg-transparent border-none cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Não, obrigado
        </button>
      </div>
    </dialog>
  );
}
