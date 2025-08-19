#!/bin/bash
set -e

echo "Starting Settly API..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Build connection string
CONNECTION_STRING="Host=$POSTGRES_HOST;Port=$POSTGRES_PORT;Database=$POSTGRES_DB;User Id=$POSTGRES_USER;Password=$POSTGRES_PASSWORD;Include Error Detail=true"

# Create or update appsettings.Development.json for SettlyApi
API_SETTINGS_FILE="SettlyApi/appsettings.Development.json"
echo "Creating/updating $API_SETTINGS_FILE..."
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
  },
  "AllowedHosts": "*"
}
EOF

echo "Configuration file updated"
echo "Starting the API server..."

# Run the API
dotnet run --project SettlyApi --configuration Release --urls "http://0.0.0.0:8080"