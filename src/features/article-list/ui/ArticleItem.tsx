/**
 * 단일 기사 정보를 보여주는 컴포넌트입니다.
 */
import React from 'react';
import type { Article } from '@/entities/article/api/types';

interface ArticleItemProps {
  article: Article;
}

export function ArticleItem({ article }: ArticleItemProps) {
  return (
    <article>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <img src={article.image_url} alt={article.title} />
        <h2>{article.title}</h2>
        <p>{article.summary}</p>
        <div>{new Date(article.published_at).toLocaleString()}</div>
      </a>
    </article>
  );
}
