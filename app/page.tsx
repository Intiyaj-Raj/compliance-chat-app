import { ArrowUp, Paperclip, Plus, MessagesCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="flex h-dvh bg-paper text-slate-800">
      <aside className="hidden w-72 flex-col bg-ink text-slate-200 md:flex">
        <div className="flex items-center gap-2 px-4 pb-4 pt-5">
          <MessagesCircle size={18} className="text-mark" />
          <span className="font-semibold tracking-tight text-white">
            Glynac Compliance
          </span>
        </div>
        <button
          disabled
          className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-lg bg-mark px-3 py-2 text-sm font-medium text-white opacity-80"
        >
          <Plus size={16} /> New thread
        </button>
        <div className="space-y-2 px-4 pt-2">
          {[60, 45, 70].map((w) => (
            <div
              key={w}
              className="h-3 rounded bg-white/10"
              style={{ width: w + "%" }}
            />
          ))}
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-300/70 bg-white/70 px-4 py-3 font-semibold text-ink">
          New thread
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Ask about a rule, clause or disclosure
          </h2>
          <p className="mt-2 text-slate-500">
            Answers will cite the rule they rely on.
          </p>
        </div>
        <div className="px-4 pb-4">
          <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-300">
            <Paperclip size={18} className="text-slate-400" />
            <span className="flex-1 text-sm text-slate-400">
              Ask a compliance question…
            </span>
            <ArrowUp size={18} className="text-slate-300" />
          </div>
        </div>
      </main>
    </div>
  );
}
