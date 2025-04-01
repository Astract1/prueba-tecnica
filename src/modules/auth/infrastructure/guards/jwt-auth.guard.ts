import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


/**
 * Guard que protege las rutas que requieren autenticación utilizando JWT.
 * Extiende el guard de autenticación de Passport para JWT.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}