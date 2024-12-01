import { IRole } from '@src/modules/users/domain/interfaces/role.interface';

export interface IRoleRepository {
  create(name: string): Promise<IRole>;
  getById(id: number): Promise<IRole>;
  list(): Promise<IRole[]>;
}
