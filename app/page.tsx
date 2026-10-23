"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/lib/useChat";

export default function Page() {
  const chat = useChat();
  const busy = chat.thinking || !!chat.live;
  const [draft, setDraft] = useState("");
  const t = chat.threads.find((x) => x.id === chat.active);
  if (!chat.ready || !t)
    return (
      <div className="grid h-dvh place-items-center bg-paper text-slate-500">
        Loading threads…
      </div>
    );

  return (
    <div className="flex h-dvh bg-paper text-slate-800">
      <Sidebar
        threads={chat.threads}
        active={chat.active}
        onNew={chat.create}
        onPick={chat.select}
        onRename={chat.rename}
        onPin={chat.pin}
        onDelete={chat.remove}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-300/70 bg-white/70 px-4 py-3 font-semibold text-ink">
          {t.title}
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {t.msgs.map((m) => {
            const text =
              chat.live?.id === m.id
                ? m.text.split(/(\s+)/).slice(0, chat.live.n).join("")
                : m.text;
            return (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-xl rounded-2xl bg-ink px-4 py-2 text-sm text-white"
                    : "max-w-2xl whitespace-pre-wrap font-serif leading-7"
                }
              >
                {text}
              </div>
            );
          })}
          {chat.thinking && (
            <p className="text-sm text-slate-500">Checking the rulebook…</p>
          )}
        </div>
        <form
          className="flex gap-2 border-t border-slate-300/70 bg-white p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim() && !busy) {
              chat.send(draft.trim());
              setDraft("");
            }
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a compliance question…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-mark"
          />
          <button
            disabled={busy || !draft.trim()}
            className="rounded-lg bg-ink px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
