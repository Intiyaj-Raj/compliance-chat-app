import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glynac Compliance Chat",
  description:
    "AI compliance assistant with cited answers, attachments and threads",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
