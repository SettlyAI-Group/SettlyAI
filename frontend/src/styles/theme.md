# MUI Theme 快速参考指南

> Material-UI v7.2.0 主题系统访问路径速查表

## 🎨 调色板 (Palette)

### 主要颜色

```typescript
// 主色调
theme.palette.primary.light; // 浅色变体 (alpha 0.5 的 #7B61FF)
theme.palette.primary.main; // #7B61FF
theme.palette.primary.dark; // 深色变体 (darken 0.2 的 #7B61FF)
theme.palette.primary.contrastText; // #fff 或 #111 (根据对比度自动计算)

// 次要色调
theme.palette.secondary.light; // 浅色变体 (alpha 0.5 的 #4F88F7)
theme.palette.secondary.main; // #4F88F7
theme.palette.secondary.dark; // 深色变体 (darken 0.2 的 #4F88F7)
theme.palette.secondary.contrastText; // #fff 或 #111 (根据对比度自动计算)
```

### 语义颜色

```typescript
// 错误色
theme.palette.error.light; // 浅色变体 (alpha 0.5 的 #FF0000)
theme.palette.error.main; // #FF0000
theme.palette.error.dark; // 深色变体 (darken 0.2 的 #FF0000)

// 警告色
theme.palette.warning.light; // 浅色变体 (alpha 0.5 的 #E67E22)
theme.palette.warning.main; // #E67E22
theme.palette.warning.dark; // 深色变体 (darken 0.2 的 #E67E22)

// 信息色
theme.palette.info.light; // 浅色变体 (alpha 0.5 的 #22D3EE)
theme.palette.info.main; // #22D3EE
theme.palette.info.dark; // 深色变体 (darken 0.2 的 #22D3EE)

// 成功色
theme.palette.success.light; // 浅色变体 (alpha 0.5 的 #10B981)
theme.palette.success.main; // #10B981
theme.palette.success.dark; // 深色变体 (darken 0.2 的 #10B981)
```

### 通用颜色

```typescript
// 基础色
theme.palette.common.black; // #000
theme.palette.common.white; // #fff

// 背景色
theme.palette.background.default; // #F8F9FB
theme.palette.background.paper; // #ffffff

// 文本色
theme.palette.text.primary; // #1F2937
theme.palette.text.secondary; // #4B5563
theme.palette.text.disabled; // #8C8D8B

// 分割线
theme.palette.divider; // #E5E7EB
```

## 📝 字体排版 (Typography)

### 标题样式

```typescript
// 根据设计规格的标题样式
theme.typography.h1; // 48px, 700 字重, 48px 行高
theme.typography.h2; // 48px, 400 字重, 60px 行高
theme.typography.h3; // 36px, 400 字重, 40px 行高
theme.typography.h4; // 24px, 700 字重, 30.46px 行高
theme.typography.h5; // 20px, 600 字重, 28px 行高
```

### 正文样式

```typescript
// 根据设计规格的文本样式
theme.typography.subtitle1; // 18px, 400 字重, 27.57px 行高
theme.typography.subtitle2; // 16px, 400 字重, 22px 行高
theme.typography.body1; // 14px, 400 字重, 20px 行高
theme.typography.body2; // 12px, 400 字重, 13.54px 行高
```

## 📏 间距系统 (Spacing)

### 基础间距

```typescript
theme.spacing(0); // 0px
theme.spacing(1); // 4px
theme.spacing(2); // 8px
theme.spacing(3); // 12px
theme.spacing(4); // 16px
theme.spacing(5); // 20px
theme.spacing(6); // 24px
theme.spacing(7); // 28px
theme.spacing(8); // 32px
```

### 多参数用法

```typescript
theme.spacing(1, 2); // "4px 8px"
theme.spacing(1, 2, 3); // "4px 8px 12px"
theme.spacing(1, 2, 3, 4); // "4px 8px 12px 16px"
theme.spacing(1, 'auto'); // "4px auto"
```

## 📱 断点 (Breakpoints)

### 断点函数

```typescript
theme.breakpoints.up('sm'); // @media (min-width:600px)
theme.breakpoints.down('md'); // @media (max-width:899.95px)
theme.breakpoints.between('sm', 'lg'); // @media (min-width:600px) and (max-width:1199.95px)
theme.breakpoints.only('md'); // @media (min-width:900px) and (max-width:1199.95px)
```

## 🎭 阴影 (Shadows)

```typescript
theme.shadows[0]; // "none"
theme.shadows[1]; // "0px 2px 1px -1px rgba(0,0,0,0.2)..."
theme.shadows[2]; // "0px 3px 1px -2px rgba(0,0,0,0.2)..."
theme.shadows[3]; // "0px 3px 3px -2px rgba(0,0,0,0.2)..."
// ... 继续到 theme.shadows[24]
```

## 📚 层级 (Z-Index)

```typescript
theme.zIndex.mobileStepper; // 1000
theme.zIndex.speedDial; // 1050
theme.zIndex.appBar; // 1100
theme.zIndex.drawer; // 1200
theme.zIndex.modal; // 1300
```

## 💡 常用示例

### 在 sx 属性中使用

```typescript
<Box sx={{
  color: 'primary.main', // #7B61FF
  bgcolor: 'background.paper', // #ffffff
  p: theme.spacing(2), // 8px
  borderRadius: theme.shape.borderRadius, // 4px
  [theme.breakpoints.up('md')]: {
    p: theme.spacing(3), // 12px
  }
}} />
```

### 在 styled 组件中使用

```typescript
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), // 8px
  backgroundColor: theme.palette.background.paper, // #ffffff
  color: theme.palette.text.primary, // #1F2937
  borderRadius: theme.shape.borderRadius, // 4px

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3), // 12px
  },

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1), // 带10%透明度的 #7B61FF
  },
}));
```

### 在 useTheme Hook 中使用

```typescript
import { useTheme } from '@mui/material/styles'

function MyComponent() {
  const theme = useTheme()

  return (
    <div style={{
      padding: theme.spacing(2), // 8px
      color: theme.palette.primary.main, // #7B61FF
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3), // 12px
      }
    }}>
      Content
    </div>
  )
}
```

---

## 📖 相关文档

- [MUI 主题定制](https://mui.com/material-ui/customization/theming/)
- [调色板配置](https://mui.com/material-ui/customization/palette/)
- [字体排版](https://mui.com/material-ui/customization/typography/)
- [响应式设计](https://mui.com/material-ui/customization/breakpoints/)
- [间距系统](https://mui.com/material-ui/customization/spacing/)
