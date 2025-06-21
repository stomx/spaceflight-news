export interface LaunchInfo {
  launch_id: string;
  provider: string;
}

export interface EventInfo {
  event_id: number;
  provider: string;
}

export interface NewsBase {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: LaunchInfo[];
  events: EventInfo[];
}

export interface Article extends NewsBase {
  type?: 'article';
}

export interface Blog extends NewsBase {
  type?: 'blog';
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaginatedArticleList = PaginatedResponse<Article>;
export type PaginatedBlogList = PaginatedResponse<Blog>;

// 검색 파라미터 타입 정의
export interface SearchParams {
  page?: number;
  limit?: number;
}
