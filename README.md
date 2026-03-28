# Task Manager

Aplicación full-stack para gestión de tareas con autenticación JWT.

## Características

- Registro y login de usuarios
- Recuperación de contraseña (tokens de reseteo con expiración)
- CRUD de tareas (protegido con JWT)
- Base de datos PostgreSQL con Prisma ORM
- Validación de datos con Zod
- Frontend con React + Vite
- Pruebas unitarias con Jest

## Tecnologías

### Backend
- Express.js
- Prisma + PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs
- Zod
- Nodemailer

### Frontend
- React 18
- Vite
- TypeScript

## Configuración

1. Copiar variables de entorno:
- cp .env.example .env 
- Editar el archivo `.env` con tus datos reales

2. Instalar dependencias del backend:
```bash
npm install
```

3. Generar cliente Prisma:
```bash
npx prisma generate
```

4. Ejecutar migraciones:
```bash
npx prisma migrate dev
```

5. Instalar dependencias del frontend:
```bash
npm run install:frontend
```

## Iniciar aplicación

### Desarrollo (Backend)
```bash
npm run dev
```

### Desarrollo (Frontend)
```bash
npm run dev:frontend
```

El frontend estará disponible en `http://localhost:5173` y se comunicará con el backend en `http://localhost:3000`.

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/register | Registrar usuario |
| POST | /auth/login | Iniciar sesión |
| POST | /auth/forgot-password | Solicitar reseteo de contraseña |
| POST | /auth/reset-password | Restablecer contraseña con token |
| GET | /tasks | Listar tareas (protegido) |
| POST | /tasks | Crear tarea (protegido) |
| PUT | /tasks/:id | Actualizar tarea (protegido) |
| DELETE | /tasks/:id | Eliminar tarea (protegido) |
| GET | /health | Verificar estado del servidor |

## Pruebas unitarias

Ejecutar pruebas:
```bash
npm test
```

Las pruebas cubren:
- **JWT**: Generación y verificación de tokens
- **Auth**: Hash de contraseñas, validación de datos, reseteo de contraseña
- **Tasks**: Validación de esquemas, lógica de negocio


## Configuración de Email (SMTP)

Para que la recuperación de contraseña funcione, debes configurar:

- SMTP_USER: tu correo
- SMTP_PASS: contraseña de aplicación (Google)

Si usas Gmail:
1. Activar verificación en 2 pasos
2. Generar "App Password"
3. Usar esa contraseña en SMTP_PASS

## Estructura del proyecto

```
Task-Manager/
├── src/                    # Backend
│   ├── index.ts           # Entry point
│   ├── routes/            # Endpoints API
│   │   ├── auth.ts       # Auth (login, register, forgot/reset password)
│   │   └── tasks.ts      # Tasks CRUD
│   ├── middleware/        # Auth middleware
│   ├── services/         # Node Mailer
│   ├── utils/            # Utilidades (JWT)
│   └── lib/              # Config (Prisma)
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes UI
│   │   ├── api.ts        # API calls
│   │   └── App.tsx       # Main component
│   └── package.json
├── test-unitarias/        # Pruebas Jest
│   └── auth.test.ts     # Tests de autenticación
├── prisma/               # Schema DB
├── jest.config.js        # Config Jest
├── .env                  # Variables de entorno
└── package.json
```


