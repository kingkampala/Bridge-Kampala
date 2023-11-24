import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete, requestBody, response } from 'inversify-express-utils';
import { UniqueConstraintError } from 'sequelize';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { UserService } from '../service/user';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

@controller('/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  }

  @httpGet('/:id')
  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const user = await this.userService.getUserById(userId);
    res.json(user);
  }

  @httpPost('/')
  async createUser(req: Request, res: Response) {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({ message: 'user created successfully', newUser });
    } catch (error) {
      console.error(error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: 'user with this email already exists.' });
      }
      res.status(500).json({ error: 'internal server error' });
    }
  }

  @httpPut('/:id')
  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = await this.userService.updateUser(userId, req.body);

    if (updatedUser) {
      res.status(200).json({ message: 'user updated successfully', updatedUser });
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  }

  @httpDelete('/:id')
  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    await this.userService.deleteUser(userId);
    res.status(200).json({ message: 'user deleted successfully' });
  }

  @httpPost('/register')
  async registerUser(@requestBody() req: { name: string; email: string; password: string; userType: string }, @response() res: Response) {
    try {
      const { name, email, password, userType } = req;
      if (!name || !email || !password || !userType) {
        return res.status(401).json({ error: 'name, email, password and userType are required'})
      }

      const newUser = await this.userService.createUser(req);
      res.status(201).json({ message: 'user registered successfully', newUser });
    } catch (error) {
      console.error(error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: 'user with this email already exists.' });
      }
      res.status(500).json({ error: 'internal Server Error' });
    }
  }

  @httpPost('/login')
  async loginUser(@requestBody() req: { email: string; password: string }, @response() res: Response) {
    try {
      const { email, password } = req;
      if (!email || !password) {
        return res.status(401).json({ error: 'email and password are required'})
      }

      const user = await this.userService.authenticateUser(email, password);

      if (user) {
        const { id, userType } = user;

        const JwtKey = process.env.SECRET_KEY as Secret;

        const tokenPayload = {
          userId: id,
          userType: userType,
        };

        const token = jwt.sign({ tokenPayload }, JwtKey, { expiresIn: '1h', algorithm: 'HS256' });

        console.log('Generated Token:', token);

        res.status(200).json({ message: 'login successful', user, token });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'internal server error', details: (error as Error).message });
    }
  }

  @httpGet('/verify/:id')
  async verifyEmail(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const isVerified = await this.userService.verifyEmail(userId);

    if (isVerified) {
      res.json({ message: 'email verification successful' });
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  }
}