import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsList } from '../NewsList';

describe('NewsList', () => {
  const mockItems = [
    { id: 1, title: 'Test 1', summary: 'Summary 1', imageUrl: 'url1', publishedAt: '2023-01-01', site: 'Site1', featured: false },
    { id: 2, title: 'Test 2', summary: 'Summary 2', imageUrl: 'url2', publishedAt: '2023-01-02', site: 'Site2', featured: true },
  ];

  const mockRenderItem = vi.fn((item) => <div key={item.id}>{item.title}</div>);

  beforeEach(() => {
    mockRenderItem.mockClear();
  });

  it('항목이 있을 때 목록을 올바르게 렌더링해야 한다', () => {
    render(<NewsList items={mockItems} renderItem={mockRenderItem} emptyText="표시할 항목이 없습니다." />);
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(mockRenderItem).toHaveBeenCalledTimes(2);
  });

  it('빈 목록일 때 기본 메시지를 표시해야 한다', () => {
    render(<NewsList items={[]} renderItem={mockRenderItem} emptyText="표시할 항목이 없습니다." />);
    expect(screen.getByText('표시할 항목이 없습니다.')).toBeInTheDocument();
  });

  it('페이지네이션 컨트롤이 올바르게 렌더링되어야 한다', () => {
    const mockPageChange = vi.fn();
    render(
      <NewsList
        items={mockItems}
        renderItem={mockRenderItem}
        page={2}
        totalPages={5}
        onPageChange={mockPageChange}
        emptyText="표시할 항목이 없습니다."
      />,
    );

    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('이전 버튼 클릭 시 onPageChange가 호출되어야 한다', async () => {
    const mockPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <NewsList
        items={mockItems}
        renderItem={mockRenderItem}
        page={2}
        totalPages={5}
        onPageChange={mockPageChange}
        emptyText="표시할 항목이 없습니다."
      />,
    );

    const prevButton = screen.getByRole('button', { name: '이전' });
    await user.click(prevButton);
    expect(mockPageChange).toHaveBeenCalledWith(1);
  });

  it('다음 버튼 클릭 시 onPageChange가 호출되어야 한다', async () => {
    const mockPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <NewsList
        items={mockItems}
        renderItem={mockRenderItem}
        page={2}
        totalPages={5}
        onPageChange={mockPageChange}
        emptyText="표시할 항목이 없습니다."
      />,
    );

    const nextButton = screen.getByRole('button', { name: '다음' });
    await user.click(nextButton);
    expect(mockPageChange).toHaveBeenCalledWith(3);
  });

  it('첫 페이지에서는 이전 버튼이 비활성화되어야 한다', () => {
    const mockPageChange = vi.fn();
    render(
      <NewsList
        items={mockItems}
        renderItem={mockRenderItem}
        page={1}
        totalPages={5}
        onPageChange={mockPageChange}
        emptyText="표시할 항목이 없습니다."
      />,
    );
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
  });

  it('마지막 페이지에서는 다음 버튼이 비활성화되어야 한다', () => {
    const mockPageChange = vi.fn();
    render(
      <NewsList
        items={mockItems}
        renderItem={mockRenderItem}
        page={5}
        totalPages={5}
        onPageChange={mockPageChange}
        emptyText="표시할 항목이 없습니다."
      />,
    );
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });
});
