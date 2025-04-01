import { registerAs } from "@nestjs/config";

/**
 * Configuración para el servicio de email.
 * Actualmente utilizando solo la consola para pruebas.
 */

export default registerAs('email', () => ({
  provider: 'console',
  from: process.env.EMAIL_FROM || 'test@example.com',
}));