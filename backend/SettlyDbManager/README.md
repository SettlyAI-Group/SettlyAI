# SettlyAI Database Manager

简单的数据库管理工具，用于生成测试数据。

> **注意**: 所有命令都从 `SettlyAI` 根目录开始执行

## 🚀 快速开始

### 1. 配置数据库连接

```bash
cd backend/SettlyDbManager
cp appsettings.Development.json.example appsettings.Development.json
```

然后编辑 `appsettings.Development.json` 修改数据库连接信息。

### 2. 运行数据库迁移

```bash
cd ../SettlyModels
dotnet ef migrations add InitialCreate --startup-project ../SettlyApi
dotnet ef database update --startup-project ../SettlyApi
```

### 3. 生成测试数据

```bash
cd ../SettlyDbManager
dotnet run --seed      # 生成完整测试数据
dotnet run --suburbs   # 重新生成 suburb 数据
dotnet run --clear     # 清空所有数据
```

## 🔄 升级现有数据库

如果你已经有现有的数据库，请按以下步骤升级：

```bash
# 1. 拉取最新代码
git pull

# 2. 重新生成迁移
cd backend/SettlyModels
dotnet ef migrations add InitialCreate --startup-project ../SettlyApi
dotnet ef database update --startup-project ../SettlyApi

# 3. 清空并重新设置数据库
cd ../SettlyDbManager
dotnet run --clear    # 清空数据
dotnet run --seed     # 重新生成数据
```

## 📁 项目结构

```
SettlyAI/
├── backend/
│   ├── SettlyDbManager/             # 数据库管理工具
│   │   ├── DataSeeder.cs            # 数据生成器
│   │   ├── Program.cs               # 入口点
│   │   ├── appsettings.json         # 配置文件
│   │   ├── Data/
│   │   │   └── victoria_suburbs_sorted.csv  # 维多利亚州郊区数据 (2,928 条)
│   │   └── Utils/
│   │       └── RealisticDataGenerator.cs    # 符合客观事实的 mock 数据生成器
│   ├── SettlyModels/                # 数据模型和迁移
│   ├── SettlyApi/                   # API 项目
│   └── SettlyService/               # 业务逻辑服务
└── frontend/                        # 前端项目
```

## 📊 数据内容

-   **2,928 个维多利亚州郊区** (来自 CSV 文件)
-   **关联的 realistic 数据**: 房价、人口、基础设施等，符合客观事实的关联性

## ⚠️ 注意事项

-   确保 PostgreSQL 数据库正在运行
-   确保数据库 `settly` 已创建
-   首次运行前必须先执行数据库迁移
-   升级时推荐使用 `--clean` 命令清空并重新设置
