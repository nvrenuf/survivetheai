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
    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
      {showAuthor && (
        <>
          <span className="font-medium text-neutral-800">{author}</span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:block" />
        </>
      )}
      <time dateTime={isoDate} className="text-neutral-600">
        {displayDate}
      </time>
      <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:block" />
      <span className="text-neutral-600">{readingTime}</span>
    </div>
  );
};

export default Byline;
