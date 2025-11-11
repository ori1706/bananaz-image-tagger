import { Request, Response, NextFunction } from 'express';
import { users } from './storage';

export interface AuthRequest extends Request {
  username?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const username = req.headers['x-user-name'] as string;

  if (!username) {
    return res.status(401).json({ error: 'Missing X-User-Name header' });
  }

  const user = users.find(u => u.name === username);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.username = username;
  next();
};

