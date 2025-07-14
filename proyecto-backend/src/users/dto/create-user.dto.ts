import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UserPosition } from '../entities/user-position.enum';
import { UserRole } from '../entities/user-role.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsBoolean()
  active?: boolean;
  @IsOptional()
  @IsString()
  photoUrl?: string;
  @IsEmail()
  email: string;
  @IsString()
  ci: string;
  @IsEnum(UserPosition)
  position: UserPosition;
  @IsEnum(UserRole)
  role: UserRole;
  @IsString()
  building: string;
}
