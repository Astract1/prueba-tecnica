import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


/**
 * DTO para la creación de un usuario
 * Se usa para validar los datos de entrada al crar un usuario
 * Se usa para ver si los datos son válidos y si cumplen con las reglas de negocio
 */
export class CreateUserDto {
    @IsEmail()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}