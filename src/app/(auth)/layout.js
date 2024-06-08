import '../globals.css';
import { logout } from '@/actions/auth';

export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function AuthLayout({ children }) {
  return (
    <>
      <header id='auth-header'>
        <p>Welcome Back</p>
        <form action={logout}>
          <button type='submit'>Log Out</button>
        </form>
      </header>
      {children}
    </>
  );
}
