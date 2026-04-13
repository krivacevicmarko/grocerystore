import {IsString, MinLength} from "class-validator"

export class LoginDto {
    @IsString({ message: "Username must be a string"})
    @MinLength(1, {message: "Username cannot be empty"})
    username!: string;

    @IsString({message: "Password must be a string"})
    @MinLength(1,{message: "Password cannot be empty"})
    password!: string;
}