# RegistrationPage 测试设计文档

## 项目测试框架

- **测试运行器**: Vitest
- **组件测试**: @testing-library/react
- **DOM 断言**: @testing-library/jest-dom
- **用户交互**: @testing-library/user-event
- **Mock 库**: vitest (内置)

## 组件结构分析

```
RegistrationPage/
├── RegistrationPage.tsx          # 主页面组件
├── Components/
│   ├── RegistrationIntro/        # 介绍区域
│   └── RegistrationForm/         # 表单组件 (核心)
└── TESTING.md                    # 本文档
```

## 测试计划

### 1. RegistrationPage.test.tsx

**测试目标**: 主页面组件集成测试
**优先级**: 中

#### 测试用例
- [ ] 页面正确渲染
- [ ] FormPageContainer 组件存在
- [ ] RegistrationIntro 组件渲染
- [ ] RegistrationForm 组件渲染
- [ ] 页面布局结构正确

---

### 2. RegistrationIntro.test.tsx

**测试目标**: 静态内容和导航功能
**优先级**: 低

#### 测试用例
- [ ] 标题文本渲染正确
  - "Welcome to Settly AI" 显示
  - "Settly AI" 部分使用主色调
- [ ] 描述文字渲染
- [ ] "Back to Log in" 链接
  - 链接存在且指向 `/login`
  - ArrowBackIcon 图标显示
  - 悬停样式效果
- [ ] 组件样式和布局

---

### 3. RegistrationForm.test.tsx

**测试目标**: 表单验证、用户交互、API 集成
**优先级**: 高

#### 3.1 表单渲染测试
- [ ] 表单标题 "Get Started for Free"
- [ ] 表单描述文字
- [ ] 所有输入字段渲染
  - [ ] Full Name 字段
  - [ ] Email 字段
  - [ ] Password 字段
  - [ ] Confirm Password 字段
- [ ] Terms 复选框
- [ ] "Create Account" 按钮
- [ ] 社交登录按钮区域
- [ ] "Already have an account" 链接

#### 3.2 表单验证测试
- [ ] **必填字段验证**
  - [ ] 空的 Full Name 显示错误
  - [ ] 空的 Email 显示错误
  - [ ] 空的 Password 显示错误
  - [ ] 空的 Confirm Password 显示错误

- [ ] **邮箱验证**
  - [ ] 无效邮箱格式显示错误
  - [ ] 有效邮箱通过验证

- [ ] **密码强度验证**
  - [ ] 少于8字符显示错误
  - [ ] 超过100字符显示错误
  - [ ] 缺少大写字母显示错误
  - [ ] 缺少小写字母显示错误
  - [ ] 缺少数字显示错误
  - [ ] 缺少特殊字符显示错误
  - [ ] 满足所有条件通过验证

- [ ] **密码确认验证**
  - [ ] 两次密码不匹配显示错误
  - [ ] 两次密码匹配通过验证

- [ ] **服务条款验证**
  - [ ] 未勾选条款显示错误
  - [ ] 勾选条款通过验证

#### 3.3 用户交互测试
- [ ] **表单输入交互**
  - [ ] 用户可以输入 Full Name
  - [ ] 用户可以输入 Email
  - [ ] 用户可以输入 Password
  - [ ] 用户可以输入 Confirm Password
  - [ ] 用户可以勾选 Terms 复选框

- [ ] **密码强度显示**
  - [ ] Password 字段 focus 时显示密码强度
  - [ ] Password 字段 blur 时隐藏密码强度
  - [ ] 密码强度组件正确渲染

- [ ] **表单提交**
  - [ ] 有效数据可以提交
  - [ ] 无效数据阻止提交
  - [ ] 提交时显示 loading 状态

#### 3.4 API 集成测试
- [ ] **成功注册流程**
  - [ ] Mock registerUser API 成功响应
  - [ ] 成功后导航到 `/verify-email`
  - [ ] 成功后重置表单

- [ ] **邮箱冲突处理**
  - [ ] Mock 409 错误响应
  - [ ] 显示 "This email has already been registered" 错误
  - [ ] 错误信息正确定位到 email 字段

- [ ] **网络错误处理**
  - [ ] Mock 一般网络错误
  - [ ] 显示 "Registration failed, please try again later" 错误
  - [ ] 错误信息显示在 root 级别

- [ ] **加载状态**
  - [ ] 提交时按钮禁用
  - [ ] 显示 CircularProgress 组件
  - [ ] 加载完成后恢复正常状态

## Mock 策略

### 必需的 Mocks
```typescript
// React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}))

// API 调用
vi.mock('@/api/authApi', () => ({
  registerUser: vi.fn()
}))

// React Query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn()
}))
```

### 可选的 Mocks
- FormInput 组件 (如果过于复杂)
- FormCheckbox 组件 (如果过于复杂)
- SocialLoginButtons 组件
- PasswordStrength 组件

## 测试实现进度

### 完成状态
- [ ] RegistrationPage.test.tsx (0/5)
- [x] RegistrationIntro.test.tsx (6/6) ✅
- [ ] RegistrationForm.test.tsx (0/25)
- [x] PasswordStrength.test.tsx (37/37) ✅
- [x] FormInput.test.tsx (27/27) ✅

### 总体进度: 70/100 (70.0%)

## 测试运行命令

```bash
# 运行所有测试
npm run test

# 监视模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test RegistrationPage
```

## 测试设计原则

### 1. 渲染测试（Rendering）
- **快照测试**: 确认组件初始渲染的结构和样式没有意外变化
- **必填 props**: 传入最小必要 props 时是否能正常渲染  
- **不同 props 场景**: 例如按钮的 disabled、loading、variant 等不同值下的渲染
- **条件渲染**: 组件在不同条件下（如空数据、loading、error 状态）渲染正确的 UI

### 2. 交互行为测试（Interaction）
- **事件触发**: 按钮点击、输入框输入、复选框切换、表单提交等
- **状态更新**: 交互后组件内部 state 是否变化，UI 是否更新
- **回调函数调用**: 点击按钮是否调用了 onClick，输入是否触发了 onChange

### 3. 边界情况（Edge Cases）
- **空数据处理**: 只测试 null、undefined、空字符串
- **超长文本、特殊字符**
- **错误输入**: 例如必填表单未填

### 4. 不测试的内容
- **可访问性（Accessibility）**: 不测试 ARIA 属性、键盘导航、屏幕阅读器支持
- **Props Forwarding**: 不测试属性传递给子组件的功能
- **Input Types**: 不测试不同 input type 的基础功能
- **组件样式**: 不测试 CSS 样式和视觉呈现

## 注意事项

1. **优先级**: 先实现 RegistrationForm 测试，它是最核心的功能
2. **Mock 策略**: 根据实际需要选择 mock 的组件，避免过度 mock
3. **用户体验**: 重点测试用户真实使用场景
4. **边界情况**: 确保覆盖所有验证规则和错误场景
5. **API 集成**: 测试所有可能的 API 响应情况
6. **测试层级**: 遵循渲染→交互→边界→可访问性的测试优先级

## 配置调整记录

### Vitest 配置优化
为了避免 Storybook 测试的浏览器依赖问题，进行了以下调整：

1. **`.storybook/main.ts`**: 注释掉 `@storybook/addon-vitest`
2. **`vite.config.ts`**: 
   - 简化测试配置，移除 Storybook 相关的 projects 配置
   - 添加 `exclude: ['**/*.stories.*']` 排除 Storybook 文件
   - 保持 `environment: 'jsdom'` 用于单元测试
3. **保持原有方式**: 每个测试文件单独导入 `@testing-library/jest-dom`

### 测试脚本
```json
{
  "test": "vitest run",              // 运行所有测试
  "test:watch": "vitest",            // 监听模式  
  "test:ui": "vitest --ui",          // 图形化界面
  "test:coverage": "vitest run --coverage" // 覆盖率报告
}
```

## 更新日志

- **2025-08-21**: 初始测试设计文档创建
- **2025-08-21**: RegistrationIntro.test.tsx 完成 (6/6 测试通过)
- **2025-08-21**: 优化 Vitest 配置，移除 Storybook 测试依赖
- **2025-08-21**: PasswordStrength.test.tsx 完成 (37/37 测试通过) - 包含纯函数测试和组件渲染测试
- **2025-08-21**: FormInput.test.tsx 完成 (27/27 测试通过) - React Hook Form 集成、验证规则、用户交互测试