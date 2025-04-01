import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './infrastructure/adapters/jwt/jwt.strategy';
import { AuthController } from './infrastructure/controllers/auth.controller';


/**
 * Módulo de autenticación.
 * Proporciona servicios de autenticación y autorización utilizando JWT.
 */

@Module({
    imports: [
      UsersModule,
      PassportModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('jwt.secret'),
          signOptions: { expiresIn: configService.get('jwt.expiresIn') },
        }),
        inject: [ConfigService],
      }),
      ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}
  
