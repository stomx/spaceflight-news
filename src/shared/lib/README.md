# shared/lib

이 폴더는 프로젝트 전역에서 재사용되는 유틸 함수, 헬퍼, 라이브러리 코드를 관리합니다.

## 주요 역할

- 날짜, 문자열, 숫자 등 범용 유틸 함수 제공
- 여러 레이어에서 공통적으로 사용하는 헬퍼 함수 관리

## 개발 가이드

- 범용적이고 재사용 가능한 함수만 작성하세요.
- 특정 도메인/비즈니스 로직은 entities/features에 작성하세요.

## 샘플 코드

```ts
// formatDate.ts
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
```
