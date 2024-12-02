import { IRole } from '@src/modules/users/domain/interfaces/role.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '@src/modules/users/symbols';
import { IRoleRepository } from '@src/modules/users/domain/repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async list(): Promise<IRole[]> {
    return await this.roleRepository.list();
  }

  async create(name: string): Promise<IRole> {
    try {
      return await this.roleRepository.create(name);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
