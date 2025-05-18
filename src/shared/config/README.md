# shared/config

이 폴더는 프로젝트 전역에서 사용하는 설정 파일, 환경 변수, API 엔드포인트 등 공통 설정을 관리합니다.

## 주요 역할

- API 엔드포인트, 환경 변수 등 글로벌 설정 관리
- 여러 레이어에서 참조되는 설정 파일 제공

## 개발 가이드

- 환경별 설정은 별도 파일로 분리하세요.
- 민감 정보는 .env 파일 등 외부에서 관리하세요.

## 샘플 코드

```ts
// apiConfig.ts
export const API_BASE_URL = 'https://api.example.com';
```
