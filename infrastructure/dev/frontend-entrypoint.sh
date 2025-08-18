#!/bin/bash
set -e

echo "Starting Settly Frontend..."

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
    echo "Installing dependencies..."
    pnpm install
else
    echo "Dependencies already installed"
fi

# Wait for API to be ready (optional)
echo "Waiting for API to be ready..."
for i in {1..30}; do
    if curl -s http://settly-api:8080 >/dev/null 2>&1; then
        echo "API is ready!"
        break
    fi
    echo "API not ready yet, waiting... ($i/30)"
    sleep 2
done

# Create or update environment file if needed
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > ".env.local" << EOF
VITE_API_URL=${VITE_API_URL:-http://localhost:8080}
NODE_ENV=${NODE_ENV:-development}
EOF
fi

echo "Starting development server..."

# Check if we should build for production or run dev server
if [ "$NODE_ENV" = "production" ]; then
    echo "Building for production..."
    pnpm run build
    echo "Starting production server..."
    pnpm run preview --host 0.0.0.0 --port 3000
else
    echo "Starting development server..."
    pnpm run dev --host 0.0.0.0 --port 3000
fi