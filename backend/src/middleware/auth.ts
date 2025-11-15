import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = verifyAccess(token) as any;
    req.user = { id: payload.userId };
    next();
  } catch(e){
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
