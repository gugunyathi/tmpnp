import { createContext, useContext, type ReactNode } from "react";
import logoRect from "@/assets/tmpnp-logo-rect.png";

/** Position of the slide in the deck (1-based). Overrides hardcoded numbers. */
export const SlideIndexContext = createContext<number | null>(null);

export function SlideIndexProvider({
  value,
  children,
}: {
  value: number;
  children: ReactNode;
}) {
  return <SlideIndexContext.Provider value={value}>{children}</SlideIndexContext.Provider>;
}

export function SlideBase({
  children,
  tone = "paper",
}: {
  children: ReactNode;
  tone?: "paper" | "blue" | "red";
}) {
  const bg =
    tone === "blue"
      ? "bg-pnp-blue-deep text-white"
      : tone === "red"
        ? "bg-pnp-red-deep text-white"
        : "bg-pnp-paper text-pnp-ink";
  return <div className={`slide-content ${bg}`}>{children}</div>;
}

export function SlideChrome({
  kicker,
  index,
  tone = "paper",
}: {
  kicker: string;
  index: number;
  tone?: "paper" | "blue" | "red";
}) {
  const dim = tone === "paper" ? "text-pnp-muted" : "text-white/60";
  const ctxIndex = useContext(SlideIndexContext);
  const n = ctxIndex ?? index;
  const label = kicker.replace(/^slide\s*\d+\s*·\s*/i, "");
  return (
    <>
      <div className="absolute left-[96px] top-[72px] flex items-center gap-6">
        <div className="rounded-xl bg-white px-4 py-2.5 shadow-sm">
          <img src={logoRect} alt="TM Pick n Pay" referrerPolicy="no-referrer" className="h-[38px] w-auto max-w-[210px] object-contain" />
        </div>
        <span className={`slide-kicker ${tone === "paper" ? "text-pnp-red" : "text-white/80"}`}>
          {`Slide ${String(n).padStart(2, "0")} · ${label}`}
        </span>
      </div>
      <div className={`slide-page absolute right-[96px] top-[84px] ${dim}`}>
        {String(n).padStart(2, "0")}
      </div>
      <div
        className={`slide-footer absolute bottom-[52px] left-[96px] right-[96px] flex justify-between ${dim}`}
      >
        <span>TM Pick n Pay Express — Door-to-Door</span>
        <span>Confidential · Executive Board Proposal</span>
      </div>
    </>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-[96px] right-[96px] top-[168px] h-[820px]">{children}</div>
  );
}

export function Pill({ children, tone = "red" }: { children: ReactNode; tone?: "red" | "blue" | "light" }) {
  const cls =
    tone === "red"
      ? "bg-pnp-red text-white"
      : tone === "blue"
        ? "bg-pnp-blue text-white"
        : "bg-white/15 text-white";
  return <span className={`slide-badge inline-block rounded-full px-5 py-2 ${cls}`}>{children}</span>;
}

export function Card({
  title,
  children,
  accent = "red",
}: {
  key?: string | number | null;
  title: string;
  children: ReactNode;
  accent?: "red" | "blue";
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-pnp-line bg-white p-10 shadow-sm">
      <div
        className={`mb-5 h-[8px] w-[72px] rounded-full ${accent === "red" ? "bg-pnp-red" : "bg-pnp-blue"}`}
      />
      <h3 className="slide-subtitle text-pnp-blue">{title}</h3>
      <div className="slide-body mt-4 text-pnp-muted">{children}</div>
    </div>
  );
}
