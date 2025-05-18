# shared/ui

이 폴더는 프로젝트 전역에서 재사용되는 공통 UI 컴포넌트(Button, Input 등)를 관리합니다.

## 주요 역할

- 공통 UI 컴포넌트(Button, Input 등) 구현 및 관리
- 다양한 레이어에서 재사용 가능한 UI 요소 제공

## 개발 가이드

- 단순하고 범용적인 UI 컴포넌트만 작성하세요.
- 복잡한 비즈니스 로직이 필요한 컴포넌트는 entities/features/widgets에 작성하세요.

## 샘플 코드

```tsx
// Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
```
