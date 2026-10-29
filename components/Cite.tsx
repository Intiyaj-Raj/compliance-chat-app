"use client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { CITES } from "@/lib/mock";

export default function Cite({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const c = CITES[id];
  if (!c) return null;
  return (
    <span className="relative inline-block align-baseline">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mx-0.5 rounded-full bg-marksoft px-2 py-0.5 font-sans text-xs font-medium text-mark ring-1 ring-mark/30 transition hover:bg-mark hover:text-white"
      >
        {c.label}
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <span className="absolute left-0 top-full z-30 mt-2 block w-72 rounded-lg bg-white p-4 text-left font-sans text-sm shadow-xl ring-1 ring-black/10">
            <span className="mb-2 block font-semibold text-ink">
              {c.source}
            </span>
            <span className="block border-l-2 border-mark pl-3 text-slate-600">
              {c.excerpt}
            </span>
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-mark hover:underline"
            >
              <ExternalLink size={12} /> Open source document
            </a>
          </span>
        </>
      )}
    </span>
  );
}
