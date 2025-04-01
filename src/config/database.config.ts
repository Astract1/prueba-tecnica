import { registerAs } from "@nestjs/config";


/**
 * * Configuración de la base de datos
 * Utiliza TypeORM para conectarse a una base de datos PostgreSQL.
 * La configuración se obtiene de las variables de entorno o se establece un valor predeterminado.
 * 
 */

export default registerAs("database", () => ({
    type:'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'Juan',
    password: process.env.DB_PASSWORD || 'Admin',
    database: process.env.DB_NAME || 'user_management',
    entities: ['dist/**/*.typeorm-entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
}));