import { useMemo, useState, type FC } from 'react';

export type TableOfContentsHeading = {
  depth: number;
  slug: string;
  text: string;
};

type TableOfContentsProps = {
  headings: TableOfContentsHeading[];
  title?: string;
  className?: string;
  initiallyCollapsed?: boolean;
};

const TableOfContents: FC<TableOfContentsProps> = ({
  headings,
  title = 'On this page',
  className = '',
  initiallyCollapsed = false,
}) => {
  const filtered = useMemo(() => headings.filter((heading) => heading.depth === 2 || heading.depth === 3), [headings]);
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);

  if (filtered.length < 4) {
    return null;
  }

  const listClasses = collapsed
    ? 'mt-4 hidden list-none space-y-2 pl-0 lg:block'
    : 'mt-4 list-none space-y-2 pl-0';

  return (
    <nav
      className={`rounded-3xl border border-neutral-200 bg-white p-5 text-sm text-neutral-700 shadow-sm ${className}`.trim()}
      aria-label="Table of contents"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 text-left font-medium text-neutral-800 lg:cursor-auto"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
      >
        <span>{title}</span>
        <svg
          className={`h-4 w-4 transition lg:hidden ${collapsed ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m6 15 6-6 6 6" />
        </svg>
      </button>
      <ul className={listClasses}>
        {filtered.map((heading) => (
          <li key={heading.slug} className={heading.depth === 3 ? 'pl-4 text-neutral-500' : ''}>
            <a
              href={`#${heading.slug}`}
              className="block rounded-md px-2 py-1 transition hover:text-neutral-900"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
