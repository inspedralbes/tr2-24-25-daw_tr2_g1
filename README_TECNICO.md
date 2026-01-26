# 📚 PlaPI - Gestión de Planes Individualizados con IA

> Sistema web para la gestión automatizada de Planes de Suport Individualitzat (PI) utilizando Inteligencia Artificial Generativa para el análisis de documentos educativos.

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Despliegue](#-despliegue)
- [Equipo](#-equipo)

---

## 🎯 Descripción General

**PlaPI** es una aplicación web diseñada para facilitar la transición de alumnos de secundaria a formación profesional, automatizando el proceso de creación y gestión de Planes Individualizados mediante Inteligencia Artificial.

### Problema que Resuelve

Los centros educativos necesitan gestionar documentación extensa de alumnos con necesidades educativas especiales. Este proceso manual es:
- ⏰ **Lento**: Horas de lectura y transcripción manual
- ❌ **Propenso a errores**: Información crítica puede perderse
- 📄 **Desorganizado**: Documentos dispersos en diferentes formatos

### Solución

PlaPI utiliza **Google Gemini AI** para:
1. **Extraer** información estructurada de PDFs automáticamente
2. **Analizar** dificultades de aprendizaje y propuestas educativas
3. **Generar** Planes Individualizados listos para revisión docente
4. **Gestionar** un historial completo por alumno

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Nuxt 4** | 4.2.2 | Framework SSR/SPA de Vue.js |
| **Vue 3** | 3.5.27 | Framework reactivo para UI |
| **Vite** | 7.3.1 | Build tool y dev server |
| **Nuxt UI** | 4.3.0 | Componentes UI prediseñados |
| **pdfjs-dist** | 5.4.530 | Lector de PDFs en el navegador |
| **Google Generative AI** | 0.24.1 | SDK para Gemini AI |
| **TypeScript** | - | Tipado estático |

**Características:**
- ⚡ **Hot Module Replacement** (HMR) para desarrollo
- 🎨 **CSS Global** con variables reutilizables (sistema de diseño Gencat)
- 🌐 **Multiidioma** (Catalán, Español, Inglés)
- 📱 **Responsive Design**

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | 20 | Runtime de JavaScript |
| **Express** | 4.21.2 | Framework web para APIs REST |
| **MySQL 2** | 3.15.3 | Driver de MySQL con Promises |
| **Multer** | 2.0.2 | Middleware para subida de archivos |
| **Google Auth Library** | 9.0.0 | Autenticación OAuth 2.0 |
| **CORS** | 2.8.5 | Control de acceso entre orígenes |
| **dotenv** | 17.2.3 | Variables de entorno |
| **Nodemon** | 3.1.11 | Auto-reload en desarrollo |

**Características:**
- 🔐 **OAuth 2.0** con Google Sign-In
- 📤 **Upload de PDFs** con validación de RALC
- 🗄️ **Pool de conexiones** MySQL optimizado
- 🔄 **Auto-reload** en desarrollo

### Base de Datos

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **MySQL** | 8.0 | Sistema de gestión de BD relacional |
| **Adminer** | latest | Interfaz web para gestión de BD |
| **phpMyAdmin** | latest | Alternativa de gestión de BD |

**Esquema:**
- 4 tablas principales: `centres`, `professors`, `alumnes`, `pis`
- Claves foráneas con `ON DELETE CASCADE`
- Charset UTF-8 para soporte multiidioma

### DevOps & Infraestructura

| Tecnología | Uso |
|------------|-----|
| **Docker** | Contenedores para desarrollo y producción |
| **Docker Compose** | Orquestación de servicios |
| **GitHub Actions** | CI/CD para despliegue automático |
| **GitHub Container Registry** | Registro de imágenes Docker |
| **Nginx** | Reverse proxy en producción |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Nuxt 4 + Vue 3 (SSR/SPA)                 │   │
│  │  - Componentes reactivos                            │   │
│  │  - Gestión de estado con Composables                │   │
│  │  - Routing automático                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE APLICACIÓN                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Express REST API (Node.js 20)              │   │
│  │  - Controladores por dominio                        │   │
│  │  - Middleware de autenticación OAuth                │   │
│  │  - Multer para uploads                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ MySQL Protocol
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MySQL 8.0 Database                    │   │
│  │  - Normalización 3FN                                │   │
│  │  - Índices optimizados                              │   │
│  │  - Volúmenes Docker persistentes                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            
                            ↕ API REST
┌─────────────────────────────────────────────────────────────┐
│                     SERVICIOS EXTERNOS                       │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Google OAuth    │         │   Gemini AI      │         │
│  │  (Autenticación) │         │  (Análisis PDF)  │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Autenticación**: El usuario inicia sesión con Google OAuth
2. **Upload**: El profesor sube un PDF del alumno
3. **Extracción**: pdfjs-dist extrae el texto del PDF
4. **Análisis**: Gemini AI procesa el texto y genera un análisis estructurado
5. **Revisión**: El profesor revisa y edita los datos extraídos
6. **Almacenamiento**: Se guarda en MySQL con el PDF en el filesystem
7. **Consulta**: Los datos se pueden consultar por RALC del alumno

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Docker** y **Docker Compose** instalados
- **Node.js 20+** (opcional, solo para desarrollo sin Docker)
- **Git**

### Variables de Entorno Necesarias

#### Backend (`.env` en `/backend`)

```env
# Base de Datos
DB_HOST=mysql
DB_USER=user_dev
DB_PASSWORD=password_dev
DB_NAME=db_plapi_dev
DB_PORT=3306

# Servidor
PORT_BACKEND=3000
URL_BACKEND=http://localhost

# Google OAuth (obtener en Google Cloud Console)
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

#### Frontend (`.env` en `/frontend`)

```env
# Gemini AI (obtener en Google AI Studio)
VITE_GEMINI_KEY=tu-api-key-de-gemini

# API Backend
VITE_API_URL=http://localhost:3000
```

### Instalación Local con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/inspedralbes/tr2-24-25-daw_tr2_g1.git
cd tr2-24-25-daw_tr2_g1

# 2. Crear archivos .env con tus credenciales
# (ver sección anterior)

# 3. Levantar todos los servicios
docker compose up --build

# 4. Acceder a la aplicación
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
# Adminer: http://localhost:8080
# phpMyAdmin: http://localhost:8081
```

### Instalación Manual (sin Docker)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev

# MySQL (debes tener MySQL 8.0 instalado)
mysql -u root -p < backend/db/crear.sql
mysql -u root -p db_plapi_dev < backend/db/insertar.sql
```

---

## 📁 Estructura del Proyecto

```
tr2-24-25-daw_tr2_g1/
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD para despliegue automático
│
├── backend/
│   ├── api/
│   │   ├── create/              # Controladores de creación
│   │   │   ├── createStudent.js
│   │   │   ├── createStudentPI.js
│   │   │   └── createAdminUser.js
│   │   ├── get/                 # Controladores de consulta
│   │   │   ├── getAllStudent.js
│   │   │   ├── getByRalcStudent.js
│   │   │   └── getAllCenter.js
│   │   ├── login/               # Autenticación
│   │   │   ├── loginGoogle.js   # OAuth con Google
│   │   │   └── loginCenter.js
│   │   ├── save/                # Upload de archivos
│   │   │   └── savePdf.js       # Multer + validación
│   │   ├── search/              # Gestión de usuarios
│   │   │   └── adminSearch.js
│   │   └── db.js                # Pool de conexiones MySQL
│   ├── db/
│   │   ├── crear.sql            # Esquema de BD
│   │   └── insertar.sql         # Datos de prueba
│   ├── router/
│   │   └── routerLogic.js       # Definición de rutas
│   ├── uploads/                 # PDFs subidos
│   ├── server.js                # Punto de entrada
│   ├── Dockerfile               # Imagen Docker desarrollo
│   ├── Dockerfile.prod          # Imagen Docker producción
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── assets/
│   │   │   └── css/
│   │   │       └── global.css   # Sistema de diseño global
│   │   ├── components/
│   │   │   ├── comp-pi/         # Componentes de PI
│   │   │   │   ├── FileUpload.vue
│   │   │   │   ├── ReviewFileResponse.vue
│   │   │   │   └── RegisterStudent.vue
│   │   │   ├── saveNew/
│   │   │   │   └── saveNewPi.vue
│   │   │   └── AppHeader.vue    # Header global
│   │   ├── composables/         # Lógica reutilizable
│   │   │   ├── useGemini.js     # Integración Gemini AI
│   │   │   ├── usePiState.js    # Estado global de PI
│   │   │   ├── useIdioma.js     # Gestión de idioma
│   │   │   ├── useTable.ts      # Tabla de alumnos
│   │   │   └── usePiData.ts
│   │   ├── layouts/
│   │   │   └── default.vue      # Layout principal
│   │   ├── pages/               # Routing automático de Nuxt
│   │   │   ├── index.vue        # Login
│   │   │   ├── home.vue         # Dashboard
│   │   │   ├── centre/
│   │   │   │   └── Dashboard.vue # Gestión de profesores
│   │   │   ├── pi/
│   │   │   │   ├── crear-pi.vue
│   │   │   │   └── search.vue
│   │   │   ├── saveNew/
│   │   │   │   └── saveNewPi.vue
│   │   │   ├── student/
│   │   │   │   └── [id]/
│   │   │   │       └── index.vue # Detalle de alumno
│   │   │   └── contacte.vue
│   │   ├── plugins/
│   │   │   └── pdf-polyfill.client.ts
│   │   ├── services/
│   │   │   └── apiStudent.js    # Llamadas HTTP al backend
│   │   └── app.vue              # Componente raíz
│   ├── nuxt.config.ts           # Configuración de Nuxt
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   └── package.json
│
├── nginx/                       # Configuración reverse proxy (prod)
├── doc/                         # Documentación adicional
├── docker-compose.yml           # Desarrollo
├── docker-compose.prod.yml      # Producción
├── .gitignore
└── README.md
```

---

## ⚡ Funcionalidades Principales

### 1. Autenticación con Google OAuth

**Tecnología:** `google-auth-library` + Google Sign-In SDK

**Flujo:**
1. El usuario hace clic en "Iniciar sesión con Google"
2. Google devuelve un token JWT
3. El backend valida el token con la API de Google
4. Busca el email en las tablas `centres` o `professors`
5. Si existe, crea una sesión y devuelve los datos del usuario

**Archivos clave:**
- `backend/api/login/loginGoogle.js` - Lógica de autenticación
- `frontend/app/pages/index.vue` - Componente de login

### 2. Análisis de PDF con IA

**Tecnología:** `pdfjs-dist` + `@google/generative-ai` (Gemini)

**Flujo:**
1. El usuario arrastra un PDF al componente `FileUpload.vue`
2. `pdfjs-dist` extrae el texto de todas las páginas
3. Se envía el texto a **Gemini 2.5 Flash** con un prompt estructurado
4. Gemini devuelve un JSON con:
   - `dificultat`: Tipo de trastorno/dificultad
   - `gravetat`: Nivel (Lleu/Moderada/Greu)
   - `justificacio`: Resumen de evidencias
   - `proposta_educativa`: Acciones concretas
   - `observacio`: Notas adicionales
5. El usuario revisa y edita los datos en `ReviewFileResponse.vue`

**Prompt del sistema:**
```javascript
const prompt = `
  Actúa como un psicopedagogo experto. Analiza el siguiente informe de ${studentName}.
  
  Tu objetivo es extraer datos para un Plan Individualizado (PI).
  Sé EXTREMADAMENTE CONCISO. No uses texto de relleno. Ve al grano.
  
  Devuelve un JSON exacto con estas claves:
  {
    "dificultat": "Nombre técnico corto del trastorno...",
    "gravetat": "Elige SOLO UNO: 'Lleu', 'Moderada', 'Greu'...",
    "justificacio": "Resumen telegráfico de la evidencia...",
    "proposta_educativa": "Listado de acciones clave...",
    "observacio": ""
  }
  
  Idioma de respuesta: CATALÁN.
  
  --- TEXTO DEL INFORME ---
  "${pdfText.substring(0, 30000)}"
`;
```

**Archivos clave:**
- `frontend/app/composables/useGemini.js` - Integración con Gemini
- `frontend/app/components/comp-pi/FileUpload.vue` - Upload y extracción
- `frontend/app/components/comp-pi/ReviewFileResponse.vue` - Revisión

### 3. Gestión de Alumnos y PIs

**Operaciones CRUD:**

- **Crear alumno**: `POST /api/alumne`
- **Buscar por RALC**: `GET /api/alumne/:ralc`
- **Listar todos**: `GET /api/alumnes`
- **Crear PI**: `POST /api/alumne/plan_individualitzat`
- **Subir PDF**: `POST /api/save-pi` (Multer multipart)
- **Descargar PDF**: `GET /api/pdf/:ralc`

**Sistema de estados:**
- Cada alumno puede tener **múltiples PIs** (histórico)
- Solo **1 PI activo** a la vez
- Al crear un nuevo PI, los anteriores pasan a estado `inactiu`

**Archivos clave:**
- `backend/api/create/` - Controladores de creación
- `backend/api/get/` - Controladores de consulta
- `backend/api/save/savePdf.js` - Upload de PDFs con Multer
- `frontend/app/services/apiStudent.js` - Cliente HTTP

### 4. Panel de Gestión de Profesores

**Solo para centros educativos:**

Los centros pueden:
- Ver lista de profesores autorizados
- Añadir nuevos profesores por email
- Eliminar profesores

**Validación:**
- Al crear un profesor, se guarda con estado "Pendent de registre"
- En su primer login con Google, se actualiza su nombre real
- Si el profesor no está autorizado, recibe un 404

**Archivos clave:**
- `frontend/app/pages/centre/Dashboard.vue`
- `backend/api/create/createAdminUser.js`
- `backend/api/search/adminSearch.js`

---

## 🗄️ Base de Datos

### Esquema Relacional

```sql
centres (id, codi_centre, denominacio_completa, email_centre, ...)
    ↓ 1:N
professors (id, email, nom, password, centre_id)
    ↓ 1:N
alumnes (ralc [PK], nom, cognom, dni, data_naixement, curs, grup, centre_procedencia_id)
    ↓ 1:N
pis (id, alumne_ralc [FK], professor_id [FK], dificultat, gravetat, 
     justificacio, proposta_educativa, observacio, ruta_pdf, 
     data_creacio, estado [actiu/inactiu])
```

### Tablas Principales

#### `centres`
Centros educativos registrados en el sistema.

```sql
CREATE TABLE `centres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codi_centre` varchar(10) NOT NULL,
  `denominacio_completa` varchar(255) NOT NULL,
  `email_centre` varchar(100) DEFAULT NULL,
  `telefon` varchar(20) DEFAULT NULL,
  `nom_naturalesa` varchar(50) DEFAULT NULL,
  `codi_postal` varchar(10) DEFAULT NULL,
  `adreca` varchar(255) DEFAULT NULL,
  `nom_municipi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

#### `professors`
Docentes autorizados para acceder al sistema.

```sql
CREATE TABLE `professors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL UNIQUE,
  `nom` varchar(100) DEFAULT 'Pendent de registre',
  `password` varchar(255) DEFAULT 'GOOGLE_AUTH_PLACEHOLDER',
  `centre_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`centre_id`) REFERENCES `centres`(`id`) ON DELETE CASCADE
);
```

#### `alumnes`
Estudiantes con necesidades educativas especiales.

```sql
CREATE TABLE `alumnes` (
  `ralc` varchar(50) NOT NULL,  -- Registro de Alumnos de Cataluña
  `nom` varchar(100) NOT NULL,
  `cognom` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `data_naixement` date DEFAULT NULL,
  `curs` varchar(50) DEFAULT NULL,
  `grup` varchar(50) DEFAULT NULL,
  `centre_procedencia_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`ralc`),
  FOREIGN KEY (`centre_procedencia_id`) REFERENCES `centres`(`id`) ON DELETE SET NULL
);
```

#### `pis`
Planes Individualizados generados por la IA.

```sql
CREATE TABLE `pis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alumne_ralc` varchar(50) NOT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `dificultat` text,
  `gravetat` varchar(50) DEFAULT NULL,
  `justificacio` text,
  `proposta_educativa` text,
  `observacio` text,
  `ruta_pdf` varchar(255) DEFAULT NULL,
  `data_creacio` timestamp DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('actiu','inactiu') DEFAULT 'actiu',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`alumne_ralc`) REFERENCES `alumnes`(`ralc`) ON DELETE CASCADE,
  FOREIGN KEY (`professor_id`) REFERENCES `professors`(`id`) ON DELETE SET NULL
);
```

### Índices y Optimizaciones

- **Primary Keys** en todas las tablas para acceso O(1)
- **Foreign Keys** con `ON DELETE CASCADE` para integridad referencial
- **UNIQUE** en `professors.email` para evitar duplicados
- **ENUM** para `pis.estado` (solo 'actiu' o 'inactiu')
- **Charset UTF-8** para soporte de caracteres catalanes (ç, à, è, ò)

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/login` | Login para centros | `{ email }` |
| POST | `/api/login-google` | OAuth con Google | `{ id_token }` |

### Alumnos

| Método | Endpoint | Descripción | Body/Params |
|--------|----------|-------------|-------------|
| GET | `/api/alumnes` | Listar todos los alumnos | - |
| GET | `/api/alumne/:ralc` | Buscar alumno por RALC | `ralc` en params |
| POST | `/api/alumne` | Crear nuevo alumno | `{ ralc, name, surname, dni, date, course, group, centre_procedencia_id }` |

### Planes Individualizados

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/alumne/plan_individualitzat` | Crear PI | `{ ralc, professor_id, dificultat, gravetat, justificacio, proposta_educativa, observacio, ruta_pdf }` |
| POST | `/api/save-pi` | Subir PDF del PI | Multipart: `{ pdfFile, ralc, professor_email, ...datos_pi }` |
| GET | `/api/pdf/:ralc` | Descargar PDF por RALC | `ralc` en params |

### Centros y Profesores

| Método | Endpoint | Descripción | Body/Params |
|--------|----------|-------------|-------------|
| GET | `/api/centres` | Listar todos los centros | - |
| GET | `/api/centre/:id/users` | Listar profesores de un centro | `id` en params |
| POST | `/api/admin/create-user` | Autorizar nuevo profesor | `{ email, centre_id }` |
| DELETE | `/api/admin/users/:id` | Eliminar profesor | `id` en params |

### Ejemplo de Uso

```javascript
// Buscar alumno por RALC
const response = await fetch('http://localhost:3000/api/alumne/A12345678');
const data = await response.json();

console.log(data);
// {
//   "success": true,
//   "data": {
//     "ralc": "A12345678",
//     "nom": "Joan",
//     "cognoms": "Pérez García",
//     "dni": "12345678A",
//     "dataNaixement": "2005-05-15",
//     "curs": "1r ESO",
//     "centreProcedencia": "INS Pedralbes",
//     "pis": [
//       {
//         "id": 1,
//         "dificultat": "Dislèxia",
//         "gravetat": "Moderada",
//         "justificacio": "...",
//         "proposta_educativa": "...",
//         "observacio": "...",
//         "ruta_pdf": "A12345678.pdf",
//         "data_creacio": "2026-01-15T10:30:00.000Z",
//         "estado": "actiu",
//         "professorNom": "Maria López",
//         "professorEmail": "maria@inspedralbes.cat"
//       }
//     ]
//   }
// }
```

---

## 🚢 Despliegue

### Entorno de Desarrollo

```bash
# Usar docker-compose.yml
docker compose up --build

# Servicios:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:3000
# - MySQL: localhost:3306
# - Adminer: http://localhost:8080
# - phpMyAdmin: http://localhost:8081
```

### Entorno de Producción

**CI/CD con GitHub Actions:**

1. **Trigger**: Push a la rama `main`
2. **Build**: Construye imágenes Docker optimizadas (`Dockerfile.prod`)
3. **Push**: Sube las imágenes a GitHub Container Registry
4. **Deploy**: SSH al servidor y ejecuta `docker compose -f docker-compose.prod.yml up -d`

**Características de producción:**
- ✅ Imágenes multi-stage para menor tamaño
- ✅ Nginx como reverse proxy
- ✅ HTTPS con certificados SSL
- ✅ Variables de entorno desde GitHub Secrets
- ✅ Volúmenes persistentes para MySQL y uploads
- ✅ Health checks para MySQL

**docker-compose.prod.yml:**

```yaml
services:
  frontend:
    image: ghcr.io/inspedralbes/tr2-24-25-daw_tr2_g1-frontend:latest
    environment:
      - NODE_ENV=production
      - VITE_API_URL=https://edupi.daw.inspedralbes.cat/api
    
  backend:
    image: ghcr.io/inspedralbes/tr2-24-25-daw_tr2_g1-backend:latest
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
    volumes:
      - ./uploads:/usr/src/app/uploads  # Persistencia de PDFs
      
  mysql:
    image: mysql:8.0
    volumes:
      - mysql-prod-data:/var/lib/mysql  # Persistencia de datos
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
```

**URL de producción:** http://edupi.daw.inspedralbes.cat

---

## 🎨 Sistema de Diseño

### Variables CSS (global.css)

```css
:root {
  /* Colores Gencat */
  --color-gencat-red: #c8102e;
  --color-gencat-red-dark: #a00d25;
  --color-gencat-red-hover: #a80016;
  
  /* Colores de estado */
  --color-green: #007a33;
  --color-green-dark: #005a24;
  
  /* Tipografía */
  --font-family-primary: "Open Sans", sans-serif;
  
  /* Espaciados */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;
  
  /* Bordes redondeados */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
}
```

### Clases Reutilizables

- **`.btn-gencat`**: Botón principal rojo Gencat con hover
- **`.btn-white`**: Botón secundario con borde
- **`.btn-success`**: Botón verde para acciones positivas
- **`.card`**: Tarjeta con sombra y padding
- **`.spinner-large`**: Spinner de carga animado

---

## 👥 Equipo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| **Oleksiy Prochko Yatsko** | Full-stack Developer | - |
| **Brian Briones Erazo** | Full-stack Developer | - |
| **Jaume Hurtado Gonzalez** | Full-stack Developer | [@a24jauhurgon](https://github.com/a24jauhurgon) |
| **Amin Oulad Abid** | Full-stack Developer | - |
| **Pol Molina Muñoz** | Full-stack Developer | - |

**Institución:** Institut Pedralbes  
**Curso:** 2º DAW (Desarrollo de Aplicaciones Web)  
**Año académico:** 2024-2025

---

## 📝 Licencia

Este proyecto está bajo la licencia especificada en el archivo [LICENSE](LICENSE).

---

## 🔗 Enlaces Útiles

- **Repositorio GitHub**: https://github.com/inspedralbes/tr2-24-25-daw_tr2_g1
- **Producción**: http://edupi.daw.inspedralbes.cat
- **Taiga (Gestión)**: https://tree.taiga.io/project/a24jauhurgon-tr2-plans-individuals/backlog
- **Figma (Diseño)**: [Enlace al diseño](https://www.figma.com/design/RFnK1qmbGQKqaRA4oTsH3B/Projecte-2-Transversal)
- **Documentación MySQL**: https://dev.mysql.com/doc/
- **Documentación Nuxt 4**: https://nuxt.com/docs
- **Gemini AI**: https://ai.google.dev/gemini-api/docs

---

## 📚 Documentación Adicional

Para más información sobre el diseño y la arquitectura del sistema, consulta la carpeta `/doc` que incluye:

- Diagramas UML de casos de uso
- Mockups de interfaz
- Documentación técnica de la base de datos
- Guías de despliegue específicas

---

**¿Preguntas o sugerencias?** Abre un issue en GitHub o contacta con el equipo de desarrollo.
