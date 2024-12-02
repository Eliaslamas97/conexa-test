import { IUserRepository } from '@src/modules/users/domain/repositories/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { IUser } from '@src/modules/users/domain/interfaces/user.interface';
import { validate } from 'class-validator';
import { set } from 'lodash';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userTable: Repository<UserEntity>,
  ) {}

  async create(user: IUser): Promise<IUser> {
    const userEntity = this._userTable.create(user);
    const errors = await validate(userEntity);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    await this._userTable.save(userEntity);
    return userEntity;
  }

  async findById(id: string): Promise<IUser> {
    return await this._userTable.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this._userTable.findOne({
      where: { email },
    });
  }

  async changeRole(id: string, role: number): Promise<IUser> {
    const user = await this._userTable.findOne({
      where: { id },
    });

    set(user, 'roleId', role);
    await this._userTable.save(user);

    return user;
  }
}
