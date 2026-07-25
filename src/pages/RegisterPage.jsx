import { RegisterWizard } from '@/features/identity';

function RegisterPage() {
  return (
    <div className="min-h-screen bg-brand-light py-12 px-4 flex flex-col justify-center items-center font-sans antialiased">
      <RegisterWizard />
    </div>
  );
}

export default RegisterPage;