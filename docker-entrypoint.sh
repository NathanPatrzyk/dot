#!/bin/sh
set -e

echo "Aplicando migrations..."
node migrate.cjs

echo "Iniciando aplicação..."
exec "$@"
