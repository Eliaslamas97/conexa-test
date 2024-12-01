import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@src/modules/users/domain/repositories/role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '@src/modules/users/domain/entities/role.entity';
import { IRole } from '@src/modules/users/domain/interfaces/role.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roleTable: Repository<RoleEntity>,
  ) {}

  async create(name: string): Promise<IRole> {
    const role = this._roleTable.create({ name });
    await this._roleTable.save(role);
    return role;
  }

  async getById(id: number): Promise<IRole> {
    return await this._roleTable.findOne({
      where: { id },
    });
  }

  async list(): Promise<IRole[]> {
    return await this._roleTable.find();
  }
}
