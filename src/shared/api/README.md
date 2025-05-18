# shared/api

이 폴더는 프로젝트 전역에서 사용하는 **공통 API 클라이언트**와 **React Query 클라이언트**를 관리합니다.

## 주요 역할

- axios 기반의 공통 API 요청과 응답 처리를 중앙화
- React Query 전역 클라이언트 설정 및 캐싱 정책 관리

## 개발 가이드

- 모든 API 호출은 TanStack Query(`useQuery`, `useMutation`)로 래핑된 custom hook을 통해 수행해야 합니다.
- 공통 axios 인스턴스(`apiClient`)는 hooks 내부에서만 사용하고, 직접 호출을 지양하세요.
- `API_URL`은 `@/shared/config`에서 관리되며, 환경별로 설정합니다.
- 중복된 에러 핸들링을 방지하기 위해 `ApiClient`의 `handleError`를 활용하세요.
- 타입 안정성을 위해 API 요청/응답 인터페이스를 명확히 정의합니다.
- 미사용 코드, 변수, 콘솔 로그는 제거하여 코드 청결성을 유지합니다.
- 도메인별 훅(useQuery/useMutation)은 `entities` 또는 `features` 레이어에 정의하세요.

## 샘플 코드

```tsx
// entities/user/api.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';

/**
 * 사용자 정보 조회 Hook
 */
export function useUser(userId: string) {
  return useQuery(['user', userId], () => apiClient.get(`/users/${userId}`));
}
```

```tsx
// components/UserProfile.tsx
import { useUser } from '@/entities/user/api';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return <div>{data?.name}</div>;
}

export default UserProfile;
```
