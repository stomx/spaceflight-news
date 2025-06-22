export interface LaunchInfo {
  launch_id: string;
  provider: string;
}

export interface EventInfo {
  event_id: number;
  provider: string;
}

export interface AuthorSocials {
  x?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  mastodon?: string;
  bluesky?: string;
}

export interface Author {
  name: string;
  socials?: AuthorSocials;
}

export interface NewsBase {
  id: number;
  title: string;
  authors: Author[];
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

export interface Report {
  id: number;
  title: string;
  authors: Author[];
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  type?: 'report';
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaginatedArticleList = PaginatedResponse<Article>;
export type PaginatedBlogList = PaginatedResponse<Blog>;
export type PaginatedReportList = PaginatedResponse<Report>;

// 검색 파라미터 타입 정의
export interface SearchParams {
  page?: number;
  limit?: number;
}
