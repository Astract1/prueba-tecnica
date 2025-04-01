import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepositoryPort, USER_REPOSITORY } from '../../../users/application/ports/user-repository.port';
import { LoginDto } from '../dtos/login.dto';
import { TokenResponseDto } from '../dtos/token-response.dto';


// Este servicio es el encargado de manejar la lógica de autenticación y autorización de los usuarios.
// Utiliza el UserRepositoryPort para interactuar con la base de datos y el JwtService para generar tokens JWT.

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  // Este método valida las credenciales del usuario.
  // Busca al usuario en la base de datos por su correo electrónico y compara la contraseña proporcionada con la almacenada.
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

    // Este método maneja el proceso de inicio de sesión.
    // Valida las credenciales del usuario y genera un token JWT si son válidas.
  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}