import type { FC } from 'react';

type BylineProps = {
  author: string;
  displayDate: string;
  isoDate: string;
  readingTime: string;
};

const Byline: FC<BylineProps> = ({ author, displayDate, isoDate, readingTime }) => {
  const showAuthor = import.meta.env.PUBLIC_SHOW_AUTHOR === 'true';

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
      {showAuthor && (
        <>
          <span className="font-medium text-neutral-800 dark:text-neutral-200">{author}</span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-600 sm:block" />
        </>
      )}
      <time dateTime={isoDate} className="text-neutral-600 dark:text-neutral-300">
        {displayDate}
      </time>
      <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-600 sm:block" />
      <span className="text-neutral-600 dark:text-neutral-300">{readingTime}</span>
    </div>
  );
};

export default Byline;
