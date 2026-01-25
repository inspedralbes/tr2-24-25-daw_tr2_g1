# Configuración Dev/Prod - EduPI

## 🎯 Configuración Automática

El proyecto ahora detecta automáticamente si está en desarrollo o producción y usa las URLs correctas.

### ✅ No necesitas cambiar nada manualmente

El archivo `frontend/app/config/api.js` detecta automáticamente:
- **Desarrollo (localhost)**: Usa `http://localhost:3000`
- **Producción (edupi.daw.inspedralbes.cat)**: Usa `http://edupi.daw.inspedralbes.cat`

---

## 📋 Para trabajar en Local (Dev)

```bash
# 1. Arrancar contenedores
docker compose up --build

# 2. Acceder a:
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
# Adminer: http://localhost:8080
```

✅ Todo funciona automáticamente con URLs locales

---

## 🚀 Para Subir a Producción

### Paso 1: Commitear y pushear cambios a dev
```bash
git add .
git commit -m "Preparado para producción con configuración automática"
git push origin dev
```

### Paso 2: Hacer merge a main
```bash
git checkout main
git merge dev
git push origin main
```

### Paso 3: En el servidor de producción

```bash
# Hacer pull de los cambios
git pull origin main

# Reconstruir y arrancar los contenedores
docker compose down
docker compose up --build -d
```

✅ La aplicación detectará automáticamente que está en `edupi.daw.inspedralbes.cat` y usará las URLs de producción

---

## 🔍 Verificar el entorno

Para ver qué URL está usando, abre la consola del navegador y ejecuta:

```javascript
// En el navegador
import { API_URL } from './config/api.js';
console.log('API URL actual:', API_URL);
```

O simplemente abre el código fuente en el navegador y verás que todas las peticiones fetch usan la URL correcta automáticamente.

---

## 📁 Archivos modificados

- ✅ `frontend/app/config/api.js` - Configuración automática
- ✅ `frontend/app/services/apiStudent.js` - Usa configuración automática
- ✅ `frontend/app/components/comp-pi/FileUpload.vue` - Usa configuración automática
- ✅ `frontend/app/pages/centre/Dashboard.vue` - Usa configuración automática
- ✅ `frontend/app/pages/index.vue` - Usa configuración automática
- ✅ `frontend/app/pages/student/[id]/index.vue` - Usa configuración automática
- ✅ `frontend/app/components/saveNew/saveNewPi.vue` - Usa configuración automática

---

## ⚠️ Importante

**No necesitas cambiar URLs manualmente nunca más**. El sistema detecta automáticamente el entorno.

Si tienes problemas:
1. Verifica que el hostname en producción sea exactamente `edupi.daw.inspedralbes.cat`
2. Revisa la consola del navegador para ver qué URL está usando
3. Verifica que el backend esté corriendo en el puerto correcto

---

## 🔒 CORS en Backend

El backend ya está configurado con CORS abierto (`*`). En producción, considera limitar el origin a:
```javascript
res.header('Access-Control-Allow-Origin', 'http://edupi.daw.inspedralbes.cat');
```

Archivo: `backend/server.js` línea 14
