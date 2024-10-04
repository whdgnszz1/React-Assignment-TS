import { screen } from '@testing-library/react';

import render from '@/utils/test/render';
import { navigateFn } from '@/utils/test/setupTests';
import { ErrorPage } from '../ErrorPage';

it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  // Arrange: ErrorPage 컴포넌트를 렌더링
  const { user } = await render(<ErrorPage />);

  // Act: "뒤로 이동" 버튼을 클릭
  const button = await screen.getByRole('button', { name: '뒤로 이동' });
  await user.click(button);

  // Assert: navigate 함수가 -1 인자로 호출되었는지 확인
  expect(navigateFn).toHaveBeenNthCalledWith(1, -1);
});
