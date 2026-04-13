import {
    IsString,
    IsOptional,
    IsEnum,
    IsMongoId,
    MinLength,
    Min,
} from "class-validator"
import {UserRole} from "../models/User"

export class CreateUserDto {
    @IsString({message: "Username must be a string"})
    @MinLength(3, {message: "Username must be at least 3 characters"})
    username!: string;

    @IsString({message: "Password must be a string"})
    @MinLength(6, {message: "Password must be at least 3 characters"})
    password!: string;

    @IsEnum(["EMPLOYEE", "MANAGER"], {message:"Role must be EMPLOYEE or MANAGER"})
    role!: UserRole;

    @IsMongoId({message: "nodeId must be a valid MongoDB ID"})
    nodeId!: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString({message: "Username must be a string"})
    @MinLength(3, {message: "Username must be at least 3 characters"})
    username?: string;

    @IsOptional()
    @IsString({message: "Password must be a string"})
    @MinLength(6, {message: "Password must be at least 3 characters"})
    password?: string;

    @IsOptional()
    @IsEnum(["EMPLOYEE", "MANAGER"], {message:"Role must be EMPLOYEE or MANAGER"})
    role?: UserRole;

    @IsOptional()
    @IsMongoId({message: "nodeId must be a valid MongoDB ID"})
    nodeId?: string;
}