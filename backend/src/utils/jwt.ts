import jwt from 'jsonwebtoken';
const AT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const RT_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
export function signAccess(payload: object){
  return jwt.sign(payload, AT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
}
export function signRefresh(payload: object){
  return jwt.sign(payload, RT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
}
export function verifyAccess(token: string){
  return jwt.verify(token, AT_SECRET);
}
export function verifyRefresh(token: string){
  return jwt.verify(token, RT_SECRET);
}
