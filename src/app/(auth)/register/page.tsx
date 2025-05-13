import RegistrationForm from '@/components/auth/RegistrationForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create your Nexus Alumni account.',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <RegistrationForm />
    </div>
  );
}
