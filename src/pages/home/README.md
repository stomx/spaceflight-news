# home 페이지

이 폴더는 홈(메인) 페이지의 UI, 상태, 비즈니스 로직을 관리합니다.

## 주요 역할

- 홈 경로('/')에 해당하는 페이지 컴포넌트 구현
- 홈 화면에 필요한 UI, 상태, 로직 관리

## 개발 가이드

- 페이지별로 필요한 UI, model, lib 등 세그먼트로 세분화하세요.
- 페이지 내에서만 사용하는 코드는 이 폴더에 작성하세요.

## 샘플 코드

```tsx
// index.tsx
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
