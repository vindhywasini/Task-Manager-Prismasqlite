'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  async function submit(){
    await axios.post('http://localhost:4000/auth/register', { email, password, name });
    router.push('/login');
  }

  return <div>
    <h2>Register</h2>
    <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    <input placeholder="Password" value={password} type="password" onChange={e=>setPassword(e.target.value)} />
    <button onClick={submit}>Register</button>
  </div>
}
