/**
 * 기사 목록 feature의 진입점 컴포넌트입니다.
 */
import React from 'react';
import { useArticlesQuery } from './model/useArticlesQuery';
import { ArticleList } from './ui/ArticleList';

export function ArticleListFeature() {
  const { data, isLoading, isError, error } = useArticlesQuery();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error?.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <h1>최신 우주 뉴스</h1>
      <ArticleList articles={data.results} />
    </div>
  );
}
