"use client";
import { useState } from "react";
import {
  Check,
  Copy,
  FileText,
  Pencil,
  RefreshCw,
  Scale,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Markdown from "./Markdown";
import { Msg } from "@/lib/types";

type P = {
  m: Msg;
  shown?: string;
  hit: boolean;
  onRegen: () => void;
  onVote: (v: "up" | "down") => void;
  onEdit: (t: string) => void;
};
const btn =
  "rounded p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-ink";

export default function Message({ m, shown, hit, onRegen, onVote, onEdit }: P) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.text);
  const streaming = shown !== undefined;
  const copy = () => {
    navigator.clipboard?.writeText(m.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const ring = hit ? "ring-2 ring-mark/70 rounded-xl" : "";

  if (m.role === "user")
    return (
      <div
        id={"m-" + m.id}
        className={`group flex flex-col items-end gap-1 ${ring}`}
      >
        {m.files?.length ? (
          <div className="flex flex-wrap justify-end gap-1">
            {m.files.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-300"
              >
                <FileText size={12} />
                {f}
              </span>
            ))}
          </div>
        ) : null}
        {editing ? (
          <div className="w-full max-w-xl">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-mark"
              rows={3}
            />
            <div className="mt-1 flex justify-end gap-2 text-sm">
              <button
                onClick={() => setEditing(false)}
                className="text-slate-500 hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  draft.trim() && onEdit(draft.trim());
                }}
                className="rounded bg-ink px-3 py-1 text-white"
              >
                Save and resend
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-white">
            {m.text}
          </div>
        )}
        {!editing && (
          <div className="md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition">
            <button
              aria-label="Edit prompt"
              className={btn}
              onClick={() => {
                setDraft(m.text);
                setEditing(true);
              }}
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
      </div>
    );

  return (
    <div id={"m-" + m.id} className={`group flex gap-3 ${ring}`}>
      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-marksoft text-mark">
        <Scale size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={`max-w-2xl font-serif text-[15.5px] leading-7 text-slate-800 ${streaming ? "caret" : ""}`}
        >
          <Markdown text={shown ?? m.text} />
        </div>
        {!streaming && (
          <div className="mt-1 flex gap-0.5 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition">
            <button aria-label="Copy" className={btn} onClick={copy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button aria-label="Regenerate" className={btn} onClick={onRegen}>
              <RefreshCw size={14} />
            </button>
            <button
              aria-label="Helpful"
              className={`${btn} ${m.vote === "up" ? "text-mark" : ""}`}
              onClick={() => onVote("up")}
            >
              <ThumbsUp size={14} />
            </button>
            <button
              aria-label="Not helpful"
              className={`${btn} ${m.vote === "down" ? "text-red-600" : ""}`}
              onClick={() => onVote("down")}
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
