"use client";
import { useEffect, useRef } from "react";
import { Scale } from "lucide-react";
import Message from "./Message";
import { Msg } from "@/lib/types";
import { QUICK } from "@/lib/mock";

type P = {
  msgs: Msg[];
  live: { id: string; n: number } | null;
  thinking: boolean;
  hits: string[];
  focusId?: string;
  onPick: (t: string) => void;
  onRegen: (id: string) => void;
  onVote: (id: string, v: "up" | "down") => void;
  onEdit: (id: string, t: string) => void;
};

export default function Feed(p: P) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (p.focusId)
      document
        .getElementById("m-" + p.focusId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    else end.current?.scrollIntoView({ block: "end" });
  }, [p.msgs.length, p.live?.n, p.thinking, p.focusId]);

  if (!p.msgs.length)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Ask about a rule, clause or disclosure
          </h2>
          <p className="mt-2 text-slate-500">
            Answers cite the rule they rely on. Attach a document for context.
          </p>
        </div>
        <div className="flex max-w-2xl flex-wrap justify-center gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => p.onPick(q)}
              className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-300 transition hover:bg-marksoft hover:ring-mark"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {p.msgs.map((m) => (
          <Message
            key={m.id}
            m={m}
            hit={p.hits.includes(m.id)}
            shown={
              p.live?.id === m.id
                ? m.text.split(/(\s+)/).slice(0, p.live.n).join("")
                : undefined
            }
            onRegen={() => p.onRegen(m.id)}
            onVote={(v) => p.onVote(m.id, v)}
            onEdit={(t) => p.onEdit(m.id, t)}
          />
        ))}
        {p.thinking && (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex size-8 items-center justify-center rounded-full bg-marksoft text-mark">
              <Scale size={16} className="animate-pulse" />
            </span>
            Checking the rulebook…
          </div>
        )}
        <div ref={end} />
      </div>
    </div>
  );
}
