export default function CTA({
  eyebrow = 'Stay ahead of the shift',
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}) {
  return (
    <section
      className="rounded-[28px] border border-neutral-200 bg-neutral-50 px-6 py-6 shadow-sm sm:px-8 sm:py-7"
      data-testid="article-cta"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">{eyebrow}</p>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">{title}</h2>
          {description && <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">{description}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {primaryHref && primaryLabel && (
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700"
            >
              {primaryLabel}
            </a>
          )}
          {secondaryHref && secondaryLabel && (
            <a
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-500 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
