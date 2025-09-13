import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { TokenPayload, User } from '../types';

interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const validateAmfiEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!UserModel.isValidAmfiEmail(email)) {
    return res.status(403).json({ 
      error: 'Acesso restrito a emails @amfi.finance ou carolmullerbianco@gmail.com' 
    });
  }

  next();
};