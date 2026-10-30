"use client";
import { ChevronDown, ChevronUp, PanelLeft, Search } from "lucide-react";

type P = {
  title: string;
  onMenu: () => void;
  q: string;
  onQ: (v: string) => void;
  count: number;
  idx: number;
  onStep: (d: 1 | -1) => void;
};

export default function Header({
  title,
  onMenu,
  q,
  onQ,
  count,
  idx,
  onStep,
}: P) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-300/70 bg-white/70 px-4 py-3 backdrop-blur">
      <button
        aria-label="Toggle threads"
        onClick={onMenu}
        className="rounded p-1.5 text-slate-600 hover:bg-slate-200"
      >
        <PanelLeft size={18} />
      </button>
      <h1 className="min-w-0 flex-1 truncate font-semibold text-ink">
        {title}
      </h1>
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm">
        <Search size={14} className="text-slate-500" />
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStep(e.shiftKey ? -1 : 1)}
          placeholder="Search this thread"
          className="w-28 bg-transparent outline-none sm:w-44"
        />
        {q && (
          <span className="text-xs text-slate-500">
            {count ? `${(idx % count) + 1}/${count}` : "No matches"}
          </span>
        )}
        {q && count > 1 && (
          <>
            <button aria-label="Previous match" onClick={() => onStep(-1)}>
              <ChevronUp size={14} />
            </button>
            <button aria-label="Next match" onClick={() => onStep(1)}>
              <ChevronDown size={14} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
