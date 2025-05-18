# shared 레이어

shared 레이어는 프로젝트 전역에서 재사용되는 공통 리소스(UI, 유틸, 타입, 스타일, 에셋 등)를 관리합니다.

## 주요 역할

- 공통 UI 컴포넌트(Button, Input 등)
- 유틸 함수, 타입, 상수, 글로벌 스타일, 에셋 등

## 개발 가이드

- ui, lib, styles, assets, config 등 세그먼트로 세분화
- 프로젝트 어디서나 재사용 가능한 코드만 작성

## 샘플 구조

```text
shared/
  ui/
    Button.tsx
  lib/
    formatDate.ts
  styles/
    index.css
  assets/
    logo.svg
  config/
    apiConfig.ts
```

## 샘플 코드

```tsx
// shared/ui/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
```
