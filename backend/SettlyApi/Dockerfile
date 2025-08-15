# backend/SettlyApi/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# 拷贝整个 backend 文件夹内容（因为此 Dockerfile 在 SettlyApi 目录中，上下文就是 backend）
COPY . ../

# 还原所有项目依赖
WORKDIR /app/../
RUN dotnet restore backend.sln

# 发布 SettlyApi
WORKDIR /app/SettlyApi
RUN dotnet publish -c Release -o /publish

# 运行容器
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "SettlyApi.dll"]