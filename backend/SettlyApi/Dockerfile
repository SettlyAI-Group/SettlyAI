FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# COPY 整个 backend 文件夹到容器的 /app/backend
COPY . ./backend

# 还原
WORKDIR /app/backend
RUN dotnet restore backend.sln

# 编译发布 SettlyApi 项目
WORKDIR /app/backend/SettlyApi
RUN dotnet publish -c Release -o /publish/api

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "SettlyApi.dll"]