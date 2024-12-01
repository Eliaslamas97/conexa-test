import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY, USER_REPOSITORY } from '@src/modules/users/symbols';
import { IUserRepository } from '@src/modules/users/domain/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { IRoleRepository } from '@src/modules/users/domain/repositories/role.repository';
import { IUser } from '@src/modules/users/domain/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async create(registerDto: RegisterDto): Promise<IUser> {
    const newUser = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 1,
      ...registerDto,
    };
    return await this.userRepository.create(newUser);
  }

  async findById(id: string): Promise<IUser> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userRepository.findByEmail(email);
  }

  async changeRole(id: string, roleId: number): Promise<IUser> {
    const role = await this.roleRepository.getById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return await this.userRepository.changeRole(id, role.id);
  }
}
