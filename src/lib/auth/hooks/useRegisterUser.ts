import { useMutation } from '@tanstack/react-query';
import { RegisterUserReqDTO, UserDTO, registerUserAPI } from '..';

export const useRegisterUser = () => {
  return useMutation<UserDTO, Error, RegisterUserReqDTO>({
    mutationFn: registerUserAPI,
  });
};
