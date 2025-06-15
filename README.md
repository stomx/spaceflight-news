# Spaceflight News 포트폴리오

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> 🚀 **[라이브 데모](https://your-demo-url.com)** | 📖 **[API 문서](https://api.spaceflightnewsapi.net/v4/docs)**

이 프로젝트는 [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/docs)를 활용해 우주 비행 관련 최신 뉴스, 기사, 블로그, 이벤트 정보를 제공하는 포트폴리오 웹앱입니다. React, Vite, TypeScript, TailwindCSS, FSD(Feature-Sliced Design) 기반으로 실무 역량을 보여주기 위한 목적입니다.

## 📸 스크린샷

![Desktop Screenshot](docs/images/desktop-screenshot.png)

---

## 🚀 빠른 시작 (Yarn 기준)

```bash
yarn install          # 의존성 설치
yarn dev              # 개발 서버 실행 (http://localhost:5173)
yarn build            # 프로덕션 빌드
yarn preview          # 빌드 결과 미리보기
yarn lint             # 코드 린트 검사
yarn format           # 코드 포맷팅
yarn deploy           # GitHub Pages 배포
```

- Node.js 18+ 필요
- 환경 변수는 `.env.example` 참고해 `.env` 파일로 복사 후 수정

---

## 🌐 API 및 환경설정
- Spaceflight News API v4 사용 (Base URL: `https://api.spaceflightnewsapi.net/v4/`)
- 인증 불필요, 주요 엔드포인트는 `/articles`, `/blogs` 등
- 환경 변수 예시:
  ```env
  VITE_API_URL=https://api.spaceflightnewsapi.net/v4
  ```

---

## 주요 기능

- **기사/블로그/뉴스 목록 조회**: Spaceflight News API에서 최신 기사, 블로그, 뉴스 데이터를 실시간으로 불러와 리스트로 제공합니다.
- **상세 페이지**: 각 기사/블로그 클릭 시 상세 정보(제목, 요약, 이미지, 원문 링크 등) 확인 가능
- **페이지네이션**: 대용량 데이터도 빠르게 탐색할 수 있도록 페이지 이동 지원
- **반응형 UI**: 모바일, 태블릿, 데스크톱 모두 최적화된 레이아웃
- **다크/라이트 테마**: 사용자 환경에 따라 자동 전환
- **로딩/에러 처리**: 데이터 요청 중 로딩 UI, 네트워크 오류 시 에러 메시지 표시
- **상태 관리**: 서버 상태는 TanStack Query, 클라이언트 상태는 Zustand로 분리 관리
- **접근성**: 키보드 네비게이션, 시맨틱 마크업 등 웹 접근성 준수

### 개발 예정 기능
- **검색/필터**: 제목, 날짜, 사이트 등으로 기사/블로그 검색 및 필터링
- **즐겨찾기**: 관심 뉴스/기사를 로컬에 저장해 북마크
- **무한 스크롤**: 스크롤 기반 자동 데이터 로딩
- **소셜 공유**: 주요 SNS로 기사 공유

---

## 폴더 구조 (FSD)

```
src/
  app/        # 앱 진입점, 글로벌 설정, 라우팅
  pages/      # 라우트별 페이지 컴포넌트
  widgets/    # 복합 UI 블록
  features/   # 사용자 중심 기능
  entities/   # 비즈니스 도메인
  shared/     # 공통 리소스 (API, UI, 유틸 등)
```

---

## 개발/기여 가이드
- PR 템플릿, 코드 컨벤션, 폴더별 README 참고
- 버그/기능 제안은 [Issues](https://github.com/your-username/portfolio-spaceflight-news/issues) 활용
- MIT 라이선스

---

**문의:** your.email@example.com / [포트폴리오](https://your-portfolio-site.com)
