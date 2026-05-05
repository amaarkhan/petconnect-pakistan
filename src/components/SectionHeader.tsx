export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
        {subtitle}
      </p>
      <h2 className="font-display text-3xl text-zinc-900 md:text-4xl">{title}</h2>
    </div>
  );
}
