# widgets 레이어

widgets 레이어는 여러 엔티티, 피처, 페이지를 조합한 UI 블록(섹션, 레이아웃 등)을 관리합니다.

## 주요 역할

- 페이지 내 주요 UI 섹션(헤더, 사이드바, 피드 등) 구현
- 여러 엔티티/피처를 조합한 복합 UI

## 개발 가이드

- 각 위젯은 별도 폴더로 분리
- 위젯별로 model, ui, lib 등 세그먼트로 세분화
- 페이지/레이아웃에서 재사용되는 복합 UI만 이곳에 작성

## 샘플 구조

```text
widgets/
  header/
    ui/
      Header.tsx
    model/
      useHeaderState.ts
```

## 샘플 코드

```tsx
// widgets/header/ui/Header.tsx
export function Header() {
  return <header>헤더</header>;
}
```
