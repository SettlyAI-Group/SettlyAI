# SettlyAI Backend

A .NET 8 Web API solution for SettlyAI, a suburb analysis application that provides comprehensive property market insights and analysis tools.

## Project Structure

This solution consists of four main projects:

- **SettlyApi**: ASP.NET Core Web API project (main entry point)
- **SettlyModels**: Entity Framework models and database context
- **SettlyDbManager**: Console application for database operations
- **ISettlyService**: Interface definitions for services
- **SettlyService**: Service implementations (placeholder)

## Quick Start

### Prerequisites

- .NET 8 SDK
- PostgreSQL database
- Visual Studio, VS Code, or Rider (recommended)

### Quick Setup using docker
You can use the following command to start the bakend service using docker containers quickly (including conneting to postgres db, db-migration, db-seed)
```bash
 cd backend
 docker compose build
 docker compose up
```

### Setup

1. **Clone and restore packages**
   ```bash
   git clone <repository-url>
   cd backend
   dotnet restore backend.sln
   ```

2. **Configure database connection**

   Copy the example configuration files and update with your database settings:
   ```bash
   # Copy API configuration
   cp SettlyApi/appsettings.Development.json.example SettlyApi/appsettings.Development.json

   # Copy database manager configuration
   cp SettlyDbManager/appsettings.Development.json.example SettlyDbManager/appsettings.Development.json
   ```

   Then update both files with your PostgreSQL connection details:
   ```json
   {
     "ApiConfigs": {
       "DBConnection": "Host=localhost;Port=5432;Database=settly;User Id=your_username;Password=your_password;Include Error Detail=true"
     }
   }
   ```

3. **Set up database**
   ```bash
   # Create and apply migrations
   cd SettlyModels
   dotnet ef migrations add InitialCreate --startup-project ../SettlyApi
   dotnet ef database update --startup-project ../SettlyApi
   ```

4. **Generate sample data (optional)**
   ```bash
   cd ../SettlyDbManager
   ASPNETCORE_ENVIRONMENT=Development dotnet run -- --seed
   ```

5. **Run the API**
   ```bash
   cd ../SettlyApi
   dotnet run
   ```

The API will be available at `http://localhost:5100`.

## Database Management

### Database Operations

Use the `SettlyDbManager` console application for database operations:

```bash
cd SettlyDbManager

# Generate fake data for development
ASPNETCORE_ENVIRONMENT=Development dotnet run -- --seed

# Clear all data and generate new fake data
ASPNETCORE_ENVIRONMENT=Development dotnet run -- --reset-seed

# Show help
dotnet run -- --help
```

### Database Migrations

Migrations are managed through Entity Framework Core:

```bash
cd SettlyModels

# Add new migration
dotnet ef migrations add <MigrationName> --startup-project ../SettlyApi

# Update database
dotnet ef database update --startup-project ../SettlyApi

# Remove last migration (if not applied)
dotnet ef migrations remove --startup-project ../SettlyApi
```

## Database Schema

### Core Entities

- **User**: User accounts and authentication
- **Suburb**: Australian suburb information (name, state, postcode)
- **Property**: Individual property listings with details
- **SuperFund**: Superannuation fund information and performance data

### Analytics Entities

- **HousingMarket**: Market analytics (median prices, rental yields, growth rates)
- **IncomeEmployment**: Employment and income statistics by suburb
- **PopulationSupply**: Population demographics and housing supply data
- **Livability**: Lifestyle scores (transport, schools, amenities)
- **RiskDevelopment**: Safety metrics and development projects
- **SettlyAIScore**: AI-generated affordability and growth potential scores

### User Features

- **Favourite**: User-saved properties
- **InspectionPlan**: Scheduled property inspections
- **LoanCalculation**: Mortgage calculations and stress testing
- **ChatLog**: AI chat conversation history
- **SuperProjection**: Superannuation projection calculations and insights

## API Endpoints

Currently available endpoints:

*API endpoints will be added as business logic is implemented.*

## Development Workflow

1. **Database Changes**
   - Modify entities in `SettlyModels/Entities/`
   - Add new migration: `dotnet ef migrations add <Name> --startup-project ../SettlyApi`
   - Update database: `dotnet ef database update --startup-project ../SettlyApi`

2. **API Development**
   - Add controllers in `SettlyApi/Controllers/`
   - Implement business logic in `SettlyService/`
   - Define interfaces in `ISettlyService/`

3. **Data Generation**
   - Use `SettlyDbManager` to generate test data
   - Modify `DataSeeder.cs` to adjust fake data generation

4. **Testing**
   - Run API: `cd SettlyApi && dotnet run`
   - Test endpoints: Use `backend.http` file or Postman
   - Generate fresh data: `cd SettlyDbManager && dotnet run -- --reset-seed`

5. **Unit Test**
   - run test
   ```bash
   dotnet test
   ```
   - clean & build if has issues
   ```bash
      dotnet clean
      dotnet build
   ```
6. **Format**
```bash
dotnet format
```

## Architecture Notes

- **Layered Architecture**: Clear separation between API, business logic, and data layers
- **Entity Framework Core**: Code-first approach with PostgreSQL
- **Dependency Injection**: Standard ASP.NET Core DI container
- **Configuration**: Environment-specific settings with `appsettings.json`
- **Fake Data Generation**: Bogus library for realistic Australian property data

## Environment Configuration

### Development
- Database logging enabled with sensitive data
- Detailed error messages
- Fake data generation available

### Production
- Optimized logging
- Error handling without sensitive information
- Data reset operations disabled

## Known Issues

- DbSet naming inconsistency: `SuburbReport` entity mapped to `Users` table
- Table mapping: `Suburb` maps to "Teachers" table (legacy naming)

These will be addressed in future database migrations.

## Contributing

1. Follow the existing code conventions
2. Update migrations for entity changes
3. Test with sample data using `SettlyDbManager`
4. Ensure all projects build successfully

## License

[Add your license information here]
