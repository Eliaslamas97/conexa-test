import { IUser } from '@src/modules/users/domain/interfaces/user.interface';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  changeRole(id: string, roleId: number): Promise<IUser>;
}
