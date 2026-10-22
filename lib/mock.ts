import { Cite, Msg, Thread } from "./types";

export const CITES: Record<string, Cite> = {
  "finra-2210-d1": {
    id: "finra-2210-d1",
    label: "FINRA 2210(d)(1)",
    source: "FINRA Rule 2210, Communications with the Public",
    excerpt:
      "Summary: communications must be fair, balanced and in good faith, and may not promise results or omit material risks.",
    url: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210",
  },
  "sec-17a-4": {
    id: "sec-17a-4",
    label: "SEC 17a-4(f)",
    source: "SEC Rule 17a-4, Records to be Preserved",
    excerpt:
      "Summary: required broker-dealer records must be preserved in a tamper-resistant format for the mandated retention period.",
    url: "https://www.ecfr.gov/current/title-17/section-240.17a-4",
  },
  "disc-09": {
    id: "disc-09",
    label: "DISC-09",
    source: "Firm policy DISC-09, Projected returns",
    excerpt:
      "Summary: any projected or target return must be shown next to a plain-language risk disclosure.",
    url: "https://example.com/policies/disc-09",
  },
};

export const QUICK = [
  "Check investment agreement for guaranteed return clauses",
  "What are the SEC 17a-4 record retention requirements?",
  "Summarize our disclosure obligations for client emails",
  "Does Section 4 violate FINRA-2210?",
];

export function reply(q: string, files: string[] = []): string {
  const pre = files.length
    ? `I reviewed **${files.join(", ")}** alongside your question.\n\n`
    : "";
  const s = q.toLowerCase();
  if (/guarant|return|2210|section 4/.test(s))
    return (
      pre +
      [
        "A guaranteed-return clause is a problem. Communications must be fair and balanced and cannot promise results [[finra-2210-d1]].",
        "",
        "| Clause | Risk | Suggested fix |",
        "|---|---|---|",
        '| "Guaranteed 8% annual return" | Promissory claim | Remove, or label as a target |',
        '| "No risk of loss" | Omits material risk | Add a risk disclosure |',
        "",
        "Flag it in the rule tree so reviewers see it:",
        "",
        "```json",
        '{ "rule": "DISC-09", "severity": "High", "action": "flag" }',
        "```",
        "",
        "Firm policy also requires a risk disclosure beside any projected return [[disc-09]].",
      ].join("\n")
    );
  if (/17a-4|retention|record/.test(s))
    return (
      pre +
      [
        "Required records must be kept in a tamper-resistant format [[sec-17a-4]]. In practice:",
        "",
        "- **Format:** write-once storage or an audit-trail alternative",
        "- **Duration:** typically 3 to 6 years depending on record type",
        "- **Access:** indexed so regulators can retrieve records quickly",
        "",
        "I can draft a retention checklist for your team if useful.",
      ].join("\n")
    );
  return (
    pre +
    [
      "Here is a short answer based on firm policy [[disc-09]]:",
      "",
      "1. Identify the audience and channel.",
      "2. Confirm every claim is **fair and balanced** [[finra-2210-d1]].",
      "3. Attach required disclosures and archive the message.",
      "",
      "Ask about a specific clause or rule for a more precise answer.",
    ].join("\n")
  );
}

const D = 864e5;
const pair = (id: string, q: string, age: number): Msg[] => [
  { id: id + "u", role: "user", text: q, ts: Date.now() - age },
  { id: id + "a", role: "ai", text: reply(q), ts: Date.now() - age + 1000 },
];

export const SEED: Thread[] = [
  {
    id: "t1",
    title: "Guaranteed return clauses",
    pinned: true,
    ts: Date.now() - 36e5,
    msgs: pair("t1", QUICK[0], 36e5),
  },
  {
    id: "t2",
    title: "SEC 17a-4 retention",
    pinned: false,
    ts: Date.now() - 2 * 36e5,
    msgs: pair("t2", QUICK[1], 2 * 36e5),
  },
  {
    id: "t3",
    title: "Client email disclosures",
    pinned: false,
    ts: Date.now() - D,
    msgs: pair("t3", QUICK[2], D),
  },
  {
    id: "t4",
    title: "Section 4 review",
    pinned: false,
    ts: Date.now() - 4 * D,
    msgs: pair("t4", QUICK[3], 4 * D),
  },
];
