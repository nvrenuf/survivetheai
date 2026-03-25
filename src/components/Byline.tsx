import type { FC } from 'react';

type BylineProps = {
  author: string;
  displayDate: string;
  isoDate: string;
  readingTime: string;
  className?: string;
};

const Byline: FC<BylineProps> = ({ author, displayDate, isoDate, readingTime, className = '' }) => {
  const showAuthor = import.meta.env.PUBLIC_SHOW_AUTHOR === 'true';

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-600 sm:text-sm ${className}`.trim()}
      data-testid="article-byline"
    >
      {showAuthor && (
        <>
          <span className="text-neutral-800">{`By ${author}`}</span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:block" />
        </>
      )}
      <time dateTime={isoDate} className="text-neutral-600">
        {`Published ${displayDate}`}
      </time>
      <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:block" />
      <span className="text-neutral-600">{readingTime}</span>
    </div>
  );
};

export default Byline;
