import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { TokenResponseDto } from '../../application/dtos/token-response.dto';


// Este controller es el encargado de manejar las peticiones relacionadas con la autenticación
// y la autorización de los usuarios. Utiliza el AuthService para realizar las operaciones necesarias.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    /**
     * Endpoint para iniciar sesión.
     * Recibe las credenciales del usuario y devuelve un token de acceso.
     */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }
}