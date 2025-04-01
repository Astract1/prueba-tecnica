# 1. Resumen General

Se siguió la estructura dada del proyecto, que es un sistema de gestión de usuarios con autenticación de JWT, utilizando NestJS como framework principal y siguiendo los principios de la arquitectura hexagonal y CQRS.

# 2. El proyecto tenía como objetivo

- Implementar autenticación mediante JWT.
- Aplicar los conceptos de arquitectura Hexagonal.
- Utilizar TypeORM para la persistencia de los datos.

# 3. Estructura Final del Proyecto

```bash
src/
├── config/                              # Configuraciones globales
│   ├── database.config.ts               # Configuración de la base de datos
│   ├── jwt.config.ts                    # Configuración de JWT
│   └── email.config.ts                  # Configuración de notificaciones por email
│
├── modules/                             # Módulos de la aplicación
│   ├── auth/                            # Módulo de autenticación
│   │   ├── application/                 # Capa de aplicación
│   │   │   ├── dtos/                    # Data Transfer Objects
│   │   │   └── services/                # Servicios de la aplicación
│   │   ├── infrastructure/              # Capa de infraestructura
│   │   │   ├── adapters/                # Implementaciones concretas
│   │   │   ├── controllers/             # Controladores REST
│   │   │   └── guards/                  # Guards de NestJS
│   │   └── auth.module.ts               # Definición del módulo
│   │
│   └── users/                           # Módulo de usuarios
│       ├── application/                 # Capa de aplicación
│       │   ├── commands/                # Comandos CQRS
│       │   ├── dtos/                    # Data Transfer Objects
│       │   ├── ports/                   # Interfaces (puertos)
│       │   └── queries/                 # Consultas CQRS
│       ├── domain/                      # Capa de dominio
│       │   ├── entities/                # Entidades de dominio
│       │   └── events/                  # Eventos de dominio
│       ├── infrastructure/              # Capa de infraestructura
│       │   ├── adapters/                # Implementaciones concretas
│       │   └── controllers/             # Controladores REST
│       └── users.module.ts              # Definición del módulo
│
├── app.module.ts                        # Módulo principal de la aplicación
└── main.ts                              # Punto de entrada de la aplicación
```


# 3. Componentes del Sistema

## 3.1 Modulo de Usuarios 

La entidad User encapsula el compartamiento y las reglas del negocio

### Dominio User

```typescript
export class User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {...}) {...}

  update(params: Partial<...>) {...}
  
  deactivate() {...}
  
  activate() {...}
  
  get fullName(): string {...}
  
  validate(): void {...}
  
  clone(): User {...}
}
```


### Puertos


`UserRepositoryPort:` Define las operaciones para la persistencia a los usuarios


```typescript
export interface UserRepositoryPort {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

`NotificationPort:` Define las operaciones de notificación


```typescript
export interface NotificationPort {
  sendUserCreatedNotification(user: User): Promise<void>;
  sendUserUpdatedNotification(user: User): Promise<void>;
}
```

## Adapatadores 

`TypeOrmUserRepository:` Implementa *UserRepositoryPort* usando TypeORM

```typescript
@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepository: Repository<UserTypeormEntity>,
  ) {}

 //....
}
```

`ConsoleNotificationService:` Implementa *NotificationPort* la unica función del mismo es enviar notificaciones a la consola imitando un servicio de correo

```typescript
@Injectable()
export class ConsoleNotificationService implements NotificationPort {
  // Implementación de métodos...
}
```

## Comandos y Consultas (CQRS)

1. **CreateUserCommand:** Crea un nuevo Usuario
2. **UpdateUserCommand:** Actualiza un usuario existente
3. **DeleteUserCommand:** Elimina un usuario




# 3.2 Modulos de Autenticación

## Servicio de Autenticación

```typescript
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {...}
  
  async login(loginDto: LoginDto): Promise<TokenResponseDto> {...}
}
```


## Estrategia JWT


```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```


# 4. Diagrama de la Arquitectura

```mermaid
classDiagram
    %% Dominio
    namespace Domain {
        class User {
            +string id
            +string email
            +string password
            +string firstName
            +string lastName
            +boolean isActive
            +Date createdAt
            +Date updatedAt
            +update(params)
            +deactivate()
            +activate()
            +getFullName()
            +validate()
        }

        class UserCreatedEvent {
            +string userId
        }
    }
    
    %% Aplicación - Puertos
    namespace Application.Ports {
        class UserRepositoryPort {
            <>
            +findAll() Promise~User[]~
            +findById(id) Promise~User~
            +findByEmail(email) Promise~User~
            +create(user) Promise~User~
            +update(user) Promise~User~
            +delete(id) Promise~void~
        }
        
        class NotificationPort {
            <>
            +sendUserCreatedNotification(user) Promise~void~
            +sendUserUpdatedNotification(user) Promise~void~
        }
    }
    
    %% Aplicación - Comandos
    namespace Application.Commands {
        class CreateUserCommand {
            +CreateUserDto createUserDto
        }
        
        class UpdateUserCommand {
            +string id
            +UpdateUserDto updateUserDto
        }
        
        class DeleteUserCommand {
            +string id
        }
        
        class CreateUserHandler {
            +execute(command) Promise~User~
        }
        
        class UpdateUserHandler {
            +execute(command) Promise~User~
        }
        
        class DeleteUserHandler {
            +execute(command) Promise~void~
        }
    }
    
    %% Aplicación - Consultas
    namespace Application.Queries {
        class GetUserQuery {
            +string id
        }
        
        class GetUsersQuery {
        }
        
        class GetUserHandler {
            +execute(query) Promise~User~
        }
        
        class GetUsersHandler {
            +execute(query) Promise~User[]~
        }
    }
    
    %% Infraestructura - Adaptadores
    namespace Infrastructure.Adapters {
        class TypeOrmUserRepository {
            +findAll() Promise~User[]~
            +findById(id) Promise~User~
            +findByEmail(email) Promise~User~
            +create(user) Promise~User~
            +update(user) Promise~User~
            +delete(id) Promise~void~
            -toDomain(entity) User
            -toEntity(user) UserTypeormEntity
        }
        
        class UserTypeormEntity {
            +string id
            +string email
            +string password
            +string firstName
            +string lastName
            +boolean isActive
            +Date createdAt
            +Date updatedAt
        }
        
        class ConsoleNotificationService {
            +sendUserCreatedNotification(user) Promise~void~
            +sendUserUpdatedNotification(user) Promise~void~
        }
    }
    
    %% Infraestructura - Controladores
    namespace Infrastructure.Controllers {
        class UserController {
            +create(createUserDto) Promise~UserResponseDto~
            +findAll() Promise~UserResponseDto[]~
            +findOne(id) Promise~UserResponseDto~
            +update(id, updateUserDto) Promise~UserResponseDto~
            +remove(id) Promise~void~
        }
    }
    
    %% Relaciones
    UserRepositoryPort  CreateUserCommand : usa
    UserController --> UpdateUserCommand : usa
    UserController --> DeleteUserCommand : usa
    UserController --> GetUserQuery : usa
    UserController --> GetUsersQuery : usa
    
    CreateUserHandler --> UserRepositoryPort : usa
    CreateUserHandler --> NotificationPort : usa
    UpdateUserHandler --> UserRepositoryPort : usa
    UpdateUserHandler --> NotificationPort : usa
    DeleteUserHandler --> UserRepositoryPort : usa
    
    GetUserHandler --> UserRepositoryPort : usa
    GetUsersHandler --> UserRepositoryPort : usa
    
    CreateUserHandler --> User : crea
    UpdateUserHandler --> User : actualiza
    
    UserCreatedEvent  UserTypeormEntity : utiliza
    TypeOrmUserRepository --> User : traduce a/desde
```


# Api Endpoints.


## 5.1 Autenticación 

*Login* 

```bash

POST /auth/login

```


*Solicitud* 

```json

{
  "email": "user@example.com",
  "password": "password123"
}

```

*Respuesta* 

```json

{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```



## 5.2 Usuarios

*Crear Usuario* 

```bash

POST /users

```

*Solicitud* 

```json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Nombre",
  "lastName": "Apellido"
}

```

*Respuesta* 

```json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "isActive": true,
  "createdAt": "2023-04-01T12:00:00.000Z",
  "updatedAt": "2023-04-01T12:00:00.000Z"
}

```


*Obtener todos los Usuarios* 

```bash

GET /users

```

*Encabezados*

```bash

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

*Solictiud*

```json

{
  "firstName": "Nombre",
  "lastName": "Apellido"
}
```

*Respuesta* 

```json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "isActive": true,
  "createdAt": "2023-04-01T12:00:00.000Z",
  "updatedAt": "2023-04-01T13:00:00.000Z"
}

```

## Eliminar Usuarios

```bash

DELETE /users/:id

```

*Cabezara* 

```bash

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

*Respuesta* 


```bash

204 No Content

```



# 6. Guia de implementación

## 6.1 Requisitos

| Nombre | Version | 
|------|----------------|
| Node.js | >=  14.x| 
| PostgreSQL |--|
| npm o yarm | -- | 



## 6.2 Configuración del entorno

Se crea el archivo .env (ejemplo de archivo .env-example en el proyecto)


```sql

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_management

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Email
EMAIL_FROM=noreply@example.com

```


## 6.3 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en modo producción
npm run start:prod

```
