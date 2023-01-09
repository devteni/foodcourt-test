import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: string;
}
