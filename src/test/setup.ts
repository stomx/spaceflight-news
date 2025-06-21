// 테스트 환경 설정 파일
// 실제 테스트 의존성 설치 후 활성화 예정

// import '@testing-library/jest-dom';

// Mock IntersectionObserver for tests
// global.IntersectionObserver = class IntersectionObserver {
//   constructor() {}
//   disconnect() {}
//   observe() {}
//   unobserve() {}
// };

// Mock matchMedia for tests  
// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: vi.fn().mockImplementation(query => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: vi.fn(),
//     removeListener: vi.fn(),
//     addEventListener: vi.fn(),
//     removeEventListener: vi.fn(),
//     dispatchEvent: vi.fn(),
//   })),
// });

console.log('Test setup loaded');

export { };
