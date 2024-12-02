import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly roleId: number;
}
