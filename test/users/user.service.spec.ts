import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '@src/modules/users/domain/repositories/user.repository';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { IUser } from '@src/modules/users/domain/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '@src/modules/users/application/services/user.service';
import { ROLE_REPOSITORY, USER_REPOSITORY } from '@src/modules/users/symbols';
import { IRoleRepository } from '@src/modules/users/domain/repositories/role.repository';
import { IRole } from '@src/modules/users/domain/interfaces/role.interface';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: IUserRepository;
  let roleRepositoryMock: IRoleRepository;

  beforeEach(async () => {
    userRepositoryMock = {
      create: jest.fn() as jest.Mock<Promise<IUser>, [IUser]>,
      findById: jest.fn() as jest.Mock<Promise<IUser>, [string]>,
      findByEmail: jest.fn() as jest.Mock<Promise<IUser>, [string]>,
      changeRole: jest.fn() as jest.Mock<Promise<IUser>, [string, number]>,
    };
    roleRepositoryMock = {
      create: jest.fn() as jest.Mock<Promise<IRole>, [string]>,
      getById: jest.fn() as jest.Mock<Promise<IRole>, [number]>,
      list: jest.fn() as jest.Mock<Promise<IRole[]>, []>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY, useValue: userRepositoryMock },
        { provide: ROLE_REPOSITORY, useValue: roleRepositoryMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should successfully create a new user', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const expectedUser: IUser = {
        id: 'mock-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: 1,
        ...registerDto,
      };

      (userRepositoryMock.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await userService.create(registerDto);

      expect(result).toEqual(expectedUser);
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        roleId: 1,
        ...registerDto,
      });
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      (userRepositoryMock.create as jest.Mock).mockRejectedValue(
        new Error('Error creating user'),
      );

      await expect(userService.create(registerDto)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john.doe@example.com';
      const expectedUser: IUser = {
        id: 'mock-uuid',
        name: 'John Doe',
        email,
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: 1,
      };

      (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(
        expectedUser,
      );

      const result = await userService.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const email = 'john.doe@example.com';

      (userRepositoryMock.findByEmail as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(userService.findByEmail(email)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
  describe('modifyUserRole', () => {
    it('should update the user role if role exists', async () => {
      const userId = 'mock-uuid';
      const roleId = 1;
      const existingRole = { id: roleId, name: 'admin' }; // Simulando un rol existente
      const updatedUser: IUser = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId,
      };

      (roleRepositoryMock.getById as jest.Mock).mockResolvedValue(existingRole);
      (userRepositoryMock.changeRole as jest.Mock).mockResolvedValue(
        updatedUser,
      );

      const result = await userService.modifyUserRole(userId, roleId);

      expect(result).toEqual(updatedUser);
      expect(roleRepositoryMock.getById).toHaveBeenCalledWith(roleId);
      expect(userRepositoryMock.changeRole).toHaveBeenCalledWith(
        userId,
        existingRole.id,
      );
    });

    it('should throw an InternalServerErrorException if any other error occurs', async () => {
      const userId = 'mock-uuid';
      const roleId = 1;

      (roleRepositoryMock.getById as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        userService.modifyUserRole(userId, roleId),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
