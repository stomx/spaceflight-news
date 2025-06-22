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
    });    it('커스텀 클래스를 추가할 수 있다', () => {
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
    it('이미지 URL과 alt 텍스트가 설정된다', () => {
      render(
        <Avatar>
          <AvatarImage src="/user.jpg" alt="사용자 프로필" data-testid="avatar-image" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );

      const image = screen.getByTestId('avatar-image');
      expect(image).toHaveAttribute('src', '/user.jpg');
      expect(image).toHaveAttribute('alt', '사용자 프로필');
      expect(image).toHaveAttribute('data-slot', 'avatar-image');
    });

    it('기본 이미지 클래스가 적용된다', () => {
      render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="테스트" data-testid="avatar-image" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );

      const image = screen.getByTestId('avatar-image');
      expect(image).toHaveClass('aspect-square', 'size-full');
    });    it('커스텀 이미지 클래스를 추가할 수 있다', () => {
      render(
        <Avatar>
          <AvatarImage 
            src="/test.jpg" 
            alt="테스트" 
            className="custom-image-class" 
            data-testid="avatar-image" 
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );

      const image = screen.getByTestId('avatar-image');
      expect(image).toHaveClass('custom-image-class');
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
          <AvatarImage src="/user.jpg" alt="사용자" data-testid="avatar-image" />
          <AvatarFallback data-testid="avatar-fallback">U</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('적절한 alt 속성을 가진다', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/user.jpg" alt="사용자 프로필 사진" data-testid="avatar-image" />
          <AvatarFallback data-testid="avatar-fallback">U</AvatarFallback>
        </Avatar>
      );

      const image = screen.getByTestId('avatar-image');
      expect(image).toHaveAttribute('alt', '사용자 프로필 사진');
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