interface NewsCardProps {
  imageUrl: string;
  title: string;
  summary: string;
  date: string;
  site: string;
  featured?: boolean;
  children?: React.ReactNode;
}

export function NewsCard({ imageUrl, title, summary, date, site, featured, children }: NewsCardProps) {
  return (
    <div className="bg-white shadow p-4 rounded-md w-full">
      <div className="flex md:flex-row flex-col gap-4">
        <figure className="rounded-md w-1/2 aspect-video">
          <img src={imageUrl} alt={title} className="rounded-md w-full h-full object-cover" />
        </figure>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center gap-2">
            <h2 className="flex-1 font-bold text-lg line-clamp-2">{title}</h2>
            {featured && <span className="badge badge-destructive">특집</span>}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-4">{summary}</p>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>{date}</span>
            <span>·</span>
            <span>{site}</span>
          </div>
          <div className="flex gap-2 mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
