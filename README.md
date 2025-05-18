# Spaceflight News 포트폴리오

이 프로젝트는 [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/docs)를 활용하여 우주 비행 관련 최신 뉴스, 기사, 블로그, 이벤트 정보를 제공하는 포트폴리오 웹 애플리케이션입니다.
React, Vite, TypeScript, TailwindCSS, FSD(Feature-Sliced Design) 아키텍처를 기반으로 개발되었으며,
실제 API 연동, 상태 관리, 컴포넌트 설계, 코드 품질 관리 등 실무 역량을 보여주기 위한 목적의 포트폴리오입니다.

## 주요 기능

- Spaceflight News API를 통한 뉴스/기사/이벤트 실시간 조회
- 기사 상세 페이지, 검색, 필터, 즐겨찾기 등(추가 개발 가능)
- 최신 프론트엔드 기술 및 아키텍처 적용

## 프로젝트 구조(FSD)

```text
src/
  app/        # 엔트리포인트, 글로벌 설정, 라우팅, Provider 등
  pages/      # 라우트(페이지) 단위 컴포넌트 및 상태
  entities/   # 비즈니스 도메인(핵심 데이터 모델, 상태, API, UI 등)
  features/   # 사용자 중심의 독립 기능(로그인, 검색 등)
  widgets/    # 여러 엔티티/피처/페이지를 조합한 UI 블록
  shared/     # 전역 공통 리소스(UI, 유틸, 타입, 스타일, 에셋 등)
```

## 각 레이어별 역할

- **app**: 앱 초기화, 글로벌 Provider, 라우팅, 레이아웃 등
- **pages**: 라우트별 페이지 컴포넌트 및 상태 관리
- **entities**: 도메인 모델, 상태, API, UI 등 핵심 비즈니스 로직
- **features**: 단일 목적의 기능 단위(로그인, 댓글 등)
- **widgets**: 여러 레이어를 조합한 복합 UI(헤더, 피드 등)
- **shared**: 공통 UI, 유틸, 타입, 스타일, 에셋, 설정 등

## 개발 가이드

- 폴더별 README.md 참고(역할, 가이드, 샘플 코드 포함)
- 경로 별칭(@) 사용: `@/pages/home` 등
- TailwindCSS는 컴포넌트에서만 사용, index.html에는 적용하지 않음
- Biome 포매터, 린터, import 정렬, VSCode 자동 포맷팅 적용
- 타입스크립트, Vite, Tailwind, Biome 등 최신 공식 가이드만 참고

## 주요 설정

- **경로 별칭(@)**: `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`에 모두 설정
- **TailwindCSS**: `src/shared/styles/index.css`에서 관리, 커스텀 유틸리티는 @layer utilities에 작성
- **Biome**: 코드 포맷팅, import 정렬, 줄 끝 공백/빈 줄 정리 등 자동화
- **README.md**: 모든 레이어 및 주요 하위 폴더에 역할/가이드/샘플 코드 포함

## 팀 규칙(요약)

- 모든 코드/주석/문서는 한글로 작성
- 변수, 함수, 파일명: camelCase / 타입, 컴포넌트: PascalCase
- 들여쓰기 2칸, 한 줄 최대 120자
- any, unknown 지양, 명확한 타입 지정
- API 함수 네이밍(getXxx, postXxx 등), 에러/로딩/성공 상태 일관 처리
- 불필요한 코드/주석/콘솔로그 금지, 미사용/정의되지 않은 변수, 타입 불일치, Promise 에러 미처리 등 잠재적 오류 항상 검토
- public 함수에는 용도 설명 주석 필수

## 상태 관리 전략(요약)

- 서버 상태(비동기 API 데이터)는 React Query로, 클라이언트 상태(UI/임시 상태)는 Zustand로 관리합니다.
- 상세 가이드, 샘플 코드, 작성 규칙 등은 각 폴더의 README.md(`src/shared/api/README.md`, `src/shared/lib/zustand/README.md`)를 참고하세요.

---

자세한 개발 방법과 폴더별 예시는 각 폴더의 README.md를 참고하세요.
