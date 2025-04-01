import { registerAs } from "@nestjs/config";


/**
 * Configuración para el servicio de JWT.
 * Utiliza las variables de entorno para la configuración.
 * Esto permite cambiar la configuración sin modificar el código fuente.
 */

export default registerAs("jwt", () => ({
    secret: process.env.JWT_SECRET || 'supersecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
}));
