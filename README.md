# SettlyAI

AI-powered homebuying assistant built with React and .NET for Australian first-home buyers.

## Backend

The backend is a .NET 8 Web API project located in the `/backend` directory.

### Project Structure

- `Models/`: Contains data models.
  - `User.cs`: A sample user model with the following properties:
    - `Id` (Guid)
    - `FirstName` (string)
    - `LastName` (string)
    - `Email` (string)
- `appsettings.json`: Application settings.
- `Program.cs`: Main application entry point, where API endpoints are defined.
- `backend.csproj`: The C# project file.

### Getting Started

1.  Navigate to the `backend` directory.
2.  Run `dotnet run` to start the application.

## Frontend

The frontend is a React TypeScript application located in the `/frontend` directory.

### Project Structure

- `src/`: Contains the source code.
  - `features/`: Feature modules (auth, dashboard).
  - `pages/`: Page components (ThemeDemo).
  - `redux/`: Redux configuration.
  - `hooks/`: Custom React hooks.
  - `utils/`: Utility functions.
  - `styles/`: Theme and styling.
  - `assets/`: Static assets.
  - `app.tsx`: Root application component.
  - `main.tsx`: Application entry point.
- `package.json`: Node.js project file.
- `vite.config.ts`: Vite build configuration.

### Getting Started

1.  Navigate to the `frontend` directory.
2.  Run `pnpm install` to install dependencies.
3.  Run `pnpm run dev` to start the development server.
