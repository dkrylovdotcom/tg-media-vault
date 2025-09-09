#!/bin/bash

# Settings
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="postgres"
PG_VERSION="15"

echo "1. System update..."
sudo apt update && sudo apt upgrade -y

echo "2. Install PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

echo "3. User and database setup..."

# Switching to user postgres
sudo -i -u postgres bash <<EOF
# Creating user if not exists
psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || psql -c "CREATE USER ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';"

# Creating database if not exists
psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

# Granting all privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
EOF

echo "4. Configuring authentication for TCP/IP with password..."
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

# Creating a backup
sudo cp "$PG_HBA" "${PG_HBA}.bak"

# Changing for local connections to md5
sudo sed -i "s/^local\s\+all\s\+all\s\+.*/local   all             all                                     md5/" "$PG_HBA"
sudo sed -i "s/^host\s\+all\s\+all\s\+127.0.0.1\/32\s\+.*/host    all             all             127.0.0.1\/32            md5/" "$PG_HBA"
sudo sed -i "s/^host\s\+all\s\+all\s\+::1\/128\s\+.*/host    all             all             ::1/128                 md5/" "$PG_HBA"

# Set password
sudo -i -u $DB_USER
psql -U postgres -c "ALTER USER postgres PASSWORD '$DB_PASSWORD';"

echo "5. Restarting PostgreSQL..."
sudo systemctl restart postgresql

echo "✅ PostgreSQL is ready to use"
echo "DB Name: $DB_NAME"
echo "DB User: $DB_USER"
echo "DB User Password: $DB_PASSWORD"
