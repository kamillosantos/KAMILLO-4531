import { clsx } from "clsx";
import type { ReactNode } from "react";

// Shared "Sovereign OS" primitives — dark terminal aesthetic.
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-[#1f242d] bg-[#0d0f12]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  accent = "green",
  hint,
}: {
  label: string;
  value: string;
  accent?: "green" | "cyan" | "purple" | "white";
  hint?: string;
}) {
  const color = {
    green: "text-[#00ff66]",
    cyan: "text-[#00f0ff]",
    purple: "text-[#a06bff]",
    white: "text-[#e0e6ed]",
  }[accent];
  return (
    <Panel className="p-4">
      <div className="text-[10px] uppercase tracking-wider text-[#606d80]">
        {label}
      </div>
      <div className={clsx("mt-1 font-mono text-2xl font-bold", color)}>
        {value}
      </div>
      {hint && <div className="mt-1 text-[10px] text-[#606d80]">{hint}</div>}
    </Panel>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#606d80]">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded border border-[#1f242d] bg-[#050505] px-3 py-2 font-mono text-xs text-[#e0e6ed] outline-none focus:border-[#00ff66]/60 placeholder:text-[#3a4453]";

export function Btn({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "solid",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center gap-2 rounded px-3 py-2 font-mono text-xs font-semibold transition disabled:opacity-40",
        variant === "solid"
          ? "border border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66] hover:text-black"
          : "border border-[#1f242d] text-[#606d80] hover:border-[#00ff66]/40 hover:text-[#e0e6ed]",
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "green" | "red" | "amber" | "cyan" | "muted";
}) {
  const cls = {
    green: "border-[#00ff66]/40 text-[#00ff66] bg-[#00ff66]/10",
    red: "border-red-500/40 text-red-400 bg-red-500/10",
    amber: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    cyan: "border-[#00f0ff]/40 text-[#00f0ff] bg-[#00f0ff]/10",
    muted: "border-[#1f242d] text-[#606d80] bg-[#050505]",
  }[tone];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        cls,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  icon,
  title,
  subtitle,
  accent = "green",
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  accent?: "green" | "cyan" | "purple";
}) {
  const color = {
    green: "text-[#00ff66]",
    cyan: "text-[#00f0ff]",
    purple: "text-[#a06bff]",
  }[accent];
  return (
    <div className="mb-5">
      <h2
        className={clsx(
          "flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest",
          color,
        )}
      >
        {icon}
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 font-mono text-[11px] text-[#606d80]">{subtitle}</p>
      )}
    </div>
  );
}
