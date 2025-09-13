import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../utils/jwt';
import { LoginRequest } from '../types';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      if (!UserModel.isValidAmfiEmail(email)) {
        return res.status(403).json({ 
          error: 'Acesso restrito a emails @amfi.finance ou carolmullerbianco@gmail.com' 
        });
      }

      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isPasswordValid = await UserModel.verifyPassword(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = generateToken(user);

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
      }

      if (!UserModel.isValidAmfiEmail(email)) {
        return res.status(403).json({ 
          error: 'Acesso restrito a emails @amfi.finance ou carolmullerbianco@gmail.com' 
        });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      const user = await UserModel.create(email, password, name);
      const token = generateToken(user);

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async me(req: any, res: Response) {
    try {
      const userResponse = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        created_at: req.user.created_at,
        updated_at: req.user.updated_at,
      };

      res.json({ user: userResponse });
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}