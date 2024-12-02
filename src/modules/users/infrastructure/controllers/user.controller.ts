import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { UserService } from '@src/modules/users/application/services/user.service';
import { Roles } from '@src/decorators/role.decorator';
import { RolesGuard } from '@src/guards/role.guard';
import { ModifyRoleDto } from '@src/modules/users/domain/dtos/modify-role.dto';

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(1)
  @UseGuards(RolesGuard)
  @Patch('modify-role')
  @ApiOperation({ summary: 'Modify User Role' })
  async modifyUserRole(@Body() modifyRoleDto: ModifyRoleDto) {
    return await this.userService.modifyUserRole(
      modifyRoleDto.id,
      modifyRoleDto.roleId,
    );
  }
}
