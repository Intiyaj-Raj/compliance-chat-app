"use client";
import { useEffect, useRef, useState } from "react";
import { reply, SEED } from "./mock";
import { Msg, Thread } from "./types";

const KEY = "glynac-chat-v1";
export const uid = () => Math.random().toString(36).slice(2, 10);
const mk = (role: Msg["role"], text: string, files?: string[]): Msg => ({
  id: uid(),
  role,
  text,
  ts: Date.now(),
  files,
});
const blank = (): Thread => ({
  id: uid(),
  title: "New thread",
  pinned: false,
  ts: Date.now(),
  msgs: [],
});

type Job = { tid: string; prompt: string; files: string[] };
type Run = { tid: string; id: string; words: string[]; n: number };

export function useChat() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState("");
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState<{ id: string; n: number } | null>(null);
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const wait = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const job = useRef<Job | null>(null);
  const run = useRef<Run | null>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (Array.isArray(s?.threads) && s.threads.length) {
        setThreads(s.threads);
        setActive(
          s.threads.some((t: Thread) => t.id === s.active)
            ? s.active
            : s.threads[0].id,
        );
        setReady(true);
        return;
      }
    } catch {}
    setThreads(SEED);
    setActive(SEED[0].id);
    setReady(true);
  }, []);
  useEffect(
    () => () => {
      clearInterval(timer.current);
      clearTimeout(wait.current);
    },
    [],
  );
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify({ threads, active }));
  }, [threads, active, ready]);

  const patch = (id: string, fn: (t: Thread) => Thread) =>
    setThreads((ts) => ts.map((t) => (t.id === id ? fn(t) : t)));
  const clear = () => {
    clearInterval(timer.current);
    clearTimeout(wait.current);
    setLive(null);
    setThinking(false);
  };
  // Navigation / new prompt: never lose a reply, finish it instantly instead.
  const finish = () => {
    clear();
    const j = job.current;
    job.current = null;
    run.current = null;
    if (j)
      patch(j.tid, (t) => ({
        ...t,
        msgs: [...t.msgs, mk("ai", reply(j.prompt, j.files))],
      }));
  };
  // Stop button: keep only the text that was already shown.
  const stop = () => {
    const r = run.current;
    clear();
    job.current = null;
    run.current = null;
    if (r)
      patch(r.tid, (t) => ({
        ...t,
        msgs: t.msgs.map((m) =>
          m.id === r.id
            ? {
                ...m,
                text: r.words.slice(0, r.n).join("").trim() || "_Stopped._",
              }
            : m,
        ),
      }));
  };

  const answer = (tid: string, prompt: string, files: string[] = []) => {
    finish();
    job.current = { tid, prompt, files };
    setThinking(true);
    wait.current = setTimeout(() => {
      job.current = null;
      const m = mk("ai", reply(prompt, files));
      const r: Run = { tid, id: m.id, words: m.text.split(/(\s+)/), n: 0 };
      run.current = r;
      patch(tid, (t) => ({ ...t, msgs: [...t.msgs, m] }));
      setThinking(false);
      setLive({ id: m.id, n: 0 });
      timer.current = setInterval(() => {
        r.n += 4;
        if (r.n >= r.words.length) {
          clearInterval(timer.current);
          run.current = null;
          setLive(null);
        } else setLive({ id: m.id, n: r.n });
      }, 35);
    }, 700);
  };

  const cur = () => threads.find((t) => t.id === active);
  const send = (text: string, files: string[] = []) => {
    finish();
    patch(active, (t) => ({
      ...t,
      ts: Date.now(),
      title: t.msgs.length ? t.title : text.slice(0, 42),
      msgs: [...t.msgs, mk("user", text, files)],
    }));
    answer(active, text, files);
  };
  const regenerate = (mid: string) => {
    finish();
    const t = cur();
    if (!t) return;
    const i = t.msgs.findIndex((m) => m.id === mid);
    const u = t.msgs[i - 1];
    patch(active, (x) => ({ ...x, msgs: x.msgs.slice(0, i) }));
    answer(active, u?.text ?? "", u?.files);
  };
  const edit = (mid: string, text: string) => {
    finish();
    const t = cur();
    if (!t) return;
    const i = t.msgs.findIndex((m) => m.id === mid);
    patch(active, (x) => ({
      ...x,
      msgs: [...x.msgs.slice(0, i), { ...x.msgs[i], text }],
    }));
    answer(active, text, t.msgs[i].files);
  };
  const vote = (mid: string, v: "up" | "down") =>
    patch(active, (t) => ({
      ...t,
      msgs: t.msgs.map((m) =>
        m.id === mid ? { ...m, vote: m.vote === v ? undefined : v } : m,
      ),
    }));
  const create = () => {
    finish();
    if (cur()?.msgs.length === 0) return;
    const t = blank();
    setThreads((ts) => [t, ...ts]);
    setActive(t.id);
  };
  const select = (id: string) => {
    finish();
    setActive(id);
  };
  const rename = (id: string, title: string) =>
    patch(id, (t) => ({ ...t, title: title.trim() || t.title }));
  const reset = () => {
    finish();
    setThreads(SEED);
    setActive(SEED[0].id);
  };
  const pin = (id: string) => patch(id, (t) => ({ ...t, pinned: !t.pinned }));
  const remove = (id: string) => {
    finish();
    const rest = threads.filter((t) => t.id !== id);
    if (!rest.length) {
      const t = blank();
      setThreads([t]);
      setActive(t.id);
      return;
    }
    setThreads(rest);
    if (id === active) setActive(rest[0].id);
  };

  return {
    threads,
    active,
    ready,
    live,
    thinking,
    send,
    regenerate,
    edit,
    vote,
    create,
    select,
    rename,
    pin,
    remove,
    stop,
    reset,
  };
}
