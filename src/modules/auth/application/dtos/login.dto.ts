import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Login DTO
 * Esta clase es utilizada para validar los datos de entrada del login
 * es el verificador de la entrada de datos para el login.
    * Este contine las propiedades email y password.
    * La propiedad email debe ser una dirección de correo electrónico válida.
    * La propiedad password debe ser una cadena no vacía.
 */


export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}