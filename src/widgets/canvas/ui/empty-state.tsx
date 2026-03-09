export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
        <span className="text-2xl">📋</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          タスクを選択してください
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          左のリストからタスクをクリックして開始
        </p>
      </div>
    </div>
  );
};
