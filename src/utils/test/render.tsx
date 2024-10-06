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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const customRender = (
  component: ReactElement,
  options: RenderOptions = {}
): CustomRenderResult => {
  const { routerProps } = options;
  const user = userEvent.setup();

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{component}</MemoryRouter>
    </QueryClientProvider>
  );

  return {
    user,
    ...renderResult,
  };
};

export default customRender;
