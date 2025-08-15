# backend/SettlyDbManager/Dockerfile

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 复制项目本身和依赖的模型层
COPY SettlyDbManager/ ./SettlyDbManager/
COPY SettlyModels/ ./SettlyModels/

# 还原依赖
WORKDIR /app/SettlyDbManager
RUN dotnet restore

# 发布
RUN dotnet publish -c Release -o /publish/dbmanager

# 运行时镜像
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish/dbmanager .
ENTRYPOINT ["dotnet", "SettlyDbManager.dll"]