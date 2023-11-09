import { injectable } from 'inversify';
import { User } from '../models/schema';

@injectable()
export class UserService {
  async getAllUsers() {
    return User.findAll();
  }

  async getUserById(userId: number) {
    return User.findByPk(userId);
  }

  async createUser(userData: any) {
    return User.create(userData);
  }

  async updateUser(userId: number, userData: any) {
    await User.update(userData, { where: { id: userId } });
    return User.findByPk(userId);
  }

  async deleteUser(userId: number) {
    await User.destroy({ where: { id: userId } });
  }
}