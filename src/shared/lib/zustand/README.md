# Zustand 상태 관리 가이드

## 목적

- 전역 UI/임시 상태를 간결하게 관리하고, 불필요한 리렌더링을 최소화합니다.
- Redux 대비 보일러플레이트가 적고, Provider 없이 사용할 수 있습니다.

## 작성 규칙

- 스토어는 반드시 useXxxStore 네이밍을 사용합니다.
- 전역 UI/임시 상태(예: 다크모드, 모달 등)는 shared/lib/zustand/에 작성합니다.
- 도메인/엔티티 전용 상태는 entities/features 하위에 작성합니다.
- 상태 타입은 명확히 지정하며, any/unknown 사용을 금지합니다.
- 모든 public 함수/스토어에는 한글 주석으로 용도를 설명합니다.
- 불필요한 코드, 미사용 변수, 콘솔로그는 금지합니다.

## 샘플 코드

```ts
// themeStore.ts
import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

/**
 * 다크모드 상태를 관리하는 전역 스토어입니다.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
```

## 참고

- Provider로 감쌀 필요 없이, 훅을 import하여 바로 사용할 수 있습니다.
- 상태 관리 전략 요약 및 폴더 구조는 프로젝트 루트 README.md를 참고하세요.
