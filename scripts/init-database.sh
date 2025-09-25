#!/usr/bin/env bash
set -euo pipefail

# 云端数据库初始化脚本
# 用法: ./init-database.sh [--migrate-only|--seed-only]

# ========== 配置变量 ==========
# 请根据你的云端数据库信息修改以下变量
DB_HOST=""                # 云端数据库主机地址
DB_PORT="5432"                        # 数据库端口
DB_NAME="settlyai"                # 数据库名称
DB_USER="dbadmin"                # 数据库用户名
DB_PASSWORD="your-db-password"        # 数据库密码
# ================================

# 默认参数
MIGRATE=true
SEED=true

# 解析命令行参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --migrate-only)
      SEED=false
      shift
      ;;
    --seed-only)
      MIGRATE=false
      shift
      ;;
    -h|--help)
      echo "用法: $0 [--migrate-only|--seed-only]"
      echo "  --migrate-only  只执行数据库迁移"
      echo "  --seed-only     只执行数据库种子"
      echo "  无参数          执行迁移和种子"
      exit 0
      ;;
    *)
      echo "未知参数: $1"
      exit 1
      ;;
  esac
done

# 检查必需的变量
if [[ "$DB_HOST" == "your-db-host" || "$DB_NAME" == "your-db-name" || "$DB_USER" == "your-db-user" ]]; then
  echo "错误: 请先修改脚本中的云端数据库配置变量"
  echo "需要修改脚本顶部的: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD"
  exit 1
fi

# 构建连接字符串
DB_CONNECTION="Host=${DB_HOST};Port=${DB_PORT};Database=${DB_NAME};User Id=${DB_USER};Password=${DB_PASSWORD}"

echo "=== 云端数据库初始化开始 ==="
echo "目标数据库: ${DB_HOST}:${DB_PORT}/${DB_NAME}"

# 设置环境变量
export ApiConfigs__DBConnection="$DB_CONNECTION"
export ASPNETCORE_ENVIRONMENT=Development

# 检查和设置.NET SDK路径
DOTNET_PATH=""
if command -v dotnet >/dev/null 2>&1; then
  DOTNET_PATH="dotnet"
elif [ -f "/opt/homebrew/bin/dotnet" ]; then
  DOTNET_PATH="/opt/homebrew/bin/dotnet"
  export PATH="/opt/homebrew/bin:$PATH"
elif [ -f "/opt/homebrew/Cellar/dotnet@8/8.0.120/bin/dotnet" ]; then
  DOTNET_PATH="/opt/homebrew/Cellar/dotnet@8/8.0.120/bin/dotnet"
  export PATH="/opt/homebrew/Cellar/dotnet@8/8.0.120/bin:$PATH"
else
  echo "错误: 未找到dotnet命令"
  echo "请安装.NET SDK:"
  echo "  macOS: brew install dotnet@8"
  echo "  或访问: https://dotnet.microsoft.com/download"
  exit 1
fi

echo "使用.NET版本: $($DOTNET_PATH --version)"
echo "dotnet路径: $DOTNET_PATH"

# 添加.NET工具目录到PATH
export PATH="$PATH:/Users/elliott/.dotnet/tools"

# 检查和安装Entity Framework工具
if ! $DOTNET_PATH tool list -g | grep -q "dotnet-ef"; then
  echo "=== 安装Entity Framework工具 ==="
  $DOTNET_PATH tool install --global dotnet-ef
  echo "EF工具安装完成，已添加到PATH"
else
  echo "Entity Framework工具已安装"
fi

# 获取脚本所在目录和backend目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../backend"

echo "调试信息:"
echo "  脚本目录: $SCRIPT_DIR"
echo "  Backend目录: $BACKEND_DIR"
echo "  当前目录: $(pwd)"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "错误: 找不到backend目录: $BACKEND_DIR"
  echo "可用目录:"
  ls -la "$SCRIPT_DIR/.."
  exit 1
fi

# 执行数据库迁移
if [[ "$MIGRATE" == "true" ]]; then
  echo "=== 执行数据库迁移 ==="
  cd "$BACKEND_DIR/SettlyModels"
  $DOTNET_PATH ef database update --startup-project ../SettlyApi
  echo "✅ 数据库迁移完成"
fi

# 执行数据库种子
if [[ "$SEED" == "true" ]]; then
  echo "=== 执行数据库种子 ==="
  cd "$BACKEND_DIR/SettlyDbManager"
  $DOTNET_PATH run -- --seed
  echo "✅ 数据库种子完成"
fi

echo "=== 云端数据库初始化完成 ==="