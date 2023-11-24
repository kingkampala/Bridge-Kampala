import { injectable } from 'inversify';
import { User } from '../models/schema';
import bcrypt from 'bcrypt';

@injectable()
export class UserService {
  async getAllUsers(options: any) {
    return User.findAll();
  }

  async getUserById(userId: number) {
    return User.findByPk(userId);
  }

  async createUser(userData: { name: string; email: string; password: string; userType: string }) {
    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.password = userData.password;
    user.userType = userData.userType;
    return user.save();
  }

  async updateUser(userId: number, userData: { name: string; email: string; password: string; userType: string }) {
    const user = await User.findByPk(userId);

    if (user) {
      if (userData.password) {
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        user.password = hashedPassword;
      }

      user.name = userData.name;
      user.email = userData.email;
      user.userType = userData.userType;

      await user.save();
      return user;
    }

    return null;
  }

  async deleteUser(userId: number) {
    const user = await User.findByPk(userId);

    if (user) {
      await user.remove();
    }
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new Error('invalid email or password');
  }

  async verifyEmail(userId: number): Promise<boolean> {
    const user = await User.findByPk(userId);

    if (user) {
      user.verified = true;
      await user.save();
      return true;
    }

    return false;
  }
}