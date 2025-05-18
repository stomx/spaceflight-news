import type { Article } from '@/entities/article/api/types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';

interface ArticleItemProps {
  article: Article;
}

export function ArticleItem({ article }: ArticleItemProps) {
  return (
    <Card className="p-4 w-full">
      <CardContent className="flex md:flex-row flex-col gap-4 px-0">
        <figure className="rounded-md w-1/2 aspect-video">
          <img src={article.image_url} alt={article.title} className="rounded-md w-full h-full object-cover" />
        </figure>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="flex-1 font-bold text-lg line-clamp-2">{article.title}</CardTitle>
            {article.featured && <Badge variant="destructive">특집</Badge>}
          </div>
          <CardDescription className="text-muted-foreground text-sm line-clamp-4">{article.summary}</CardDescription>
          <CardFooter className="flex items-center gap-2 px-0 text-gray-500 text-xs">
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{article.news_site}</span>
          </CardFooter>
          <CardAction className="flex gap-2 mt-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/articles/${article.id}`}>상세보기</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to={article.url} target="_blank" rel="noopener noreferrer">
                원문
              </Link>
            </Button>
          </CardAction>
        </div>
      </CardContent>
    </Card>
  );
}
