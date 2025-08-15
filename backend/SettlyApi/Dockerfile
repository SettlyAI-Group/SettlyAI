FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . ./backend

WORKDIR /app/backend
RUN dotnet restore backend.sln

WORKDIR /app/backend/SettlyApi
RUN dotnet publish -c Release -o /publish/api

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish/api .
ENTRYPOINT ["dotnet", "SettlyApi.dll"]