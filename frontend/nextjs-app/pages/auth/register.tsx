import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm } from '../../components/AuthForm';

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState(null);

  const handleRegister = async (email, password) => {
    try {
      await register(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <AuthForm onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;
