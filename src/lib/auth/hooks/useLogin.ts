import { useMutation } from '@tanstack/react-query';
import { LoginRequestDto, LoginResponseDto, loginAPI } from '..';

export const useLogin = () => {
  return useMutation<LoginResponseDto, Error, LoginRequestDto>({
    mutationFn: loginAPI,
  });
};
