export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
      <span>{label}</span>
    </div>
  );
}
