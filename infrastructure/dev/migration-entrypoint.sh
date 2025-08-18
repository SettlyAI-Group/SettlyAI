#!/bin/bash
set -e

echo "Starting database initialization..."

# Ensure dotnet tools are in PATH
export PATH="$PATH:/root/.dotnet/tools"

# Verify dotnet-ef is available
echo "Checking dotnet-ef availability..."
if ! command -v dotnet-ef &> /dev/null; then
    echo "dotnet-ef not found in PATH. Installing..."
    dotnet tool install --global dotnet-ef --version 8.0.0
    export PATH="$PATH:/root/.dotnet/tools"
else
    echo "dotnet-ef found. Version:"
    dotnet-ef --version
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Build connection string
CONNECTION_STRING="Host=$POSTGRES_HOST;Port=$POSTGRES_PORT;Database=$POSTGRES_DB;User Id=$POSTGRES_USER;Password=$POSTGRES_PASSWORD;Include Error Detail=true"

# Create appsettings.Development.json for SettlyApi if it doesn't exist
API_SETTINGS_FILE="SettlyApi/appsettings.Development.json"
if [ ! -f "$API_SETTINGS_FILE" ]; then
    echo "Creating $API_SETTINGS_FILE..."
    cat > "$API_SETTINGS_FILE" << EOF
{
  "ApiConfigs": {
    "DBConnection": "$CONNECTION_STRING"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
EOF
fi

# Create appsettings.Development.json for SettlyDbManager if it doesn't exist
DB_MANAGER_SETTINGS_FILE="SettlyDbManager/appsettings.Development.json"
if [ ! -f "$DB_MANAGER_SETTINGS_FILE" ]; then
    echo "Creating $DB_MANAGER_SETTINGS_FILE..."
    cat > "$DB_MANAGER_SETTINGS_FILE" << EOF
{
  "ApiConfigs": {
    "DBConnection": "$CONNECTION_STRING"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
EOF
fi

echo "Configuration files created/verified"

# Navigate to SettlyModels directory for EF operations
cd SettlyModels

echo "Checking for existing migrations..."
if [ ! -d "Migrations" ] || [ -z "$(ls -A Migrations 2>/dev/null)" ]; then
    echo "No migrations found, creating initial migration..."
    dotnet ef migrations add InitialCreate --startup-project ../SettlyApi --verbose
else
    echo "Migrations already exist, skipping migration creation"
fi

echo "Applying database migrations..."
dotnet ef database update --startup-project ../SettlyApi --verbose

echo "Database migrations applied successfully!"

# Navigate to SettlyDbManager for seeding
cd ../SettlyDbManager

echo "Seeding database with sample data..."
dotnet run -- --seed

echo "Database initialization and seeding completed successfully!"
echo "Database is ready for use."

# Keep container running for a moment to see logs, then exit
sleep 5