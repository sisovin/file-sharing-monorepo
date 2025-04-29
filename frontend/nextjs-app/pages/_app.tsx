import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/auth/login' && router.pathname !== '/auth/register') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return <Component {...pageProps} />;
}

export default MyApp;
