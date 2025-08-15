FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY SettlyApi/ ./SettlyApi/
COPY SettlyModels/ ./SettlyModels/
COPY ISettlyService/ ./ISettlyService/
COPY SettlyService/ ./SettlyService/

WORKDIR /app/SettlyApi
RUN dotnet restore
RUN dotnet publish -c Release -o /publish/api

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish/api .
ENTRYPOINT ["dotnet", "SettlyApi.dll"]