# 数据库初始化脚本

## 使用方法

### 配置变量

在运行脚本前，需要修改脚本顶部的配置变量：

```bash
# 编辑脚本
vim scripts/init-database.sh

# 修改以下变量：
ECR_REGISTRY="your-ecr-registry-url"
DB_HOST="your-db-host"
DB_PORT="5432"
DB_NAME="your-db-name"
DB_USER="your-db-user"
DB_PASSWORD="your-db-password"
```

### 运行脚本

```bash
# 执行完整初始化（迁移 + 种子数据）
./scripts/init-database.sh

# 只执行数据库迁移
./scripts/init-database.sh --migrate-only

# 只执行数据库种子
./scripts/init-database.sh --seed-only

# 查看帮助
./scripts/init-database.sh --help
```

### 在CI/CD中使用

如果需要在CI/CD中使用，可以先用sed命令替换变量：

```yaml
- name: Configure and run database init
  env:
    ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
    DB_HOST: ${{ secrets.DB_HOST }}
    DB_PORT: ${{ secrets.DB_PORT }}
    DB_NAME: ${{ secrets.DB_NAME }}
    DB_USER: ${{ secrets.DB_USER }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  run: |
    sed -i \
      -e "s|your-ecr-registry-url|$ECR_REGISTRY|g" \
      -e "s|your-db-host|$DB_HOST|g" \
      -e "s|5432|$DB_PORT|g" \
      -e "s|your-db-name|$DB_NAME|g" \
      -e "s|your-db-user|$DB_USER|g" \
      -e "s|your-db-password|$DB_PASSWORD|g" \
      scripts/init-database.sh
    ./scripts/init-database.sh
```