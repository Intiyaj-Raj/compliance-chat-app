"use client";
import { useState } from "react";
import Composer from "@/components/Composer";
import Feed from "@/components/Feed";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/lib/useChat";

export default function Page() {
  const chat = useChat();
  const [draft, setDraft] = useState("");
  const [side, setSide] = useState(true);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const t = chat.threads.find((x) => x.id === chat.active);
  if (!chat.ready || !t)
    return (
      <div className="grid h-dvh place-items-center bg-paper text-slate-500">
        Loading threads…
      </div>
    );

  const needle = q.trim().toLowerCase();
  const hits = needle
    ? t.msgs
        .filter((m) => m.text.toLowerCase().includes(needle))
        .map((m) => m.id)
    : [];
  const focusId = hits.length ? hits[idx % hits.length] : undefined;

  return (
    <div className="flex h-dvh bg-paper text-slate-800">
      {side && (
        <Sidebar
          threads={chat.threads}
          active={chat.active}
          onNew={() => {
            chat.create();
            setQ("");
          }}
          onPick={(id) => {
            chat.select(id);
            setQ("");
          }}
          onRename={chat.rename}
          onPin={chat.pin}
          onDelete={chat.remove}
        />
      )}
      <main className="flex min-w-0 flex-1 flex-col">
        <Header
          title={t.title}
          onMenu={() => setSide((s) => !s)}
          q={q}
          onQ={(v) => {
            setQ(v);
            setIdx(0);
          }}
          count={hits.length}
          idx={idx}
          onStep={(d) =>
            setIdx((i) => (i + d + hits.length) % Math.max(hits.length, 1))
          }
        />
        <Feed
          msgs={t.msgs}
          live={chat.live}
          thinking={chat.thinking}
          hits={hits}
          focusId={focusId}
          onPick={setDraft}
          onRegen={chat.regenerate}
          onVote={chat.vote}
          onEdit={chat.edit}
        />
        <Composer
          value={draft}
          onChange={setDraft}
          busy={chat.thinking || !!chat.live}
          onStop={chat.stop}
          onSend={(files) => {
            chat.send(draft.trim(), files);
            setDraft("");
          }}
        />
      </main>
    </div>
  );
}
