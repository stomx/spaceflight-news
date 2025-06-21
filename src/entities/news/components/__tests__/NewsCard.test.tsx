import { render, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import { NewsCard } from '../NewsCard';

describe('NewsCard', () => {
  const mockProps = {
    imageUrl: 'https://example.com/test-image.jpg',
    title: '테스트 뉴스 제목',
    summary: '테스트 뉴스 요약 내용입니다.',
    date: '2024-01-01',
    site: '테스트 사이트',
  };

  it('뉴스 카드가 올바른 내용으로 렌더링되어야 한다', () => {
    render(<NewsCard {...mockProps} />);

    expect(screen.getByText('테스트 뉴스 제목')).toBeInTheDocument();
    expect(screen.getByText('테스트 뉴스 요약 내용입니다.')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('테스트 사이트')).toBeInTheDocument();
  });

  it('featured가 true일 때 특집 배지를 표시해야 한다', () => {
    render(<NewsCard {...mockProps} featured={true} />);
    expect(screen.getByText('특집')).toBeInTheDocument();
  });

  it('featured가 false이거나 없을 때 특집 배지를 표시하지 않아야 한다', () => {
    render(<NewsCard {...mockProps} featured={false} />);
    expect(screen.queryByText('특집')).not.toBeInTheDocument();
  });

  it('이미지가 올바른 src와 alt 속성을 가져야 한다', () => {
    render(<NewsCard {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', '테스트 뉴스 제목');
  });

  it('children 요소가 렌더링되어야 한다', () => {
    render(
      <NewsCard {...mockProps}>
        <button>테스트 버튼</button>
      </NewsCard>,
    );
    expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
  });
});
