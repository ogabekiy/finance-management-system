import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth';

export class UpdateAuthDto extends PartialType(LoginAuthDto) {}
