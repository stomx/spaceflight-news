import { useNavigate, useSearch } from '@tanstack/react-router';
import { useArticlesQuery } from './model/useArticlesQuery';
import { ArticleList } from './ui/ArticleList';

const DEFAULT_LIMIT = 10;

export function ArticleListFeature() {
  // 쿼리스트링 파싱 (page, limit)
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const page = Number(search.page) || 1;
  const limit = Number(search.limit) || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = useArticlesQuery({ limit, offset });

  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  // 쿼리스트링 변경 (페이지 이동)
  const handlePageChange = (newPage: number) => {
    navigate({
      search: { ...search, page: newPage, limit },
    });
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error?.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <h1>최신 우주 뉴스</h1>
      <ArticleList articles={data.results} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          이전
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || totalPages === 0}>
          다음
        </button>
      </div>
    </div>
  );
}
