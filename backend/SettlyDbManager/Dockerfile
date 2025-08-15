FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY SettlyDbManager/ ./SettlyDbManager/
COPY SettlyModels/ ./SettlyModels/

WORKDIR /app/SettlyDbManager
RUN dotnet restore

RUN dotnet publish -c Release -o /publish/dbmanager

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish/dbmanager .
ENTRYPOINT ["dotnet", "SettlyDbManager.dll"]