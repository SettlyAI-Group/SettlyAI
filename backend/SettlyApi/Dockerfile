FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . ./
# 可选：恢复依赖（提高构建缓存命中率）
RUN dotnet restore
# 运行应用（使用 docker-compose 的 command 覆盖此项）
CMD ["dotnet", "run"]