"use client";
import { useRef, useState } from "react";
import { Pin, Pencil, Plus, RotateCcw, Scale, Trash2 } from "lucide-react";
import { Thread } from "@/lib/types";

const day = (ts: number) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
function group(t: Thread) {
  if (t.pinned) return "Pinned";
  const d = Math.round((day(Date.now()) - day(t.ts)) / 864e5);
  return d <= 0
    ? "Today"
    : d === 1
      ? "Yesterday"
      : d <= 7
        ? "Previous 7 days"
        : "Older";
}
const ORDER = ["Pinned", "Today", "Yesterday", "Previous 7 days", "Older"];

type P = {
  threads: Thread[];
  active: string;
  onNew: () => void;
  onPick: (id: string) => void;
  onRename: (id: string, t: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onReset?: () => void;
};

export default function Sidebar({
  threads,
  active,
  onNew,
  onPick,
  onRename,
  onPin,
  onDelete,
  onReset,
}: P) {
  const [editing, setEditing] = useState<string | null>(null);
  const esc = useRef(false);
  const sorted = [...threads].sort((a, b) => b.ts - a.ts);
  return (
    <aside className="flex h-full w-72 flex-col bg-ink text-slate-200">
      <div className="flex items-center gap-2 px-4 pt-5 pb-4">
        <Scale size={18} className="text-mark" />
        <span className="font-semibold tracking-tight text-white">
          Glynac Compliance
        </span>
      </div>
      <button
        onClick={onNew}
        className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-lg bg-mark px-3 py-2 text-sm font-medium text-white transition hover:brightness-110"
      >
        <Plus size={16} /> New thread
      </button>
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {ORDER.map((g) => {
          const items = sorted.filter((t) => group(t) === g);
          if (!items.length) return null;
          return (
            <div key={g} className="mb-3">
              <p className="px-2 py-1 text-xs text-slate-400">{g}</p>
              {items.map((t) => (
                <div
                  key={t.id}
                  className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition ${t.id === active ? "bg-white/10 text-white" : "hover:bg-white/5"}`}
                >
                  {editing === t.id ? (
                    <input
                      autoFocus
                      defaultValue={t.title}
                      className="min-w-0 flex-1 rounded bg-white/10 px-1 text-white outline-none"
                      onBlur={(e) => {
                        if (!esc.current) onRename(t.id, e.target.value);
                        esc.current = false;
                        setEditing(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        if (e.key === "Escape") {
                          esc.current = true;
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => onPick(t.id)}
                      onDoubleClick={() => setEditing(t.id)}
                      className="min-w-0 flex-1 truncate text-left"
                    >
                      {t.title}
                    </button>
                  )}
                  <button
                    aria-label="Rename thread"
                    onClick={() => setEditing(t.id)}
                    className="text-slate-400 hover:text-white md:hidden md:group-hover:block md:group-focus-within:block"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    aria-label={t.pinned ? "Unpin thread" : "Pin thread"}
                    onClick={() => onPin(t.id)}
                    className={`${t.pinned ? "text-mark" : "text-slate-400 md:hidden md:group-hover:block md:group-focus-within:block"} hover:text-white`}
                  >
                    <Pin size={13} />
                  </button>
                  <button
                    aria-label="Delete thread"
                    onClick={() =>
                      confirm(`Delete "${t.title}"?`) && onDelete(t.id)
                    }
                    className="text-slate-400 hover:text-red-400 md:hidden md:group-hover:block md:group-focus-within:block"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </nav>
      {onReset && (
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() =>
              confirm("Reset all chats to the demo data?") && onReset()
            }
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={13} /> Reset demo data
          </button>
        </div>
      )}
    </aside>
  );
}
