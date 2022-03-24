#!/bin/bash

 until pg_isready -h $DB_HOST -p 5432 -U $DB_USER
    do
      echo "Waiting for postgres at: $DB_HOST"
      sleep 2;
    done
    echo "Creating Database $DB_NAME...";
    echo "SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec" | psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST>:5432
    sleep 2;
    echo "Creating Schema $DB_SCHEMA..."
    psql --command="CREATE SCHEMA IF NOT EXISTS $DB_SCHEMA" postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST/$DB_NAME>:5432
    sleep 2;
    echo "Running migrations..."
    npm run migrate

    sleep 2;
    echo "Seeding DB..."
    npm run seed-db

    npm run start
