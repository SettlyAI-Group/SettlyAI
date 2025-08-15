FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
# 进入具体的子项目目录（这是关键）
WORKDIR /src/SettlyDbManager
# 安装缺失的 NuGet 包（不改源代码）
RUN dotnet add package Bogus --version 34.0.2

RUN dotnet restore
RUN dotnet build --no-restore

CMD ["dotnet", "run"]