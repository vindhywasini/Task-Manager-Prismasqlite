'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function submit(){
    const res = await axios.post('http://localhost:4000/auth/login', { email, password }, { withCredentials: true });
    localStorage.setItem('accessToken', res.data.accessToken);
    router.push('/');
  }

  return <div>
    <h2>Login</h2>
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    <input placeholder="Password" value={password} type="password" onChange={e=>setPassword(e.target.value)} />
    <button onClick={submit}>Login</button>
  </div>
}
