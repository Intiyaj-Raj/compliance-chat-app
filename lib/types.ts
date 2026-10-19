export type Cite = {
  id: string;
  label: string;
  source: string;
  excerpt: string;
  url: string;
};
export type Msg = {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: number;
  files?: string[];
  vote?: "up" | "down";
};
export type Thread = {
  id: string;
  title: string;
  pinned: boolean;
  ts: number;
  msgs: Msg[];
};
