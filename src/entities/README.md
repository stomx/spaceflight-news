# entities 레이어

entities 레이어는 비즈니스 도메인(핵심 데이터 모델)과 관련된 컴포넌트, 상태, API, 타입 등을 관리합니다.

## 주요 역할

- 도메인 모델(예: User, Article 등) 정의
- 엔티티별 상태, API, UI, 타입 등 관리

## 개발 가이드

- 각 엔티티는 별도 폴더로 분리
- 엔티티별로 model, api, ui, lib 등 세그먼트로 세분화
- 여러 페이지/기능에서 재사용되는 핵심 도메인 로직만 이곳에 작성

## 샘플 구조

```text
entities/
  user/
    model/
      useUserQuery.ts
    api/
      userApi.ts
    ui/
      UserAvatar.tsx
```

## 샘플 코드

```ts
// entities/user/model/useUserQuery.ts
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/userApi';

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });
}
```
