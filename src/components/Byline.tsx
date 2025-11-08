import type { FC } from 'react';

type BylineProps = {
  author: string;
  displayDate: string;
  isoDate: string;
  readingTime: string;
};

const Byline: FC<BylineProps> = ({ author, displayDate, isoDate, readingTime }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
      <span className="font-medium text-neutral-300">{author}</span>
      <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-700 sm:block" />
      <time dateTime={isoDate} className="text-neutral-500">
        {displayDate}
      </time>
      <span aria-hidden className="hidden h-1 w-1 rounded-full bg-neutral-700 sm:block" />
      <span>{readingTime}</span>
    </div>
  );
};

export default Byline;
