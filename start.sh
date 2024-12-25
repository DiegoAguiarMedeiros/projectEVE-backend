#!/bin/sh

echo "Running migrations..."
npx sequelize-cli db:migrate


echo "Starting the application..."
npm start
