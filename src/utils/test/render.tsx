import { Toast } from '@/pages/common/components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ReactElement } from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

interface RenderOptions {
  routerProps?: MemoryRouterProps;
}

interface CustomRenderResult extends RenderResult {
  user: UserEvent;
}

/**
 * 커스텀 렌더 함수
 *
 * @param component - 렌더링할 React 컴포넌트
 * @param options - 추가 옵션 (예: 라우터 속성)
 * @returns 사용자 이벤트 객체와 렌더 결과를 포함한 객체
 */
const customRender = async (
  component: ReactElement,
  options: RenderOptions = {}
): Promise<CustomRenderResult> => {
  const { routerProps } = options;
  const user = userEvent.setup();

  const queryClient = new QueryClient();

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{component}</MemoryRouter>
      <Toast />
    </QueryClientProvider>
  );

  return {
    user,
    ...renderResult,
  };
};

export default customRender;
