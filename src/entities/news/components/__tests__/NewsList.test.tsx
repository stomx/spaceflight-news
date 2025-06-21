import { mockNewsItem, mockNewsItemFeatured } from '@/test/test-utils';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsList } from '../NewsList';

describe('NewsList', () => {
  const mockItems = [mockNewsItem, mockNewsItemFeatured];
  const mockRenderItem = vi.fn((item) => (
    <div key={item.id} data-testid={`news-item-${item.id}`}>
      {item.title}
    </div>
  ));

  beforeEach(() => {
    mockRenderItem.mockClear();
  });

  it('아이템 목록이 올바르게 렌더링되어야 한다', () => {
    render(<NewsList items={mockItems} renderItem={mockRenderItem} />);

    expect(screen.getByTestId('news-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('news-item-2')).toBeInTheDocument();
    expect(mockRenderItem).toHaveBeenCalledTimes(2);
  });

  it('빈 목록일 때 기본 메시지를 표시해야 한다', () => {
    render(<NewsList items={[]} renderItem={mockRenderItem} />);

    expect(screen.getByText('표시할 항목이 없습니다.')).toBeInTheDocument();
  });

  it('빈 목록일 때 커스텀 메시지를 표시해야 한다', () => {
    render(<NewsList items={[]} renderItem={mockRenderItem} emptyText="뉴스가 없습니다." />);

    expect(screen.getByText('뉴스가 없습니다.')).toBeInTheDocument();
  });

  it('페이지네이션이 제공되면 페이지 컨트롤을 표시해야 한다', () => {
    const mockPageChange = vi.fn();
    render(
      <NewsList items={mockItems} renderItem={mockRenderItem} page={2} totalPages={5} onPageChange={mockPageChange} />,
    );

    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByText('이전')).toBeInTheDocument();
    expect(screen.getByText('다음')).toBeInTheDocument();
  });

  it('첫 페이지에서 이전 버튼이 비활성화되어야 한다', () => {
    const mockPageChange = vi.fn();
    render(
      <NewsList items={mockItems} renderItem={mockRenderItem} page={1} totalPages={5} onPageChange={mockPageChange} />,
    );

    const prevButton = screen.getByText('이전');
    expect(prevButton).toBeDisabled();
  });

  it('마지막 페이지에서 다음 버튼이 비활성화되어야 한다', () => {
    const mockPageChange = vi.fn();
    render(
      <NewsList items={mockItems} renderItem={mockRenderItem} page={5} totalPages={5} onPageChange={mockPageChange} />,
    );

    const nextButton = screen.getByText('다음');
    expect(nextButton).toBeDisabled();
  });

  it('페이지 변경 버튼 클릭 시 콜백이 호출되어야 한다', async () => {
    const user = userEvent.setup();
    const mockPageChange = vi.fn();

    render(
      <NewsList items={mockItems} renderItem={mockRenderItem} page={2} totalPages={5} onPageChange={mockPageChange} />,
    );

    await user.click(screen.getByText('이전'));
    expect(mockPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('다음'));
    expect(mockPageChange).toHaveBeenCalledWith(3);
  });
});
