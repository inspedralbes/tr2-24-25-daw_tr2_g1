# PlaPI: demo pública independiente

La rama `demo/free-hosting` prepara una demostración del proyecto en equipo. La rama `main` conserva la aplicación original, incluido Google y Gemini. Se mantienen sus autores y créditos.

## Alcance acordado

- Accesos directos de centro y profesor, sin credenciales Google.
- Centros, profesores, alumnos y documento completamente ficticios.
- Respuesta de análisis precalculada e identificada, sin peticiones a Gemini.
- Recorrido original de crear alumno, revisar PI, guardar, consultar historial y visualizar PDF.
- Gestión de docentes de solo lectura en la demo.
- Datos compartidos entre visitantes; no introducir información personal.

Los adaptadores se activan con `DEMO_MODE=true` y `NUXT_PUBLIC_DEMO_MODE=true`. Los datos libres y archivos enviados al backend no se guardan: la demo utiliza los valores y el PDF de ejemplo. Los PIs mantienen el historial original y un solo estado activo. Los nuevos alumnos están limitados a 200 para acotar la base de demostración.

## Alojamiento

Un contenedor en Render Free (Frankfurt), con Nginx, Nuxt y Express. MySQL compatible externo en TiDB Cloud Starter. El puerto público es `PORT`; la web y API comparten origen, sin depender del DNS del instituto.

El contenedor excluye claves TLS antiguas, archivos .env, PDFs anteriores y el volcado original de datos. Solo inicializa `plapi_demo`. No elimina tablas ni reinicializa una base con datos ajenos a la demo.

## Configuración privada de TiDB

Crear una instancia **Starter compatible con MySQL**, gratuita, sin activar facturación por consumo. Elegir región europea si está disponible. En **Connect**, copiar los valores de host, puerto, usuario y contraseña.

Render solicitará tres valores privados:

| Variable | Valor |
| --- | --- |
| `DB_HOST` | Host exacto de TiDB, sin https:// ni puerto |
| `DB_USER` | Usuario completo que muestra TiDB |
| `DB_PASSWORD` | Contraseña privada de esa instancia |

El Blueprint fija `DB_PORT=4000`, `DB_NAME=plapi_demo` y `DB_SSL=true`. Si TiDB muestra un puerto diferente, ajustar DB_PORT antes de aplicar. La conexión valida el certificado TLS. No enviar contraseñas por el chat ni guardarlas en Git.

El inicio del contenedor crea la base y las tablas originales, y añade un centro ficticio, profesores, tres alumnos y un PI de ejemplo. Si ya contiene la marca del centro demo, conserva los datos existentes. Debe usarse una instancia/base dedicada a estas demos, con permisos para crear la base.

## Comprobación local realizada

Se usó una instancia aislada de MariaDB compatible con MySQL en `127.0.0.1:13307`, con datos bajo `artifacts/mysql`. No se modificaron las bases preexistentes de XAMPP.

Backend:
```powershell
cd backend
npm ci --ignore-scripts
# Configurar variables DB_* locales, DEMO_MODE=true y DB_NAME=plapi_demo.
node demo/seed.mjs
$env:PORT_BACKEND='8059'
node server.js
```

Frontend:
```powershell
cd frontend
npm ci --ignore-scripts
$env:NUXT_PUBLIC_DEMO_MODE='true'
$env:API_ORIGIN='http://127.0.0.1:8059'
npm run build
$env:PORT='5181'
$env:NITRO_PORT='5181'
node .output/server/index.mjs
```

Requiere Node 24. Las dependencias quedan fijadas por lockfiles. PDF.js se fija en la versión original `5.4.530`, fuera del rango vulnerable de GHSA-hq66-cqwq-w95j. No se aplicaron downgrades de Nuxt ni actualizaciones mayores forzadas.

## Pruebas

```powershell
node scripts/api-smoke.mjs
playwright-cli -s=plapi-demo open http://127.0.0.1:5181 --browser=chrome
playwright-cli -s=plapi-demo run-code --filename=scripts/browser-smoke.js
```

- Build de Nuxt correcto.
- 18 comprobaciones de API correctas.
- 10 comprobaciones de navegador correctas, sin errores JavaScript ni peticiones a Google/Gemini.
- Capturas de acceso, centro, alumno, creación, revisión y docentes en `artifacts/`.
- Sintaxis Linux del entrypoint y de los adaptadores comprobada.

Las pruebas locales no equivalen a verificar TiDB ni el contenedor Linux de Render. Queda pendiente completar la conexión privada de la base, construir en Render y repetir las pruebas sobre su URL HTTPS. No enlazar la demo en el portfolio hasta entonces.

## Publicación

El archivo `render.yaml` solicita los secretos durante la configuración. Validar su plan antes de aplicarlo: un solo servicio web Free, sin discos ni otros servicios de pago. El despliegue debe partir de la rama `demo/free-hosting`, nunca de `main`.

Render Free puede suspenderse tras inactividad y tardar alrededor de un minuto en despertar. Los archivos locales se pierden al reiniciar; los PDFs de ejemplo vuelven a estar disponibles desde el fixture del contenedor. Los registros ficticios de MySQL permanecen en TiDB.
