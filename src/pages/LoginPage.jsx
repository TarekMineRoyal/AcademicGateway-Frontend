import { LoginForm } from '@/features/identity';

function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-brand-light p-4">
      <LoginForm />
    </div>
  );
}

export default LoginPage;