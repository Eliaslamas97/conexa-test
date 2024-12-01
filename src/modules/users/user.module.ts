import { Module } from '@nestjs/common';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { ROLE_REPOSITORY, USER_REPOSITORY } from '@src/modules/users/symbols';
import { UserRepository } from '@src/modules/users/infrastructure/repositories/typeorm/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '@src/modules/users/domain/entities/role.entity';
import { UserService } from '@src/modules/users/application/services/user.service';
import { RoleRepository } from '@src/modules/users/infrastructure/repositories/typeorm/role.repository';

@Module({
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    UserService,
  ],
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  exports: [UserService],
})
export class UserModule {}
