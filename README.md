### Sistema de Gestión de Usuarios con Autenticación JWT

Es la implementación de API RESTful con el Framework NestJs, usando la arquitectura hexagonal y el patron CQRS para serparar las operaciones de lectura y escritura

### 📋 Descrición general

El proyecto implemeta un sistema de gestión de usuarios con autenticación usando JWT (Json Web Token), con los principios de la arquitectura hexagonal y el patron CQRS.

### 🎯 Objetivos del proyecto

* Implementa Autenticación mediante JWT
* Aplicar los conceptos de la arquitectura Hexagonal
* Utilizar el patron CQRS para separar las operaciones de lectura y escritura
* Implementación del CRUD
* Utlización de TypeORM para la persistencia de datos

### 🏗️ Arquitectura

El proyecto esta estructurado con la Arquitectura Hexagonal

#### Capas Principales

* ***Domain (Dominio)***: Contiene las entidades del negocio y reglas de dominio
* ***Applitcation (Aplicación)***: Contiene los casos de uso de la aplicación ya sean comandos, consultas y puertos
* ***Infrastructure (Infraestructura)***: Contiene los adaptadores,controladores y servicios externos

 ### Diagrama de la arquitectura C4

 #### Nivel 1: Diagrama de contexto

 ```mermaid
C4Context
    title Sistema de Gestión de Usuarios - Diagrama de Contexto
        
    Person(user, "Usuario", "Usuario del sistema que administra las cuentas")
    System(userManagement, "Sistema de Gestión de Usuarios", "Proporciona funcionalidad para gestionar usuarios y autenticación")
    System_Ext(database, "Base de Datos PostgreSQL", "Almacena usuarios y datos de la aplicación")
        
    Rel_D(user, userManagement, "Utiliza", "HTTP/REST")
    Rel_D(userManagement, database, "Lee y escribe datos", "SQL/TypeORM")
        
    UpdateRelStyle(user, userManagement, $textPosition="middle", $lineStyle="solid")
    UpdateRelStyle(userManagement, database, $textPosition="middle", $lineStyle="solid")
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

 ```

#### Nivel 2: Diagrama de Contenedores

```mermaid
C4Container
    title Sistema de Gestión de Usuarios - Diagrama de Contenedores
    
    Person(user, "Usuario", "Usuario del sistema que administra las cuentas")
    
    Container_Boundary(api, "API de Gestión de Usuarios") {
        Container(apiApp, "API NestJS", "TypeScript, NestJS", "Proporciona funcionalidad de gestión de usuarios y autenticación mediante REST API")
        Container(auth, "Servicio de Autenticación", "JWT", "Maneja la autenticación y autorización de usuarios mediante tokens JWT")
    }
    
    System_Ext(database, "Base de Datos PostgreSQL", "Almacena usuarios y datos de la aplicación")
    
    Rel(user, apiApp, "Utiliza", "HTTP/REST")
    Rel(apiApp, auth, "Autentica y autoriza", "JWT")
    Rel(apiApp, database, "Lee y escribe datos", "SQL/TypeORM")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

```

#### Diagrama nivel 3: Diagrama de Componentes

```mermaid
C4Component
    title Sistema de Gestión de Usuarios - Diagrama de Componentes (Simplificado)
    
    Container(database, "Base de Datos", "PostgreSQL", "Almacena usuarios")
    
    Container_Boundary(api, "API NestJS") {
        Component(controllers, "Controllers", "NestJS REST", "Endpoints para usuarios y autenticación")
        
        Boundary(application, "Aplicación") {
            Component(cqrs, "CQRS", "Command/Query Bus", "Gestiona comandos y consultas")
            Component(ports, "Puertos", "Interfaces", "Contratos para servicios externos")
        }
        
        Boundary(domain, "Dominio") {
            Component(entities, "Entidades", "User", "Modelos de dominio con reglas de negocio")
        }
        
        Boundary(infra, "Infraestructura") {
            Component(repo, "Repositorios", "TypeORM", "Implementaciones de acceso a datos")
            Component(services, "Servicios", "Notificación/Auth", "Implementaciones de servicios")
        }
    }
    
    Rel(controllers, cqrs, "Usa")
    Rel(cqrs, entities, "Manipula")
    Rel(cqrs, ports, "Usa")
    Rel(ports, repo, "Implementado por")
    Rel(ports, services, "Implementado por")
    Rel(repo, database, "Accede")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

```

#### Arquitectura Hexagonal

```mermaid
graph TD
    subgraph "Adaptadores Primarios (UI)"
        REST["REST Controllers"]
    end
    
    subgraph "Aplicación"
        CommandBus["Command Bus"]
        QueryBus["Query Bus"]
        
        subgraph "Use Cases"
            CreateUser["CreateUserHandler"]
            UpdateUser["UpdateUserHandler"]
            DeleteUser["DeleteUserHandler"]
            GetUser["GetUserHandler"]
        end
        
        subgraph "Puertos"
            RP["UserRepositoryPort"]
            NP["NotificationPort"]
        end
    end
    
    subgraph "Dominio"
        User["User Entity"]
        Events["Domain Events"]
    end
    
    subgraph "Adaptadores Secundarios (Infraestructura)"
        TypeORM["TypeOrmUserRepository"]
        Console["ConsoleNotificationService"]
        DB[(PostgreSQL)]
    end
    
    %% Conexiones
    REST --> |solicita| CommandBus & QueryBus
    CommandBus --> |ejecuta| CreateUser & UpdateUser & DeleteUser
    QueryBus --> |ejecuta| GetUser
    
    CreateUser & UpdateUser & DeleteUser & GetUser --> |usa| RP
    CreateUser & UpdateUser --> |usa| NP
    
    CreateUser & UpdateUser & DeleteUser --> |maneja| User
    CreateUser --> |publica| Events
    
    RP -.-> |implementado por| TypeORM
    NP -.-> |implementado por| Console
    
    TypeORM --> |accede a| DB
    
    %% Estilo
    classDef primary fill:#f9f,stroke:#333,stroke-width:2px;
    classDef application fill:#bbf,stroke:#333,stroke-width:2px;
    classDef domain fill:#bfb,stroke:#333,stroke-width:2px;
    classDef secondary fill:#ffb,stroke:#333,stroke-width:2px;
    classDef database fill:#bbb,stroke:#333,stroke-width:2px;
    
    class REST primary;
    class CommandBus,QueryBus,CreateUser,UpdateUser,DeleteUser,GetUser,RP,NP application;
    class User,Events domain;
    class TypeORM,Console secondary;
    class DB database;
```

# 📂 Estructura del Proyecto

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

# Componentes Principales

### Dominio User

La entidad ```User``` encapsula el compartamiento y las reglas del negocio

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




#  Modulos de Autenticación

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

# Api Endpoints.

## Autenticación 

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



# 6 Guia de implementación

## 6.1 Requisitos

| Nombre | Version | 
|------|----------------|
| Node.js | >=  14.x| 
| PostgreSQL |Cualquiera|
| npm o yarm | Ultima Versión | 



## Configuración del entorno

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


## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar docker para la base de datos
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=user_management -p 5432:5432 -d postgres



# Ejecutar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en modo producción
npm run start:prod

```

## Ejecución en Sistemas Windows 


### *Crear Usuario* 

```powershell



$body = @{
    email = "usuario@ejemplo.com"
    password = "contraseña123"
    firstName = "Nombre"
    lastName = "Apellido"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/users" -Method POST -ContentType "application/json" -Body $body

```

### *Iniciar Sesión* 

```powershell
$body = @{
    email = "usuario@ejemplo.com"
    password = "contraseña123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -ContentType "application/json" -Body $body

$global:token = $response.accessToken


Write-Host "Token obtenido: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
```

### *Listar Usuarios* 


***Nota**: Llegados a este punto debes estar logueado como indica el paso anterior para que los demas pasos funcionen correctamente.


```powershell

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:3000/users" -Method GET -Headers $headers

```

### *Obtener detalles de los usuarios* 


```powershell

# Configurar headers con el token de autenticación
$headers = @{
    "Authorization" = "Bearer $token"
}


$users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET -Headers $headers

# Mostrar los usuarios disponibles
Write-Host "Usuarios disponibles:" -ForegroundColor Cyan
$users | ForEach-Object {
    Write-Host "ID: $($_.id), Email: $($_.email)" -ForegroundColor Yellow
}

$userId = Read-Host "Ingresa el ID del usuario que deseas ver"

# Obtener detalles del usuario específico
try {
    $userDetails = Invoke-RestMethod -Uri "http://localhost:3000/users/$userId" -Method GET -Headers $headers
    
    # Mostrar detalles del usuario
    Write-Host "Detalles del usuario:" -ForegroundColor Green
    $userDetails | Format-List
}
catch {
    Write-Host "Error al obtener detalles del usuario:" -ForegroundColor Red
    Write-Host "Código de estado: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    Write-Host "Mensaje de error: $($_.Exception.Message)" -ForegroundColor Yellow
    

    $errorDetails = $_.ErrorDetails.Message
    if ($errorDetails) {
        Write-Host "Detalles del error: $errorDetails" -ForegroundColor Red
    }
}
```



### *Actualizar Usuarios* 

```powershell

# Configurar headers con el token de autenticación
$headers = @{
    "Authorization" = "Bearer $token"
}

# Listar usuarios para obtener los IDs disponibles
$users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET -Headers $headers

# Mostrar los usuarios disponibles
Write-Host "Usuarios disponibles:" -ForegroundColor Cyan
$users | ForEach-Object {
    Write-Host "ID: $($_.id), Email: $($_.email)" -ForegroundColor Yellow
}

# Solicitar el ID del usuario que quieres actualizar
do {
    $userId = Read-Host "Ingresa el ID del usuario que deseas actualizar"
    
    # Validar que el ID no esté vacío
    if ([string]::IsNullOrWhiteSpace($userId)) {
        Write-Host "El ID no puede estar vacío. Inténtalo de nuevo." -ForegroundColor Red
        continue
    }
    
    # Validar que el ID exista en la lista de usuarios
    $userExists = $users | Where-Object { $_.id -eq $userId }
    if ($userExists) {
        break
    }
    else {
        Write-Host "ID de usuario no válido. Inténtalo de nuevo." -ForegroundColor Red
    }
} while ($true)

# Definir los datos de actualización
$updateData = @{}

# Solicitar nuevos valores
$firstName = Read-Host "Nuevo nombre (deja en blanco para no cambiar)"
$lastName = Read-Host "Nuevo apellido (deja en blanco para no cambiar)"
$email = Read-Host "Nuevo email (deja en blanco para no cambiar)"
$password = Read-Host "Nueva contraseña (deja en blanco para no cambiar)"

# Agregar campos solo si no están vacíos
if ($firstName) { $updateData.firstName = $firstName }
if ($lastName) { $updateData.lastName = $lastName }
if ($email) { $updateData.email = $email }
if ($password) { 
    if ($password.Length -lt 8) {
        Write-Host "Error: La contraseña debe tener al menos 8 caracteres" -ForegroundColor Red
        return
    }
    $updateData.password = $password 
}

# Convertir a JSON
$updateBody = $updateData | ConvertTo-Json

# Mostrar lo que se va a enviar
Write-Host "Datos a enviar:" -ForegroundColor Cyan
$updateBody

# Actualizar usuario
try {
    $updatedUser = Invoke-RestMethod -Uri "http://localhost:3000/users/$userId" -Method PUT -Headers $headers -ContentType "application/json" -Body $updateBody
    
    Write-Host "Usuario actualizado exitosamente:" -ForegroundColor Green
    $updatedUser | Format-List
}
catch {
    Write-Host "Error al actualizar usuario:" -ForegroundColor Red
    
    # Imprimir detalles completos del error
    Write-Host "Excepción completa:" -ForegroundColor Yellow
    $_ | Format-List * -Force
    
    # Intentar extraer más detalles del error
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Cuerpo de la respuesta de error:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}

```


### *Eliminar Usuarios* 


```powershell
# Configurar headers con el token de autenticación
$headers = @{
    "Authorization" = "Bearer $token"
}

# Listar usuarios para obtener los IDs disponibles
$users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET -Headers $headers

# Mostrar los usuarios disponibles
Write-Host "Usuarios disponibles:" -ForegroundColor Cyan
$users | ForEach-Object {
    Write-Host "ID: $($_.id), Email: $($_.email)" -ForegroundColor Yellow
}

# Solicitar el ID del usuario que quieres eliminar
$userId = Read-Host "Ingresa el ID del usuario que deseas eliminar"

# Confirmar eliminación
$confirmacion = Read-Host "¿Estás seguro de que deseas eliminar el usuario $userId? (s/n)"

if ($confirmacion -eq "s") {
    try {
        # Eliminar usuario
        $response = Invoke-RestMethod -Uri "http://localhost:3000/users/$userId" -Method DELETE -Headers $headers
        
        Write-Host "Usuario eliminado exitosamente" -ForegroundColor Green
    }
    catch {
        Write-Host "Error al eliminar usuario:" -ForegroundColor Red
        Write-Host "Código de estado: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
        Write-Host "Mensaje de error: $($_.Exception.Message)" -ForegroundColor Yellow
        
        $errorDetails = $_.ErrorDetails.Message
        if ($errorDetails) {
            Write-Host "Detalles del error: $errorDetails" -ForegroundColor Red
        }
    }
}
else {
    Write-Host "Eliminación cancelada" -ForegroundColor Yellow
}

```



*Script General de Funcionamiento* 

**Nota** El codigo no tiene Verificaciones Implementadas

## 🧪 Probando la API
Se crea un archivo ejemplo ```user-management.ps1``` y copia el contenido del archivo PowerShell proporcionado y ejecútalo en tu terminal.

```powershell

# Configuracion
$baseUrl = "http://localhost:3000"
$token = $null
$currentUserId = $null

# Funcion para mostrar el menu principal
function Show-Menu {
    Clear-Host
    Write-Host "===== PRUEBA DE API DE GESTION DE USUARIOS =====" -ForegroundColor Cyan
    Write-Host
    Write-Host "Estado actual:" -ForegroundColor Yellow
    if ($token) {
        Write-Host " * Estado de autenticacion: Autenticado" -ForegroundColor Green
    } else {
        Write-Host " * Estado de autenticacion: No autenticado" -ForegroundColor Red
    }
    if ($currentUserId) {
        Write-Host " * ID de usuario seleccionado: $currentUserId" -ForegroundColor Green
    } else {
        Write-Host " * ID de usuario seleccionado: Ninguno" -ForegroundColor Red
    }
    Write-Host
    Write-Host "OPCIONES:"
    Write-Host "1. Crear usuario nuevo"
    Write-Host "2. Iniciar sesion (login)"
    Write-Host "3. Listar todos los usuarios"
    Write-Host "4. Ver detalles de un usuario"
    Write-Host "5. Actualizar usuario"
    Write-Host "6. Eliminar usuario"
    Write-Host "7. Seleccionar ID de usuario"
    Write-Host 
    Write-Host "0. Salir"
    Write-Host
}

# Funcion para crear un nuevo usuario
function Create-User {
    Write-Host "===== CREAR NUEVO USUARIO =====" -ForegroundColor Cyan
    
    $email = Read-Host "Email"
    $password = Read-Host "Password"
    $firstName = Read-Host "Nombre"
    $lastName = Read-Host "Apellido"
    
    $body = @{
        email = $email
        password = $password
        firstName = $firstName
        lastName = $lastName
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/users" -Method POST -ContentType "application/json" -Body $body
        $user = $response.Content | ConvertFrom-Json
        
        Write-Host "Usuario creado exitosamente!" -ForegroundColor Green
        Write-Host "ID: $($user.id)" -ForegroundColor Yellow
        Write-Host "Email: $($user.email)"
        Write-Host "Nombre: $($user.firstName) $($user.lastName)"
        Write-Host "Deseas seleccionar este usuario? (s/n)"
        $select = Read-Host
        if ($select -eq "s") {
            $script:currentUserId = $user.id
        }
    }
    catch {
        Write-Host "Error al crear usuario: $_" -ForegroundColor Red
        Write-Host $_.Exception.Response
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Funcion para iniciar sesion
function Login {
    Write-Host "===== INICIAR SESION =====" -ForegroundColor Cyan
    
    $email = Read-Host "Email"
    $password = Read-Host "Password"
    
    $body = @{
        email = $email
        password = $password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
        $result = $response.Content | ConvertFrom-Json
        $script:token = $result.accessToken
        
        Write-Host "Inicio de sesion exitoso!" -ForegroundColor Green
        Write-Host "Token JWT obtenido (primeros 20 caracteres): $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Yellow
    }
    catch {
        Write-Host "Error al iniciar sesion: $_" -ForegroundColor Red
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Funcion para listar todos los usuarios
function List-Users {
    Write-Host "===== LISTAR USUARIOS =====" -ForegroundColor Cyan
    
    if (-not $token) {
        Write-Host "Necesitas iniciar sesion primero (opcion 2)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-WebRequest -Uri "$baseUrl/users" -Method GET -Headers $headers
        $users = $response.Content | ConvertFrom-Json
        
        if ($users.Count -eq 0) {
            Write-Host "No hay usuarios registrados" -ForegroundColor Yellow
        }
        else {
            Write-Host "Usuarios encontrados: $($users.Count)" -ForegroundColor Green
            
            foreach ($user in $users) {
                Write-Host "----------------------------------------"
                Write-Host "ID: $($user.id)" -ForegroundColor Yellow
                Write-Host "Email: $($user.email)"
                Write-Host "Nombre: $($user.firstName) $($user.lastName)"
                Write-Host "Estado: $(if ($user.isActive) { 'Activo' } else { 'Inactivo' })"
                Write-Host "Creado: $($user.createdAt)"
                Write-Host "Seleccionar este usuario? (s/n)"
                $select = Read-Host
                if ($select -eq "s") {
                    $script:currentUserId = $user.id
                    Write-Host "Usuario seleccionado: $($script:currentUserId)" -ForegroundColor Green
                    break
                }
            }
        }
    }
    catch {
        Write-Host "Error al listar usuarios: $_" -ForegroundColor Red
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Funcion para ver detalles de un usuario
function Get-UserDetails {
    Write-Host "===== VER DETALLES DE USUARIO =====" -ForegroundColor Cyan
    
    if (-not $token) {
        Write-Host "Necesitas iniciar sesion primero (opcion 2)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    if (-not $currentUserId) {
        Write-Host "Necesitas seleccionar un usuario primero (opcion 7)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-WebRequest -Uri "$baseUrl/users/$currentUserId" -Method GET -Headers $headers
        $user = $response.Content | ConvertFrom-Json
        
        Write-Host "Detalles del usuario:" -ForegroundColor Green
        Write-Host "ID: $($user.id)" -ForegroundColor Yellow
        Write-Host "Email: $($user.email)"
        Write-Host "Nombre: $($user.firstName) $($user.lastName)"
        Write-Host "Estado: $(if ($user.isActive) { 'Activo' } else { 'Inactivo' })"
        Write-Host "Creado: $($user.createdAt)"
        Write-Host "Actualizado: $($user.updatedAt)"
    }
    catch {
        Write-Host "Error al obtener detalles del usuario: $_" -ForegroundColor Red
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Funcion para actualizar un usuario
function Update-UserInfo {
    Write-Host "===== ACTUALIZAR USUARIO =====" -ForegroundColor Cyan
    
    if (-not $token) {
        Write-Host "Necesitas iniciar sesion primero (opcion 2)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    if (-not $currentUserId) {
        Write-Host "Necesitas seleccionar un usuario primero (opcion 7)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    Write-Host "Deja en blanco los campos que no deseas modificar"
    $firstName = Read-Host "Nuevo nombre"
    $lastName = Read-Host "Nuevo apellido"
    $email = Read-Host "Nuevo email"
    $password = Read-Host "Nueva password"
    
    $body = @{}
    
    if ($firstName) { $body.firstName = $firstName }
    if ($lastName) { $body.lastName = $lastName }
    if ($email) { $body.email = $email }
    if ($password) { $body.password = $password }
    
    if ($body.Count -eq 0) {
        Write-Host "No se especificaron cambios" -ForegroundColor Yellow
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    $jsonBody = $body | ConvertTo-Json
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-WebRequest -Uri "$baseUrl/users/$currentUserId" -Method PUT -Headers $headers -ContentType "application/json" -Body $jsonBody
        $user = $response.Content | ConvertFrom-Json
        
        Write-Host "Usuario actualizado exitosamente!" -ForegroundColor Green
        Write-Host "ID: $($user.id)" -ForegroundColor Yellow
        Write-Host "Email: $($user.email)"
        Write-Host "Nombre: $($user.firstName) $($user.lastName)"
    }
    catch {
        Write-Host "Error al actualizar usuario: $_" -ForegroundColor Red
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Funcion para eliminar un usuario
function Remove-UserAccount {
    Write-Host "===== ELIMINAR USUARIO =====" -ForegroundColor Cyan
    
    if (-not $token) {
        Write-Host "Necesitas iniciar sesion primero (opcion 2)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    if (-not $currentUserId) {
        Write-Host "Necesitas seleccionar un usuario primero (opcion 7)" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    Write-Host "Estas seguro de que deseas eliminar el usuario con ID $currentUserId? (s/n)" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -ne "s") {
        Write-Host "Operacion cancelada" -ForegroundColor Yellow
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-WebRequest -Uri "$baseUrl/users/$currentUserId" -Method DELETE -Headers $headers
        
        Write-Host "Usuario eliminado exitosamente!" -ForegroundColor Green
        $script:currentUserId = $null
    }
    catch {
        Write-Host "Error al eliminar usuario: $_" -ForegroundColor Red
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Funcion para seleccionar ID de usuario manualmente
function Select-UserById {
    Write-Host "===== SELECCIONAR ID DE USUARIO =====" -ForegroundColor Cyan
    
    $id = Read-Host "Ingresa el ID del usuario"
    
    if ($id) {
        $script:currentUserId = $id
        Write-Host "ID de usuario seleccionado: $id" -ForegroundColor Green
    }
    else {
        Write-Host "No se selecciono ningun ID" -ForegroundColor Yellow
    }
    
    Read-Host "Presiona Enter para continuar"
}

# Bucle principal
$option = ""
while ($option -ne "0") {
    Show-Menu
    $option = Read-Host "Selecciona una opcion"
    
    switch ($option) {
        "1" { Create-User }
        "2" { Login }
        "3" { List-Users }
        "4" { Get-UserDetails }
        "5" { Update-UserInfo }
        "6" { Remove-UserAccount }
        "7" { Select-UserById }
        "0" { Write-Host "Hasta luego!" -ForegroundColor Cyan }
        default { 
            Write-Host "Opcion no valida, intenta de nuevo" -ForegroundColor Red
            Read-Host "Presiona Enter para continuar"
        }
    }
}
```
