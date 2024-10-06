import { screen } from '@testing-library/react';

import { NotFoundPage } from '@/pages/error/components/NotFoundPage';
import render from '@/utils/test/render';
import { navigateFn } from '@/utils/test/setupTests';

it('Home으로 이동 버튼 클릭시 홈 경로로 이동하는 navigate가 실행된다', async () => {
  // Arrange: NotFoundPage 컴포넌트를 렌더링
  const { user } = await render(<NotFoundPage />);

  // Act: "Home으로 이동" 버튼을 클릭
  const button = await screen.getByRole('button', { name: 'Home으로 이동' });
  await user.click(button);

  // Assert: navigate 함수가 '/' 경로와 { replace: true } 옵션으로 호출되었는지 확인
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/', { replace: true });
});
