# backend/SettlyDbManager/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . ../

WORKDIR /app/../
RUN dotnet restore backend.sln

WORKDIR /app/SettlyDbManager
RUN dotnet publish -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "SettlyDbManager.dll"]