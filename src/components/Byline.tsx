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
    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-500 font-medium">
      {showAuthor && (
        <>
          <span className="text-neutral-700">{author}</span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:block" />
        </>
      )}
      <time dateTime={isoDate} className="text-neutral-500">
        {displayDate}
      </time>
      <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:block" />
      <span className="text-neutral-500">{readingTime}</span>
    </div>
  );
};

export default Byline;
