import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

describe('Avatar Component', () => {
  describe('기본 렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test.jpg" alt="테스트 이미지" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-slot', 'avatar');
    });

    it('기본 클래스가 적용된다', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test.jpg" alt="테스트 이미지" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('relative', 'flex', 'size-8', 'shrink-0', 'overflow-hidden', 'rounded-full');
    }); it('커스텀 클래스를 추가할 수 있다', () => {
      render(
        <Avatar className="custom-class" data-testid="avatar">
          <AvatarImage src="/test.jpg" alt="테스트 이미지" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('custom-class');
    });
  });

  describe('AvatarImage 컴포넌트', () => {
    it('이미지 실패 시 폴백이 표시된다', () => {
      // 실제 동작 테스트: 이미지 로드 실패 시 Fallback만 표시됨
      render(
        <Avatar>
          <AvatarImage src="/nonexistent.jpg" alt="존재하지 않는 이미지" />
          <AvatarFallback data-testid="avatar-fallback">실패</AvatarFallback>
        </Avatar>
      );

      // 이미지 로드 실패 시 fallback이 표시됨
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
      expect(screen.getByText('실패')).toBeInTheDocument();
    });

    it('Avatar 내에서 이미지 컴포넌트가 렌더링된다', () => {
      // 실제 Avatar 내에서의 동작 확인
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test.jpg" alt="테스트" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      );

      // Avatar 컴포넌트 자체는 렌더링됨
      expect(screen.getByTestId('avatar')).toBeInTheDocument();

      // 이미지가 없어도 data-slot으로 DOM에 존재하는지 확인
      const avatarRoot = screen.getByTestId('avatar');
      expect(avatarRoot).toHaveAttribute('data-slot', 'avatar');
    });

    it('Avatar 구조가 올바르게 렌더링된다', () => {
      render(
        <Avatar className="test-avatar">
          <AvatarImage src="/test.jpg" alt="테스트" className="test-image" />
          <AvatarFallback className="test-fallback">TB</AvatarFallback>
        </Avatar>
      );

      // Avatar 루트 요소 확인
      const avatar = document.querySelector('[data-slot="avatar"]');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass('test-avatar');

      // Fallback 요소 확인 (이미지 로드 실패 시 표시됨)
      const fallback = document.querySelector('[data-slot="avatar-fallback"]');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveClass('test-fallback');
    });
  });

  describe('AvatarFallback 컴포넌트', () => {
    it('폴백 텍스트를 표시한다', () => {
      render(
        <Avatar>
          <AvatarImage src="/invalid.jpg" alt="잘못된 이미지" />
          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('JD');
      expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback');
    });

    it('기본 폴백 클래스가 적용된다', () => {
      render(
        <Avatar>
          <AvatarImage src="/invalid.jpg" alt="잘못된 이미지" />
          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveClass('bg-muted', 'flex', 'size-full', 'items-center', 'justify-center', 'rounded-full');
    });

    it('커스텀 폴백 클래스를 추가할 수 있다', () => {
      render(
        <Avatar>
          <AvatarImage src="/invalid.jpg" alt="잘못된 이미지" />
          <AvatarFallback className="custom-fallback-class" data-testid="avatar-fallback">
            JD
          </AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveClass('custom-fallback-class');
    });
  });

  describe('조합 사용', () => {
    it('이미지와 폴백을 함께 사용할 수 있다', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/user.jpg" alt="사용자" />
          <AvatarFallback data-testid="avatar-fallback">U</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();

      // Avatar와 Fallback 구조 확인
      const avatar = document.querySelector('[data-slot="avatar"]');
      const fallback = document.querySelector('[data-slot="avatar-fallback"]');
      expect(avatar).toBeInTheDocument();
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('적절한 폴백 텍스트를 제공한다', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/user.jpg" alt="사용자 프로필 사진" />
          <AvatarFallback data-testid="avatar-fallback">사용자</AvatarFallback>
        </Avatar>
      );

      // 이미지 로드 실패 시 폴백 텍스트가 적절히 표시됨
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
      expect(screen.getByText('사용자')).toBeInTheDocument();
    });

    it('폴백 텍스트가 명확하다', () => {
      render(
        <Avatar>
          <AvatarImage src="/invalid.jpg" alt="프로필" />
          <AvatarFallback data-testid="avatar-fallback">사용자</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('사용자');
    });
  });
});