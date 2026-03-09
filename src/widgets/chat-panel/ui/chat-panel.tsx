"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useWorkflowStore } from "@shared/store/workflow-store";
import type { NarrativeMessage } from "@shared/lib/workflow/types";
import { useTypewriter } from "../hook/use-typewriter";

type NarrativeBubbleProps = {
  message: NarrativeMessage;
  isLatest: boolean;
};

function NarrativeBubble({ message, isLatest }: NarrativeBubbleProps) {
  const { displayed, done } = useTypewriter(message.text, isLatest ? 18 : 0);
  const text = isLatest ? displayed : message.text;

  return (
    <div className="flex gap-2.5 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 mt-0.5">
        <Sparkles className="size-3 text-primary" />
      </div>
      <p className="flex-1 text-[13px] text-secondary-foreground leading-relaxed">
        {text}
        {isLatest && !done && (
          <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse align-middle" />
        )}
      </p>
    </div>
  );
}

export function ChatPanel() {
  const { narrativeMessages, activeTaskId } = useWorkflowStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = activeTaskId
    ? narrativeMessages.filter((m) => m.taskId === activeTaskId)
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filtered.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <Sparkles className="size-3.5 text-primary" />
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          AI アシスタント
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {filtered.length === 0 && (
          <p className="text-[12px] text-muted-foreground/60 italic">
            タスクを選択すると、AIの分析が表示されます
          </p>
        )}
        {filtered.map((msg, i) => (
          <NarrativeBubble
            key={msg.id}
            message={msg}
            isLatest={i === filtered.length - 1}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
