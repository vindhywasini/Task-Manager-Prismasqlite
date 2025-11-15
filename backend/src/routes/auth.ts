import express from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcrypt';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const existing = await prisma.user.findUnique({ where: { email }});
    if(existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name }});
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const user = await prisma.user.findUnique({ where: { email }});
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const access = signAccess({ userId: user.id });
    const refresh = signRefresh({ userId: user.id });
    // set HttpOnly cookie for refresh token
    res.cookie('refreshToken', refresh, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
    return res.json({ accessToken: access });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if(!token) return res.status(401).json({ error: 'Missing refresh token' });
  try {
    const payload = verifyRefresh(token) as any;
    const access = signAccess({ userId: payload.userId });
    return res.json({ accessToken: access });
  } catch(e){
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ ok: true });
});

export default router;
