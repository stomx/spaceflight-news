# Spaceflight News

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/stomx/spaceflight-news/releases)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> 🚀 **[라이브 데모 보기](https://your-demo-url.com)** | 📖 **[API 문서](https://api.spaceflightnewsapi.net/v4/docs)**

이 프로젝트는 [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/docs)를 활용하여 우주 비행 관련 최신 뉴스, 기사, 블로그, 보고서 정보를 제공하는 웹 애플리케이션입니다.
React, Vite, TypeScript, TailwindCSS, FSD(Feature-Sliced Design) 아키텍처를 기반으로 개발되었으며,
실제 API 연동, 상태 관리, 컴포넌트 설계, 코드 품질 관리 등 현대적인 웹 개발 기술들을 활용합니다.

## 📸 스크린샷

<details>
<summary>🖥️ 데스크톱 화면</summary>

![Desktop Screenshot](docs/images/desktop-screenshot.png)
*메인 화면 - 기사 목록*

</details>

<details>
<summary>📱 모바일 화면</summary>

![Mobile Screenshot](docs/images/mobile-screenshot.png)
*반응형 디자인 - 모바일 최적화*

</details>

## 🚀 빠른 시작

### 전제 조건
- Node.js 22.16.0
- npm 또는 yarn

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/your-username/spaceflight-news.git
cd spaceflight-news

# 의존성 설치
npm install
# 또는
yarn install

# 환경 변수 설정 (선택사항)
cp .env.example .env
# .env 파일에서 필요한 설정 수정

# 개발 서버 실행
npm run dev
# http://localhost:5173 에서 확인

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# GitHub Pages 배포
npm run deploy
```

### 📋 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `yarn dev` | 개발 서버 실행 (HMR 지원) |
| `yarn build` | 프로덕션 빌드 |
| `yarn preview` | 빌드 결과 미리보기 |
| `yarn biome-fix` | 자동 수정 가능한 린트 에러 수정 |
| `yarn biome-ci` | CI 환경용 린트 검사 |
| `yarn type-check` | 빌드 없이 타입 체크만 수행 |
| `yarn test` | 테스트 실행 |
| `yarn test:ui` | 테스트 UI 실행 |
| `yarn test:coverage` | 테스트 커버리지 확인 |

## 🛠 기술 스택

### 핵심 기술
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **TailwindCSS** - 스타일링

### 라우팅 & 상태 관리
- **TanStack Router** - 타입 안전한 라우팅
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### UI 컴포넌트 & 아이콘
- **Radix UI** - 접근성 있는 UI 프리미티브
- **Lucide React** - 아이콘 라이브러리
- **Heroicons** - 추가 아이콘 세트

### 개발 도구
- **Biome** - 린터 & 포매터
- **Class Variance Authority** - 조건부 스타일링
- **Axios** - HTTP 클라이언트

## 🎯 주요 기능 및 특징

### ✅ 구현된 기능
- 🌐 **실시간 데이터 연동** - Spaceflight News API를 통한 최신 우주 뉴스
- 📄 **페이지네이션** - 효율적인 대용량 데이터 탐색
- 📱 **반응형 디자인** - 모바일/태블릿/데스크톱 최적화
- 🔄 **상태 관리** - TanStack Query + Zustand 조합
- ⚡ **성능 최적화** - 코드 스플리팅, 지연 로딩
- 🎨 **접근성** - WCAG 가이드라인 준수, 키보드 네비게이션
- 🌙 **다크 모드** - 사용자 선호도 기반 테마 전환
- 📊 **에러 바운더리** - 우아한 에러 처리 및 복구

### 🔄 개발 예정 기능
- 🔍 **고급 검색** - 제목, 내용, 태그 기반 검색
- 🏷️ **필터링** - 날짜, 사이트, 카테고리별 필터
- ⭐ **즐겨찾기** - 로컬 스토리지 기반 북마크
- ♾️ **무한 스크롤** - 페이지네이션 대안 옵션
- 📤 **소셜 공유** - SNS 통합 공유 기능
- 🔔 **알림 설정** - 새 기사 알림 (PWA 기반)

## 📁 프로젝트 구조 (FSD)

이 프로젝트는 **Feature-Sliced Design** 아키텍처를 따릅니다:

```text
src/
├── app/        # 🎯 앱 진입점, 글로벌 설정, 라우팅, Provider
├── pages/      # 📄 라우트별 페이지 컴포넌트 및 상태
├── widgets/    # 🧩 복합 UI 블록 (헤더, 네비게이션 등)
├── features/   # ⚡ 사용자 중심 기능 (검색, 필터 등)
├── entities/   # 🏗️ 비즈니스 도메인 (뉴스, 사용자 등)
└── shared/     # 🔧 공통 리소스 (API, UI, 유틸리티)
```

## 🏗️ 아키텍처 레이어별 역할

| 레이어 | 역할 | 예시 |
|--------|------|------|
| **app** | 앱 초기화, 글로벌 Provider, 라우팅 설정 | App.tsx, query-provider.tsx |
| **pages** | 라우트별 페이지 컴포넌트 및 라우트 상태 | /articles, /blogs, /reports, /articles/$id |
| **widgets** | 여러 레이어를 조합한 복합 UI 블록 | GNB, Footer, Sidebar |
| **features** | 단일 목적의 독립적인 사용자 기능 | article-list, blog-list, report-list |
| **entities** | 도메인 모델, 비즈니스 로직, 도메인 UI | news (NewsCard, NewsList) |
| **shared** | 전역 공통 리소스 (API, UI, 유틸, 타입) | api-client, Button, types |

## 🌐 API 연동 및 환경 설정

이 프로젝트는 **Spaceflight News API v4**를 사용합니다:

### API 정보
- **Base URL**: `https://api.spaceflightnewsapi.net/v4/`
- **인증**: 불필요 (공개 API)
- **Rate Limit**: 없음
- **주요 엔드포인트**:
  - `GET /articles` - 기사 목록
  - `GET /articles/{id}` - 기사 상세
  - `GET /blogs` - 블로그 목록
  - `GET /blogs/{id}` - 블로그 상세
  - `GET /reports` - 보고서 목록
  - `GET /reports/{id}` - 보고서 상세

### 환경 변수 설정

```bash
# .env 파일 생성
VITE_API_URL=https://api.spaceflightnewsapi.net/v4
```

**주요 환경 변수:**
| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `VITE_API_URL` | API 서버 URL | `https://api.spaceflightnewsapi.net/v4` |

> 💡 **참고**: 모든 환경 변수는 `VITE_` 접두사가 필요합니다 (Vite 규칙)

## 📚 개발 가이드

- 폴더별 README.md 참고(역할, 가이드, 샘플 코드 포함)
- 경로 별칭(@) 사용: `@/pages/home` 등
- TailwindCSS는 컴포넌트에서만 사용, index.html에는 적용하지 않음
- Biome 포매터, 린터, import 정렬, VSCode 자동 포맷팅 적용
- 타입스크립트, Vite, Tailwind, Biome 등 최신 공식 가이드만 참고

## ⚙️ 주요 설정

- **경로 별칭(@)**: `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`에 모두 설정
- **TailwindCSS**: `src/shared/styles/index.css`에서 관리, 커스텀 유틸리티는 @layer utilities에 작성
- **Biome**: 코드 포맷팅, import 정렬, 줄 끝 공백/빈 줄 정리 등 자동화
- **README.md**: 모든 레이어 및 주요 하위 폴더에 역할/가이드/샘플 코드 포함

## 👥 개발 규칙

- 모든 코드/주석/문서는 한글로 작성
- 변수, 함수, 파일명: camelCase / 타입, 컴포넌트: PascalCase
- 들여쓰기 2칸, 한 줄 최대 120자
- any, unknown 지양, 명확한 타입 지정
- API 함수 네이밍(getXxx, postXxx 등), 에러/로딩/성공 상태 일관 처리
- 불필요한 코드/주석/콘솔로그 금지, 미사용/정의되지 않은 변수, 타입 불일치, Promise 에러 미처리 등 잠재적 오류 항상 검토
- public 함수에는 용도 설명 주석 필수

## 🔄 상태 관리 전략

- 서버 상태(비동기 API 데이터)는 **TanStack Query**로, 클라이언트 상태(UI/임시 상태)는 **Zustand**로 관리합니다.
- 상세 가이드, 샘플 코드, 작성 규칙 등은 각 폴더의 README.md(`src/shared/api/README.md`, `src/shared/lib/zustand/README.md`)를 참고하세요.

## 📊 성능 및 품질 지표

> 아래 수치는 실제 배포 환경에서 측정된 값이 아니며, 프로젝트 목표 또는 예시 수치입니다. 실제 값은 빌드/배포 후 Lighthouse, Web Vitals, 번들 분석 도구 등으로 측정해 주세요.

### 🚀 성능 최적화 (예상치)
- **번들 크기**: ~120KB (gzipped, 목표)
- **초기 로딩**: ~1.2초 (3G 기준, 목표)
- **Lighthouse 점수**: Performance 95+ / Accessibility 100 (목표)
- **Core Web Vitals**: 모든 지표 Good 등급 (목표)

### 🛡️ 코드 품질
- **TypeScript 커버리지**: 100% (목표)
- **테스트 커버리지**: 85%+ (목표)
- **린팅**: Biome + 사용자 정의 규칙 적용
- **접근성**: WCAG 2.1 AA 준수 (목표)

## 📂 폴더별 상세 가이드

각 폴더의 README.md 파일에서 해당 레이어의 상세한 개발 가이드를 확인할 수 있습니다:

| 레이어 | 가이드 문서 | 설명 |
|--------|------------|------|
| **app** | [`src/app/README.md`](src/app/README.md) | 앱 진입점 및 글로벌 설정 |
| **pages** | [`src/pages/README.md`](src/pages/README.md) | 페이지 라우팅 가이드 |
| **widgets** | [`src/widgets/README.md`](src/widgets/README.md) | 복합 UI 컴포넌트 |
| **features** | [`src/features/README.md`](src/features/README.md) | 기능 단위 개발 |
| **entities** | [`src/entities/README.md`](src/entities/README.md) | 도메인 엔티티 설계 |
| **shared** | [`src/shared/README.md`](src/shared/README.md) | 공통 리소스 관리 |

## 👨‍💻 개발자 정보

**Jaymon** - 개발자  
📧 Email: stomx.work@kakao.com  
🔗 LinkedIn: [stomx](https://www.linkedin.com/in/stomx/)

## 🙏 감사의 말

- [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/docs) - 무료 우주 뉴스 데이터 제공
- [Feature-Sliced Design](https://feature-sliced.design/) - 프로젝트 아키텍처 가이드
- [Vite](https://vitejs.dev/) - 빠른 개발환경 제공
- [TanStack](https://tanstack.com/) - 강력한 React 생태계 도구들
