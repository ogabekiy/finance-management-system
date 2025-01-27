import {  IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsOptional()
    @IsNumber()
    user_id:number

    @IsNotEmpty()
    @IsNumber()
    category_id:number

    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsString()
    @IsNotEmpty()
    description: string

    // @IsNotEmpty()
    @IsOptional()
    @IsDateString()
    transaction_date: string

}
