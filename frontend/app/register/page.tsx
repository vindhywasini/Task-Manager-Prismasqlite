'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ToastType = 'success' | 'error';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
      await axios.post('http://localhost:4000/auth/register', {
        email,
        password,
        name,
      });
      showToast('success', 'Account created! You can log in now.');
      setTimeout(() => {
        router.push('/login');
      }, 600);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ?? 'Could not create account. Try again.';
      showToast('error', msg);
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
        <h2 className="auth-title">Create your account ✨</h2>
        <p className="auth-subtitle">
          Start tracking tasks and reach your goals faster.
        </p>

        <form className="auth-form" onSubmit={submit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">
              Name (optional)
            </label>
            <input
              id="name"
              className="input-field"
              placeholder="Alex Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Choose a strong password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
