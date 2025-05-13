import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your Nexus Alumni account.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
}
