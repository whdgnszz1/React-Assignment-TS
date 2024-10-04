import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import customRender from '@/utils/test/render';
import { EmptyNotice } from '../EmptyNotice';

// 실제 모듈을 모킹한 모듈로 대체하여 테스트 실행 (react-router-dom의 useNavigate 모킹)
const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
  };
});

it('"홈으로 가기" 링크를 클릭할 경우 "/" 경로로 navigate 함수가 호출된다', async () => {
  // Arrange: EmptyNotice 컴포넌트를 렌더링
  const { user } = await customRender(<EmptyNotice />);

  // Act: "홈으로 가기" 텍스트를 가진 요소를 클릭
  await user.click(screen.getByText('홈으로 가기'));

  // Assert: navigate 함수가 '/' 경로로 호출되었는지 확인
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
});
