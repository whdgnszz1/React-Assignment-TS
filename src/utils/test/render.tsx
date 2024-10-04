import { render, RenderResult } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ReactElement } from 'react';

export default async function customRender(
  component: ReactElement
): Promise<{ user: UserEvent } & RenderResult> {
  const user = userEvent.setup();

  return {
    user,
    ...render(component),
  };
}
