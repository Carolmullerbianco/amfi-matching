import jwt from 'jsonwebtoken';
import { User } from '../types';

export const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};