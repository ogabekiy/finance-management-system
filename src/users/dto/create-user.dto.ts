import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 32, { message: 'Password must be between 5 and 32 characters long' })
    password: string;

    @IsOptional()
    @IsString()
    profile_image_url?: string;

    @IsOptional()
    @IsString()
    role: string;
}
