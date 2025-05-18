import type { FC } from 'react';
import './App.css';

const App: FC = () => {
  return (
    <div className="container">
      <h1>Spaceflight News 포트폴리오</h1>
      <p>이 사이트는 Spaceflight News API를 활용하여 최신 우주 비행 뉴스를 제공합니다.</p>
      <p>좌측 메뉴 또는 상단 메뉴에서 뉴스를 확인해보세요.</p>
    </div>
  );
};

export default App;
