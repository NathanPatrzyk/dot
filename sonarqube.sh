#!/usr/bin/env bash
set -e

COMPOSE_FILE="docker-compose-sonarqube.yml"
SONAR_URL="http://localhost:9000"
SONAR_TOKEN="${1:-$SONAR_TOKEN}"

cleanup() {
  docker compose -f "$COMPOSE_FILE" down
  exit 0
}

trap cleanup INT TERM

docker compose -f "$COMPOSE_FILE" up -d

until curl -s "$SONAR_URL/api/system/status" | grep -q '"status":"UP"'; do
  sleep 2
done

pnpm test

docker run --rm --network host -v "$(pwd)":"$(pwd)" -w "$(pwd)" sonarsource/sonar-scanner-cli -Dsonar.host.url="$SONAR_URL" -Dsonar.token="$SONAR_TOKEN"

sleep infinity &
wait $!