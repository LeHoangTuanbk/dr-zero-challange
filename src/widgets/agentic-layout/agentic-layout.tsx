"use client";

import { TaskList } from "@/widgets/task-list";
import { Canvas } from "@/widgets/canvas/";
import { ChatPanel } from "@widgets/chat-panel";

export function AgenticLayout() {
  return (
    <div className="flex h-screen bg-background p-3 gap-3 overflow-hidden">
      <div className="w-60 shrink-0 rounded-2xl overflow-hidden border border-border shadow-sm">
        <TaskList />
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-3">
        <div className="flex-[65] min-h-0 bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
          <Canvas />
        </div>
        <div className="flex-[35] min-h-0 bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
