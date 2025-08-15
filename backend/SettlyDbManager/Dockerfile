FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . ./backend

WORKDIR /app/backend
RUN dotnet restore backend.sln

WORKDIR /app/backend/SettlyDbManager
RUN dotnet publish -c Release -o /publish/dbmanager

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish/dbmanager .
ENTRYPOINT ["dotnet", "SettlyDbManager.dll"]