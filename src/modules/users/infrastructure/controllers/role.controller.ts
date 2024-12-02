import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { RoleService } from '@src/modules/users/application/services/role.service';
import { Roles } from '@src/decorators/role.decorator';
import { RolesGuard } from '@src/guards/role.guard';

@ApiTags('Role')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles(1)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'List all roles' })
  async listRoles() {
    return await this.roleService.list();
  }

  @Post(':name')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Create a new role' })
  async createRole(@Param('name') name: string) {
    console.log('name', name);
    return await this.roleService.create(name);
  }
}
