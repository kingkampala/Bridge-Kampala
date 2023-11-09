import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
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
    const newUser = await this.userService.createUser(req.body);
    res.status(201).json(newUser);
  }

  @httpPut('/:id')
  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = await this.userService.updateUser(userId, req.body);
    res.json(updatedUser);
  }

  @httpDelete('/:id')
  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    await this.userService.deleteUser(userId);
    res.sendStatus(204);
  }
}