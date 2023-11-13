import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { UserService } from '../service/user';

@controller('/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
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
    try{
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @httpPut('/:id')
  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = await this.userService.updateUser(userId, req.body);

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }

  @httpDelete('/:id')
  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    await this.userService.deleteUser(userId);
    res.sendStatus(204);
  }

  @httpPost('/register')
  async registerUser(@requestBody() userData: { name: string; email: string; password: string; userType: string }, res: Response) {
    try {
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @httpPost('/login')
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.userService.authenticateUser(email, password);

    if (user) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  @httpGet('/verify/:id')
  async verifyEmail(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const isVerified = await this.userService.verifyEmail(userId);

    if (isVerified) {
      res.json({ message: 'Email verification successful' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }
}