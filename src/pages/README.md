# pages 레이어

pages 레이어는 라우트(페이지) 단위의 슬라이스를 관리합니다.
각 폴더는 하나의 페이지(경로)와 1:1로 매핑됩니다.

## 주요 역할

- 라우트별 페이지 컴포넌트 관리
- 각 페이지별 UI, 상태, 비즈니스 로직의 진입점

## 개발 가이드

- 각 페이지는 별도 폴더(예: home, about 등)로 분리
- 페이지 폴더 내에 index.tsx(진입점), ui/, model/, lib/ 등 세그먼트로 세분화 가능
- 페이지 내에서만 사용하는 컴포넌트/로직은 이 폴더에 작성

## 샘플 구조

```text
pages/
  home/
    index.tsx
    ui/
      Banner.tsx
    model/
      useHomeState.ts
```

## 샘플 코드

```tsx
// pages/home/index.tsx
import { Banner } from './ui/Banner';

function HomePage() {
  return (
    <div>
      <Banner />
      <h1>홈 페이지</h1>
    </div>
  );
}

export default HomePage;
```
