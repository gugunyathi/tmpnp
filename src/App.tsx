import { useCallback, useEffect, useRef, useState } from "react";
import { ScaledSlide } from "@/components/ScaledSlide";
import { SlideIndexProvider } from "@/components/slide-kit";
import { slides } from "@/slides/deck";
import {
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileText,
  Grid,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Presentation,
  Printer,
} from "lucide-react";

export default function App() {
  const [i, setI] = useState(0);
  const [grid, setGrid] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch gesture handling for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const go = useCallback(
    (n: number) => setI((c) => Math.min(slides.length - 1, Math.max(0, c + n))),
    [],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger swipe if horizontal distance > 45px and dominant over vertical
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        go(1); // Swipe left -> next slide
      } else {
        go(-1); // Swipe right -> previous slide
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key.toLowerCase() === "g") setGrid((g) => !g);
      if (e.key === "F5") {
        e.preventDefault();
        toggleFullscreen();
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
    <div className="flex min-h-[100dvh] flex-col bg-pnp-blue-deep text-white font-sans selection:bg-pnp-red selection:text-white">
      {/* Hidden print container for full 27-slide high-res PDF generation */}
      <div className="hidden print:block font-sans bg-pnp-blue-deep text-white">
        {slides.map((s, idx) => {
          const C = s.Component;
          return (
            <div
              key={s.id}
              className="print-slide w-[1920px] h-[1080px] overflow-hidden relative page-break-after-always"
            >
              <SlideIndexProvider value={idx + 1}>
                <C />
              </SlideIndexProvider>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <header className="print:hidden flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 sm:px-6 sm:py-3.5 bg-pnp-ink/85 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-pnp-red text-xs sm:text-sm font-bold text-white shadow-sm">
            TM
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight truncate">
              TM Pick n Pay Express
            </h1>
            <p className="text-[10px] sm:text-[11px] text-white/60 leading-tight hidden xs:block truncate">
              Diaspora-to-Door Delivery Engine
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] sm:text-xs text-white/80 font-medium">
            {i + 1}/{slides.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Grid Toggle Button */}
          <button
            onClick={() => setGrid((g) => !g)}
            aria-label={grid ? "Switch to slide view" : "Switch to grid view"}
            className="flex items-center gap-1 cursor-pointer rounded-full border border-white/20 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 active:scale-95"
          >
            {grid ? (
              <LayoutGrid className="w-3.5 h-3.5" />
            ) : (
              <Grid className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {grid ? "Slide view" : "Grid view (G)"}
            </span>
          </button>

          {/* Desktop-Only Download Buttons (hidden on mobile screens < 768px) */}
          <div className="h-4 w-px bg-white/20 mx-0.5 hidden md:block" />

          {/* Download PDF - hidden on mobile */}
          <button
            onClick={() => downloadFile("TM-Pick-n-Pay-Express.pdf")}
            disabled={downloading === "TM-Pick-n-Pay-Express.pdf"}
            title="Download PDF version of presentation (27 slides)"
            className="hidden md:inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-pnp-blue-deep transition-all hover:bg-white/90 hover:shadow-md active:scale-95 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-pnp-red" />
            <span>
              {downloading === "TM-Pick-n-Pay-Express.pdf" ? "Downloading..." : "PDF"}
            </span>
          </button>

          {/* Print PDF - hidden on mobile & tablets */}
          <button
            onClick={() => window.print()}
            title="Print or Save all slides directly as PDF via Browser Print"
            className="hidden lg:inline-flex items-center gap-1.5 cursor-pointer rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/15 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-pnp-gold" />
            <span>Print</span>
          </button>

          {/* Download PPTX - hidden on mobile */}
          <button
            onClick={() => downloadFile("TM-Pick-n-Pay-Express.pptx")}
            disabled={downloading === "TM-Pick-n-Pay-Express.pptx"}
            title="Download modern editable PPTX PowerPoint presentation (27 slides)"
            className="hidden md:inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-pnp-red px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-pnp-red-deep hover:shadow-md active:scale-95 disabled:opacity-50"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>
              {downloading === "TM-Pick-n-Pay-Express.pptx" ? "Downloading..." : "PPTX"}
            </span>
          </button>

          {/* Download PPT Legacy - hidden on mobile & tablets */}
          <button
            onClick={() => downloadFile("TM-Pick-n-Pay-Express.ppt")}
            disabled={downloading === "TM-Pick-n-Pay-Express.ppt"}
            title="Download binary PPT PowerPoint format (27 slides)"
            className="hidden xl:inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/25 active:scale-95 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5 text-pnp-gold" />
            <span>PPT (Legacy)</span>
          </button>

          {/* Fullscreen / Present Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Present full screen (F5)"}
            className="flex items-center gap-1.5 cursor-pointer rounded-full border border-white/20 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 active:scale-95"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit" : "Present"}
            </span>
          </button>
        </div>
      </header>

      {/* Dynamic Slide Progress Bar */}
      <div className="print:hidden h-1 w-full bg-white/10">
        <div
          className="h-full bg-pnp-red transition-all duration-300 ease-out"
          style={{ width: `${((i + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main View Area */}
      {grid ? (
        <div className="print:hidden grid flex-1 grid-cols-1 gap-3 sm:gap-6 overflow-auto p-3 sm:p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slides.map((s, idx) => {
            const C = s.Component;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setI(idx);
                  setGrid(false);
                }}
                className={`group cursor-pointer text-left transition-all p-1.5 rounded-xl ${
                  idx === i
                    ? "ring-2 ring-pnp-red bg-white/5"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="aspect-video overflow-hidden rounded-lg border border-white/15 bg-pnp-paper shadow-md">
                  <ScaledSlide>
                    <SlideIndexProvider value={idx + 1}>
                      <C />
                    </SlideIndexProvider>
                  </ScaledSlide>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-medium text-white/80 px-1">
                  <span className="truncate mr-2">
                    {idx + 1}. {s.title}
                  </span>
                  {idx === i && (
                    <span className="shrink-0 rounded bg-pnp-red px-1.5 py-0.5 text-[10px] text-white font-bold">
                      Current
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="print:hidden flex flex-col flex-1 min-h-0">
          <main
            className="flex flex-1 items-center justify-center p-2 sm:p-4 md:p-6 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="aspect-video w-full max-w-[1600px] max-h-[calc(100dvh-130px)] sm:max-h-[calc(100vh-150px)] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl bg-transparent">
              <ScaledSlide>
                <SlideIndexProvider value={i + 1}>
                  <Current />
                </SlideIndexProvider>
              </ScaledSlide>
            </div>
          </main>

          {/* Navigation Controls Footer */}
          <footer className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 px-4 pb-3 pt-1 sm:pb-5 text-white">
            <button
              onClick={() => go(-1)}
              disabled={i === 0}
              aria-label="Previous slide"
              className="cursor-pointer rounded-full border border-white/25 px-4 sm:px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 min-h-[40px] flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            <span className="text-xs sm:text-sm tabular-nums text-white/80 font-medium text-center truncate max-w-[180px] xs:max-w-[280px] sm:max-w-[400px]">
              {i + 1} / {slides.length} · {current.title}
            </span>

            <button
              onClick={() => go(1)}
              disabled={i === slides.length - 1}
              aria-label="Next slide"
              className="cursor-pointer rounded-full border border-white/25 px-4 sm:px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 min-h-[40px] flex items-center gap-1"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}

