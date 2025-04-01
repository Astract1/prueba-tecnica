1. Para el proyecto se uso una Estructura de Carpetas, que cumpliera con la arquitectura hexagonal, aqui podemos ver un ejemplo

```
 src/
└── modules/
    └── users/
        ├── domain/                  # Capa de dominio
        │   ├── entities/            # Entidades de dominio
        │   ├── events/              # Eventos de dominio
        │   └── value-objects/       # Objetos de valor
        │
        ├── application/             # Capa de aplicación
        │   ├── ports/               # Interfaces (puertos)
        │   │   ├── in/              # Puertos de entrada
        │   │   └── out/             # Puertos de salida
        │   ├── services/            # Servicios de aplicación
        │   ├── commands/            # Comandos CQRS (opcional)
        │   └── queries/             # Consultas CQRS (opcional)
        │
        └── infrastructure/          # Capa de infraestructura
            ├── adapters/            # Implementaciones de adaptadores
            │   ├── in/              # Adaptadores de entrada
            │   └── out/             # Adaptadores de salida
            ├── controllers/         # Controladores REST
            └── repositories/        # Implementaciones de repositorios

```

Donde se separa cada modulo dependiendo de su capa y funcionalidades dentro del sistema