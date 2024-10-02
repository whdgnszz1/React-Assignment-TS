import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { EMAIL_PATTERN } from '@/constants';

import { useLogin } from '@/lib/auth';
import { useAuthStore } from '@/store/auth/useAuthStore';

import { Layout, authStatusType } from '@/pages/common/components/Layout';

interface FormInputs {
  email: string;
  password: string;
  form?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { setIsLogin, setUser } = useAuthStore();

  const { mutate: login, isPending: isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (userData) => {
          setIsLogin(true);
          setUser({
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName ?? '',
          });
          navigate(pageRoutes.main);
        },
        onError: (error: any) => {
          setError('form', {
            type: 'server',
            message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
          });
          console.error(
            '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.',
            error
          );
        },
      }
    );
  };

  const handleClickRegister = () => {
    navigate(pageRoutes.register);
  };

  return (
    <Layout authStatus={authStatusType.NEED_NOT_LOGIN}>
      <div className="w-full h-screen max-w-md mx-auto space-y-8 flex flex-col justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                placeholder="이메일을 입력하세요"
                {...register('email', {
                  required: '이메일을 입력하세요',
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: '이메일 양식이 올바르지 않습니다',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                placeholder="비밀번호를 입력하세요"
                {...register('password', {
                  required: '비밀번호를 입력하세요',
                })}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {errors.form && (
            <p className="text-sm text-red-500">{errors.form.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleClickRegister}
        >
          회원가입
        </Button>
      </div>
    </Layout>
  );
};
