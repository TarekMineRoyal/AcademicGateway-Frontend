import React from 'react';
import LoginForm from '../features/identity/components/LoginForm';

function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
      <LoginForm />
    </div>
  );
}

export default LoginPage;