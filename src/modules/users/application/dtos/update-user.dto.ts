import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

/**
 * DTO para la actualización de un usuario
 * Se usa para validar los datos de entrada al actualizar un usuario
 * Se usa para ver si los datos son válidos y si cumplen con las reglas de negocio
 */
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(8)
    password?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;
}