"use client";

import { Check, Copy, Download, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CodeBlock({
  title,
  filename,
  content,
}: {
  title: string;
  filename: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-2">
        <span className="text-sm font-semibold text-fd-foreground">
          {title}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-fd-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-fd-accent",
            )}
          >
            {copied ? (
              <Check aria-hidden className="size-3.5" />
            ) : copyFailed ? (
              <X aria-hidden className="size-3.5" />
            ) : (
              <Copy aria-hidden className="size-3.5" />
            )}
            {copied ? "Copied" : copyFailed ? "Failed" : "Copy"}
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-md border border-fd-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-fd-accent"
          >
            <Download aria-hidden className="size-3.5" />
            Download
          </button>
        </div>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">{content}</code>
      </pre>
    </div>
  );
}
