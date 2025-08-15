# backend/SettlyApi/Dockerfile

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 复制项目本身和依赖的模型层
COPY SettlyApi/ ./SettlyApi/
COPY SettlyModels/ ./SettlyModels/

# 还原依赖
WORKDIR /app/SettlyApi
RUN dotnet restore

# 发布
RUN dotnet publish -c Release -o /publish/api

# 运行时镜像
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /publish/api .
ENTRYPOINT ["dotnet", "SettlyApi.dll"]