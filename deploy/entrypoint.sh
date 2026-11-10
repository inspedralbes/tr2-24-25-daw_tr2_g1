#!/bin/sh
set -eu
if [ "$DEMO_MODE" != "true" ] || [ "$DB_NAME" != "plapi_demo" ]; then
  echo "This image only supports the isolated PlaPI demo." >&2; exit 1
fi
for variable in DB_HOST DB_USER DB_PASSWORD; do
  eval "value=\${$variable:-}"
  if [ -z "$value" ]; then echo "Missing required database setting: $variable" >&2; exit 1; fi
done
cd /app/backend
node demo/seed.mjs
mkdir -p uploads
envsubst '$PORT' < /etc/nginx/templates/demo.conf.template > /etc/nginx/sites-enabled/default
nginx -t
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/demo.conf
