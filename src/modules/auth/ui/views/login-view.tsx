'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface LoginProps {
  redirect?: string;
}

export const LoginView = ({ redirect }: LoginProps) => {
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={() => {
          if (redirect) {
            router.push(
              `/api/login/google?redirect=${encodeURIComponent(redirect)}`
            );
          } else {
            router.push(`/api/login/google`);
          }
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
};
