"use client";
import { useRef, useState } from "react";
import { ArrowUp, FileText, Paperclip, Square, X } from "lucide-react";

type P = {
  value: string;
  onChange: (v: string) => void;
  onSend: (files: string[]) => void;
  onStop: () => void;
  busy: boolean;
};

export default function Composer({ value, onChange, onSend, onStop, busy }: P) {
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const pick = useRef<HTMLInputElement>(null);
  const add = (l: FileList | null) =>
    l && setFiles((f) => [...f, ...Array.from(l)]);
  const go = () => {
    if (!value.trim() || busy) return;
    onSend(files.map((f) => f.name));
    setFiles([]);
  };
  return (
    <div className="px-4 pb-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null))
            setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={`mx-auto max-w-3xl rounded-2xl bg-white p-3 shadow-sm ring-1 transition ${drag ? "ring-2 ring-mark" : "ring-slate-300 focus-within:ring-mark"}`}
      >
        {files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700"
              >
                <FileText size={14} className="text-mark" />
                {f.name}
                <span className="text-slate-400">
                  {Math.max(1, Math.round(f.size / 1024))} KB
                </span>
                <button
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          placeholder={
            drag ? "Drop files to attach" : "Ask a compliance question…"
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              go();
            }
          }}
          className="w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between">
          <input
            ref={pick}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              add(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            aria-label="Attach files"
            onClick={() => pick.current?.click()}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-ink"
          >
            <Paperclip size={18} />
          </button>
          {busy ? (
            <button
              aria-label="Stop"
              onClick={onStop}
              className="rounded-lg bg-slate-200 p-2 text-ink"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              aria-label="Send"
              onClick={go}
              disabled={!value.trim()}
              className="rounded-lg bg-ink p-2 text-white transition enabled:hover:bg-mark disabled:opacity-30"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
