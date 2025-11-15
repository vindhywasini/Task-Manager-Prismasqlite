'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('theme');
    const shouldBeDark = stored === 'dark';
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.body.classList.add('dark-mode');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      window.localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div id="app-container">
      <header>
        <div className="logo-area">
          <span className="logo-dot" />
          <h1>TrackToSuccess</h1>
        </div>

        <nav className="main-nav">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className={`nav-link ${pathname === '/login' ? 'active' : ''}`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`nav-link ${pathname === '/register' ? 'active' : ''}`}
          >
            Register
          </Link>
        </nav>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main id="content-container">{children}</main>

      <footer>
        <p>
          &copy; {new Date().getFullYear()} TrackToSuccess. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
