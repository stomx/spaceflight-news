import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input';

describe('Input Component', () => {
  describe('기본 렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(<Input data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('기본 클래스가 적용된다', () => {
      render(<Input data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveClass(
        'file:text-foreground',
        'placeholder:text-muted-foreground',
        'border-input',
        'flex',
        'h-9',
        'w-full',
        'rounded-md',
        'border',
        'bg-transparent',
        'px-3',
        'py-1'
      );
    });

    it('커스텀 클래스를 추가할 수 있다', () => {
      render(<Input className="custom-class" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('타입별 렌더링', () => {
    it('기본 text 타입으로 렌더링된다', () => {
      render(<Input type="text" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('password 타입으로 렌더링된다', () => {
      render(<Input type="password" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('email 타입으로 렌더링된다', () => {
      render(<Input type="email" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('number 타입으로 렌더링된다', () => {
      render(<Input type="number" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('file 타입으로 렌더링된다', () => {
      render(<Input type="file" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'file');
    });
  });

  describe('속성 전달', () => {
    it('placeholder를 설정할 수 있다', () => {
      render(<Input placeholder="입력하세요" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', '입력하세요');
    });

    it('value를 설정할 수 있다', () => {
      render(<Input value="테스트 값" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveValue('테스트 값');
    });

    it('disabled 상태를 설정할 수 있다', () => {
      render(<Input disabled data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
    });

    it('readOnly 상태를 설정할 수 있다', () => {
      render(<Input readOnly data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('readonly');
    });

    it('required 속성을 설정할 수 있다', () => {
      render(<Input required data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toBeRequired();
    });
  });

  describe('이벤트 처리', () => {
    it('onChange 이벤트가 정상적으로 동작한다', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: '새로운 값' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue('새로운 값');
    });

    it('onFocus 이벤트가 정상적으로 동작한다', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} data-testid="input" />);

      const input = screen.getByTestId('input');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('onBlur 이벤트가 정상적으로 동작한다', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId('input');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('onKeyDown 이벤트가 정상적으로 동작한다', () => {
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} data-testid="input" />);

      const input = screen.getByTestId('input');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('포커스 상태', () => {
    it('포커스를 받을 수 있다', () => {
      render(<Input data-testid="input" />);

      const input = screen.getByTestId('input');
      input.focus();

      expect(input).toHaveFocus();
    });

    it('포커스 시 적절한 스타일링이 적용된다', () => {
      render(<Input data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveClass('focus-visible:border-ring');
    });
  });

  describe('접근성', () => {
    it('텍스트박스 역할을 가진다', () => {
      render(<Input data-testid="input" />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('name 속성을 설정할 수 있다', () => {
      render(<Input name="username" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'username');
    });

    it('id 속성을 설정할 수 있다', () => {
      render(<Input id="username-input" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('id', 'username-input');
    });
  });

  describe('폼 통합', () => {
    it('form 제출 시 값이 포함된다', () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        expect(formData.get('username')).toBe('testuser');
      });

      render(
        <form onSubmit={handleSubmit} data-testid="form">
          <Input name="username" value="testuser" data-testid="input" />
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('상태별 스타일링', () => {
    it('에러 상태 시 적절한 스타일링이 적용된다', () => {
      render(<Input aria-invalid data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveClass('aria-invalid:border-destructive');
    });

    it('disabled 상태 시 적절한 스타일링이 적용된다', () => {
      render(<Input disabled data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });
});