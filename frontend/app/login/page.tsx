'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ToastType = 'success' | 'error';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2800);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:4000/auth/login',
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem('accessToken', res.data.accessToken);
      showToast('success', 'Logged in successfully!');
      setTimeout(() => {
        router.push('/');
      }, 600);
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="auth-card">
        <h2 className="auth-title">Welcome back 👋</h2>
        <p className="auth-subtitle">
          Log in to continue tracking your goals and tasks.
        </p>

        <form className="auth-form" onSubmit={submit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input-field"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input-field"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer-link">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
