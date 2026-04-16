#!/bin/bash
# Pull latest images and restart CLIProxyAPI Dashboard services
# Auto-detects which compose file to use (local vs infrastructure)
# Usage: ./rebuild.sh [--dashboard-only]

set -e

cd "$(dirname "$0")"

# Auto-detect compose file
if [ -f docker-compose.local.yml ]; then
    COMPOSE_FILE="docker-compose.local.yml"
elif [ -f infrastructure/docker-compose.yml ]; then
    COMPOSE_FILE="infrastructure/docker-compose.yml"
else
    echo "ERROR: No compose file found" >&2
    exit 1
fi

COMPOSE="docker compose -f $COMPOSE_FILE"
echo "=== CLIProxyAPI Dashboard Update ==="
echo "Using: $COMPOSE_FILE"
echo ""

if [ "${1:-}" = "--dashboard-only" ]; then
    echo "[1/2] Pulling latest dashboard image..."
    $COMPOSE pull dashboard

    echo ""
    echo "[2/2] Recreating dashboard container..."
    $COMPOSE up -d --no-deps --force-recreate dashboard
else
    echo "[1/3] Pulling latest images..."
    $COMPOSE pull

    echo ""
    echo "[2/3] Recreating containers..."
    $COMPOSE up -d --force-recreate

    echo ""
    echo "[3/3] Waiting for services to become healthy..."
    sleep 5
fi

echo ""
echo "=== Done! ==="
echo ""
echo "Checking container status..."
$COMPOSE ps

echo ""
echo "View logs: $COMPOSE logs -f"
