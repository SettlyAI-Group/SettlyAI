# SettlyAI

AI-powered homebuying assistant built with React and .NET for Australian first-home buyers.

## Backend

The backend is a .NET 8 Web API project located in the `/backend` directory.

### Project Structure

-   `Models/`: Contains data models.
    -   `User.cs`: A sample user model with the following properties:
        -   `Id` (Guid)
        -   `FirstName` (string)
        -   `LastName` (string)
        -   `Email` (string)
-   `appsettings.json`: Application settings.
-   `Program.cs`: Main application entry point, where API endpoints are defined.
-   `backend.csproj`: The C# project file.

### Getting Started

1.  Navigate to the `backend` directory.
2.  Run `dotnet run` to start the application.
