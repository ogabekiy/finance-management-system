import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNumber()
    @IsOptional()
    user_id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['expense', 'income'])
    type: string;
}
