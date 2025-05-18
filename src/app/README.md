# app 레이어

앱 레이어는 프로젝트의 엔트리포인트, 글로벌 설정, 라우팅, Provider, 글로벌 레이아웃 등을 담당합니다.

## 주요 역할

- 앱 초기화(main.tsx)
- 글로벌 Provider(Theme, Store 등) 적용
- 라우팅 설정(React Router 등)
- 글로벌 레이아웃/스타일 적용

## 개발 가이드

- 앱 전체에 영향을 주는 설정/Provider만 이곳에 작성하세요.
- 페이지, 도메인, 기능별 코드는 각 레이어로 분리하세요.

## 샘플 코드

```tsx
// app.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from '@/pages/home';
import '@/shared/styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
```
