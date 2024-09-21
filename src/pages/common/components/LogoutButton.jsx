import { Button } from '@/components/ui/button';
import React from 'react';

export const LogoutButton = ({ data, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-primary hover:text-primary-dark"
      onClick={onClick}
    >
      {data?.name || '로그아웃'}
    </Button>
  );
};
