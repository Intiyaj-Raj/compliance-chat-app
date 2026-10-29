"use client";
import ReactMarkdown from "react-markdown";
import { Children, isValidElement, ReactNode, useState } from "react";
import { Check, Copy } from "lucide-react";
import Cite from "./Cite";

function Code({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const el = Children.toArray(children)[0];
  const text = isValidElement<{ children?: ReactNode }>(el)
    ? String(el.props.children ?? "")
    : "";
  return (
    <div className="my-3 overflow-hidden rounded-lg bg-ink font-mono text-xs text-slate-100">
      <div className="flex justify-end border-b border-white/10 px-3 py-1">
        <button
          onClick={() => {
            navigator.clipboard?.writeText(text);
            setOk(true);
            setTimeout(() => setOk(false), 1500);
          }}
          className="flex items-center gap-1 text-slate-300 hover:text-white"
        >
          {ok ? <Check size={12} /> : <Copy size={12} />}
          {ok ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">{children}</pre>
    </div>
  );
}

export default function Markdown({ text }: { text: string }) {
  const src = text.replace(/\[\[([\w-]+)\]\]/g, "[cite](#c:$1)");
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) =>
          href?.startsWith("#c:") ? (
            <Cite id={href.slice(3)} />
          ) : (
            <a href={href} className="text-mark underline">
              {children}
            </a>
          ),
        pre: ({ children }) => <Code>{children}</Code>,
        code: ({ className, children }) =>
          className ? (
            <code className={className}>{children}</code>
          ) : (
            <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.85em]">
              {children}
            </code>
          ),
        p: ({ children }) => <p className="my-2">{children}</p>,
        ul: ({ children }) => (
          <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
        ),
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto">
            <table className="w-full border-collapse font-sans text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b-2 border-ink/20 px-3 py-2 text-left font-semibold text-ink">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-slate-300 px-3 py-2">{children}</td>
        ),
      }}
    >
      {src}
    </ReactMarkdown>
  );
}
