# shared/styles

이 폴더는 프로젝트 전역에서 사용하는 글로벌 스타일(TailwindCSS v4, CSS, reset 등)을 관리합니다.

## 주요 역할

- TailwindCSS v4, 글로벌 CSS, reset 등 스타일 파일 관리
- 프로젝트 전체에 적용되는 스타일 정의

## 개발 가이드

- TailwindCSS는 공식 v4 가이드에 따라 `index.css`에서 관리합니다.
- 컴포넌트 별 스타일은 각 레이어/ui 폴더에 작성하세요.

## 1. 커스텀 유틸리티 작성법 (v4)

```css
@import "tailwindcss";

@layer utilities {
  .tab-4 {
    tab-size: 4;
  }
}

@utility tab-4 {
  tab-size: 4;
}
```

- 두 방식 모두 Tailwind의 JIT 엔진이 인식하며, `hover:`, `lg:` 등 variant와 함께 사용할 수 있습니다.
- 자세한 내용: [Upgrade Guide - Adding custom utilities](https://tailwindcss.com/docs/upgrade-guide#adding-custom-utilities)

## 2. @theme 디렉티브 및 CSS 변수 사용법 (v4)

TailwindCSS v4에서는 테마 값(색상, 폰트, 브레이크포인트 등)을 **@theme 디렉티브**와 **CSS 변수**로 정의하고 활용하는 것이 표준입니다.

### @theme 디렉티브로 커스텀 테마 변수 정의

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  /* ... */
}
```

### CSS 변수로 테마 값 사용

```css
@import "tailwindcss";

@layer utilities {
  .custom-bg {
    background-color: var(--color-avocado-300);
  }
  .custom-font {
    font-family: var(--font-display);
  }
  .custom-spacing {
    padding: var(--spacing-4);
  }
}
```

- 자세한 내용: [Functions and Directives - theme()](https://tailwindcss.com/docs/functions-and-directives#theme-directive)

## 3. 컴포넌트 유틸리티(Components) 작성법

```css
@import "tailwindcss";

@layer components {
  .btn {
    @apply px-4 py-2 rounded bg-blue-500 text-white font-bold;
    transition: background 0.2s;
  }
  .btn-outline {
    @apply border border-blue-500 text-blue-500 bg-white;
  }
}

@component btn {
  @apply px-4 py-2 rounded bg-blue-500 text-white font-bold;
  transition: background 0.2s;
}
```

- 컴포넌트 유틸리티는 여러 속성을 가진 재사용 스타일에 적합합니다.
- 자세한 내용: [Styling with Utility Classes - Using Components](https://tailwindcss.com/docs/styling-with-utility-classes#using-components)

## 참고

- Tailwind v4에서는 CSS 변수와 새로운 디렉티브(`@theme`, `@utility`, `@component`)를 적극 활용할 수 있습니다.
- 공식 문서:
  - [Upgrade Guide - Adding custom utilities](https://tailwindcss.com/docs/upgrade-guide#adding-custom-utilities)
  - [Functions and Directives - theme()](https://tailwindcss.com/docs/functions-and-directives#theme-directive)
  - [Styling with Utility Classes - Using Components](https://tailwindcss.com/docs/styling-with-utility-classes#using-components)
