import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


//Este archivo define la estrategia de autenticación JWT para el módulo de autenticación de NestJS.
// Utiliza la biblioteca passport-jwt para extraer y verificar el token JWT de las solicitudes entrantes.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  // Este método se llama cuando el token JWT es verificado con éxito.
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}