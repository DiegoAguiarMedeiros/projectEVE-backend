#!/bin/bash

# Passo 1: Build das imagens do Docker com docker-compose
echo "Building Docker images..."
docker-compose build

# Passo 2: Iniciar os containers com docker-compose
echo "Starting Docker containers..."
docker-compose up
