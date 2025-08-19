# Settly AI - Development Setup

A full-stack application with .NET Core API, React frontend, and PostgreSQL database, all containerized with Docker.

## Prerequisites

Before you begin, make sure you have Docker installed on your system.

## Quick Start

### 1. Install Docker

#### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted
4. Launch Docker Desktop and complete the initial setup

#### macOS
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Drag Docker to your Applications folder
3. Launch Docker Desktop and complete the initial setup

#### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional - allows running docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

#### Verify Installation
```bash
docker --version
docker-compose --version
```

### 2. Configure Environment Variables

1. Navigate to the infrastructure development directory:
   ```bash
   cd infrastructure/dev
   ```

2. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

3. (Optional) Edit the `.env` file if you need to customize any settings:
   ```bash
   nano .env
   ```

   Default configuration:
   ```env
   POSTGRES_DB=settly_db
   POSTGRES_USER=settly_user
   POSTGRES_PASSWORD=admin
   POSTGRES_PORT=5432
   ```

### 3. Start the Application

Run the following command to build and start all services:

```bash
docker-compose up -d --build
```

This command will:
- Build the Docker images for all services
- Start the containers in detached mode (background)
- Set up the PostgreSQL database
- Run database migrations and seed data
- Start the API server
- Start the frontend development server

## Accessing the Application

Once the containers are running, you can access:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080/api/properties/1
- **Database**: localhost:5432 (if you need direct access)

## Useful Commands

### Check Container Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs settly-api
docker-compose logs settly-frontend
docker-compose logs settly-db-migration
```

### Stop the Application
```bash
docker-compose down
```

### Restart the Application
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose down
docker-compose up -d --build
```

### Clean Up (Remove containers, networks, and volumes)
```bash
docker-compose down -v --remove-orphans
```

## Architecture

The application consists of several services:

- **postgres**: PostgreSQL database server
- **settly-db-migration**: Handles database migrations and seeding
- **settly-api**: .NET Core Web API backend
- **settly-frontend**: React frontend application

## Development Workflow

1. **First time setup**: Follow the Quick Start guide above
2. **Daily development**: 
   ```bash
   docker-compose up -d
   ```
3. **Making changes**: The frontend supports hot reload. For API changes, restart the API container:
   ```bash
   docker-compose restart settly-api
   ```
4. **Database changes**: If you modify the database models, rebuild the migration container:
   ```bash
   docker-compose up --build settly-db-migration
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**: If ports 3000, 8080, or 5432 are already in use, either:
   - Stop the conflicting services
   - Modify the port mappings in `docker-compose.yml`

2. **Docker not running**: Make sure Docker Desktop is running

3. **Permission denied (Linux)**: If you get permission errors, either:
   - Run with sudo: `sudo docker-compose up -d --build`
   - Add your user to docker group (see Linux installation steps above)

4. **Build failures**: Clean up and rebuild:
   ```bash
   docker-compose down -v
   docker system prune -a
   docker-compose up -d --build
   ```

### Viewing Detailed Logs

To debug issues, view logs with timestamps:
```bash
docker-compose logs -f --timestamps
```

For a specific service:
```bash
docker-compose logs -f --timestamps settly-api
```

## Health Checks

The application includes health checks for all services. You can verify everything is running properly:

```bash
# Check if API is healthy
curl http://localhost:8080/health

# Check if frontend is responding
curl http://localhost:3000
```

## Database Access

To connect to the PostgreSQL database directly:

```bash
# Using docker exec
docker exec -it settly_postgres psql -U settly_user -d settly_db

# Or using a database client with these connection details:
# Host: localhost
# Port: 5432
# Database: settly_db
# Username: settly_user
# Password: admin
```

## Contributing

1. Make your changes in the appropriate directories (`backend/` or `frontend/`)
2. Test locally using Docker Compose
3. The containers will automatically reflect your changes (frontend has hot reload)
4. For API changes, you may need to restart the API container

---

For more detailed information about the application architecture or specific components, please refer to the respective README files in the `backend/` and `frontend/` directories.