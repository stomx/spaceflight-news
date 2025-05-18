/**
 * 기사 목록을 렌더링하는 컴포넌트입니다.
 */
import React from 'react';
import type { Article } from '@/entities/article/api/types';
import { ArticleItem } from './ArticleItem';

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <div>표시할 기사가 없습니다.</div>;
  }
  return (
    <section>
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </section>
  );
}
