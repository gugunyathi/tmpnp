import { useCallback, useEffect, useState } from "react";
import { ScaledSlide } from "@/components/ScaledSlide";
import { SlideIndexProvider } from "@/components/slide-kit";
import { slides } from "@/slides/deck";
import { Download, FileDown, FileText, Grid, LayoutGrid, MonitorPlay, Presentation, Printer } from "lucide-react";

export default function App() {
  const [i, setI] = useState(0);
  const [grid, setGrid] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const go = useCallback(
    (n: number) => setI((c) => Math.min(slides.length - 1, Math.max(0, c + n))),
    [],
  );

  const downloadFile = async (filename: string) => {
    try {
      setDownloading(filename);

      // Attempt 1: Fetch as blob and trigger browser download with proper object URL
      const res = await fetch(`/api/download?file=${encodeURIComponent(filename)}`);
      if (!res.ok) {
        throw new Error(`Download HTTP error: ${res.status}`);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (e) {
      console.warn("Direct blob download failed, falling back to direct anchor link:", e);
      try {
        const directUrl = `/api/download?file=${encodeURIComponent(filename)}`;
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = directUrl;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 1000);
      } catch (fallbackErr) {
        console.error("Download fallback error:", fallbackErr);
      }
    } finally {
      setTimeout(() => setDownloading(null), 800);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key.toLowerCase() === "g") setGrid((g) => !g);
      if (e.key === "F5") {
        e.preventDefault();
        document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const current = slides[i] ?? slides[0]!;

  useEffect(() => {
    document.title = `${i + 1}/${slides.length} — ${current.title}`;
  }, [i, current.title]);

  const Current = current.Component;

  return (
    <div className="flex min-h-screen flex-col bg-pnp-blue-deep text-white font-sans selection:bg-pnp-red selection:text-white">
      {/* Hidden print container for full 27-slide high-res PDF generation */}
      <div className="hidden print:block font-sans bg-pnp-blue-deep text-white">
        {slides.map((s, idx) => {
          const C = s.Component;
          return (
            <div key={s.id} className="print-slide w-[1920px] h-[1080px] overflow-hidden relative page-break-after-always">
              <SlideIndexProvider value={idx + 1}>
                <C />
              </SlideIndexProvider>
            </div>
          );
        })}
      </div>

      <header className="print:hidden flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-3.5 bg-pnp-ink/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pnp-red font-bold text-white shadow-sm">
            TM
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white leading-tight">
              TM Pick n Pay Express
            </h1>
            <p className="text-[11px] text-white/60 leading-tight">
              Diaspora-to-Door Delivery Engine Pitch Deck
            </p>
          </div>
          <span className="ml-2 hidden sm:inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80 font-medium">
            Slide {i + 1} of {slides.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setGrid((g) => !g)}
            aria-label={grid ? "Switch to slide view" : "Switch to grid view"}
            className="flex items-center gap-1.5 cursor-pointer rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 active:scale-95"
          >
            {grid ? <LayoutGrid className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
            <span>{grid ? "Slide view" : "Grid view (G)"}</span>
          </button>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Download PDF */}
          <button
            onClick={() => downloadFile("TM-Pick-n-Pay-Express.pdf")}
            disabled={downloading === "TM-Pick-n-Pay-Express.pdf"}
            title="Download PDF version of presentation (27 slides)"
            className="flex items-center gap-1.5 cursor-pointer rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-pnp-blue-deep transition-all hover:bg-white/90 hover:shadow-md active:scale-95 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-pnp-red" />
            <span>{downloading === "TM-Pick-n-Pay-Express.pdf" ? "Downloading..." : "PDF"}</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={() => window.print()}
            title="Print or Save all slides directly as PDF via Browser Print"
            className="flex items-center gap-1.5 cursor-pointer rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/15 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-pnp-gold" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          {/* Download PPTX */}
          <button
            onClick={() => downloadFile("TM-Pick-n-Pay-Express.pptx")}
            disabled={downloading === "TM-Pick-n-Pay-Express.pptx"}
            title="Download modern editable PPTX PowerPoint presentation (27 slides)"
            className="flex items-center gap-1.5 cursor-pointer rounded-full bg-pnp-red px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-pnp-red-deep hover:shadow-md active:scale-95 disabled:opacity-50"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>{downloading === "TM-Pick-n-Pay-Express.pptx" ? "Downloading..." : "PPTX"}</span>
          </button>

          {/* Download PPT */}
          <button
            onClick={() => downloadFile("TM-Pick-n-Pay-Express.ppt")}
            disabled={downloading === "TM-Pick-n-Pay-Express.ppt"}
            title="Download binary PPT PowerPoint format (27 slides)"
            className="flex items-center gap-1.5 cursor-pointer rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/25 active:scale-95 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5 text-pnp-gold" />
            <span>{downloading === "TM-Pick-n-Pay-Express.ppt" ? "Downloading..." : "PPT (Legacy)"}</span>
          </button>

          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.();
              } else {
                document.exitFullscreen?.();
              }
            }}
            title="Present full screen (F5)"
            className="flex items-center gap-1.5 cursor-pointer rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 active:scale-95"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Present</span>
          </button>
        </div>
      </header>

      {grid ? (
        <div className="print:hidden grid flex-1 grid-cols-1 gap-6 overflow-auto p-6 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((s, idx) => {
            const C = s.Component;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setI(idx);
                  setGrid(false);
                }}
                className={`group cursor-pointer text-left transition-all ${
                  idx === i ? "ring-2 ring-pnp-red rounded-xl" : ""
                }`}
              >
                <div className="aspect-video overflow-hidden rounded-xl border border-white/15 bg-pnp-paper shadow-md">
                  <ScaledSlide>
                    <SlideIndexProvider value={idx + 1}>
                      <C />
                    </SlideIndexProvider>
                  </ScaledSlide>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-medium text-white/80">
                  <span>
                    {idx + 1}. {s.title}
                  </span>
                  {idx === i && (
                    <span className="rounded bg-pnp-red/30 px-1.5 py-0.5 text-[10px] text-pnp-red">
                      Current
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="print:hidden flex flex-col flex-1">
          <main className="flex flex-1 items-center justify-center p-4">
            <div className="aspect-video h-full max-h-[calc(100vh-160px)] w-full max-w-[1600px] overflow-hidden rounded-2xl shadow-2xl">
              <ScaledSlide>
                <SlideIndexProvider value={i + 1}>
                  <Current />
                </SlideIndexProvider>
              </ScaledSlide>
            </div>
          </main>
          <footer className="flex items-center justify-center gap-4 pb-6 text-white">
            <button
              onClick={() => go(-1)}
              disabled={i === 0}
              aria-label="Previous slide"
              className="cursor-pointer rounded-full border border-white/25 px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            <span className="text-sm tabular-nums text-white/70">
              {i + 1} / {slides.length} · {current.title}
            </span>
            <button
              onClick={() => go(1)}
              disabled={i === slides.length - 1}
              aria-label="Next slide"
              className="cursor-pointer rounded-full border border-white/25 px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
