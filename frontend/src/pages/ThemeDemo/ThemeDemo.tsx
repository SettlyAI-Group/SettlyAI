import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

// 使用styled API创建样式化组件示例 - 这些是实际使用的组件
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

// 自定义标题组件
const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

// 颜色卡片组件
const ColorCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

// 代码块组件
const CodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  margin: `${theme.spacing(2)} 0`,
  overflowX: 'auto',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  whiteSpace: 'pre-wrap',
}));

// 示例卡片组件，用于展示阴影
const ShadowCard = styled(Paper)<{ elevation: number }>(
  ({ theme, elevation }) => ({
    padding: theme.spacing(3),
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: theme.shadows[elevation],
  })
);

/**
 * 主题演示组件
 * 展示当前主题并演示两种样式应用方法
 */
const ThemeDemo = () => {
  const theme = useTheme();

  // 颜色块组件
  const ColorBlock = ({
    color,
    name,
    code,
  }: {
    color: string;
    name: string;
    code?: string;
  }) => (
    <Box
      sx={{
        width: 80,
        height: 80,
        bgcolor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.getContrastText(color),
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        {name}
      </Typography>
      {code && <Typography variant="caption">{code}</Typography>}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h2" gutterBottom>
        MUI 主题样式指南
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        为了保持一致性和可维护性，我们遵循以下样式规范
      </Typography>

      {/* 强调使用styled API */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <SectionTitle variant="h3">设计系统规范</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>规范1: 优先使用styled API，尽量避免使用sx属性</strong>
          <br />
          sx属性虽然方便快捷，但会导致样式分散在各处，难以维护。而styled
          API创建的组件可重用，且样式集中易于管理。
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <StyledButton variant="contained" color="primary">
            推荐: Styled组件
          </StyledButton>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
              padding: '6px 12px',
            }}
          >
            不推荐: sx属性
          </Button>
        </Stack>

        <CodeBlock>
          {`// 推荐: 使用styled API创建组件
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  fontWeight: 600,
  textTransform: 'none',
}));

// 不推荐: 直接使用sx属性
<Button sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 600 }}>
  按钮
</Button>`}
        </CodeBlock>
      </Paper>

      {/* 字体排版系统 */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <SectionTitle variant="h3">字体排版系统</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          我们已定制了一套完整的Typography变体，从H1到Body2，直接使用即可。无需手动设置字体大小、行高等。
          如需特殊样式（如颜色变化），可在Typography上添加额外样式。
        </Typography>

        <Typography variant="h4" gutterBottom>
          全部Typography变体
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ColorCard>
              <Typography variant="h1" gutterBottom>
                H1: 标题一 ({theme.typography.h1.fontSize} /{' '}
                {theme.typography.h1.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="h1">标题一</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="h2" gutterBottom>
                H2: 标题二 ({theme.typography.h2.fontSize} /{' '}
                {theme.typography.h2.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="h2">标题二</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="h3" gutterBottom>
                H3: 标题三 ({theme.typography.h3.fontSize} /{' '}
                {theme.typography.h3.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="h3">标题三</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="h4" gutterBottom>
                H4: 标题四 ({theme.typography.h4.fontSize} /{' '}
                {theme.typography.h4.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="h4">标题四</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="h5" gutterBottom>
                H5: 标题五 ({theme.typography.h5.fontSize} /{' '}
                {theme.typography.h5.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="h5">标题五</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="subtitle1" gutterBottom>
                Subtitle1: 副标题一 ({theme.typography.subtitle1.fontSize} /{' '}
                {theme.typography.subtitle1.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="subtitle1">副标题一</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="subtitle2" gutterBottom>
                Subtitle2: 副标题二 ({theme.typography.subtitle2.fontSize} /{' '}
                {theme.typography.subtitle2.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="subtitle2">副标题二</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="body1" gutterBottom>
                Body1: 正文一 ({theme.typography.body1.fontSize} /{' '}
                {theme.typography.body1.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="body1">正文一</Typography>`}</CodeBlock>
            </ColorCard>

            <ColorCard>
              <Typography variant="body2" gutterBottom>
                Body2: 正文二 ({theme.typography.body2.fontSize} /{' '}
                {theme.typography.body2.fontWeight})
              </Typography>
              <CodeBlock>{`<Typography variant="body2">正文二</Typography>`}</CodeBlock>
            </ColorCard>
          </Grid>
        </Grid>

        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
          如何添加特殊样式
        </Typography>
        <ColorCard>
          <Typography
            variant="h3"
            color="primary.main"
            fontWeight={700}
            gutterBottom
          >
            带颜色和加粗的H3标题
          </Typography>
          <CodeBlock>{`<Typography 
  variant="h3"
  color="primary.main"
  fontWeight={700}
>
  带颜色和加粗的H3标题
</Typography>`}</CodeBlock>
        </ColorCard>

        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
          使用styled API定制Typography
        </Typography>
        <ColorCard>
          <SectionTitle variant="h3">自定义样式标题</SectionTitle>
          <CodeBlock>{`const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

<SectionTitle variant="h3">自定义样式标题</SectionTitle>`}</CodeBlock>
        </ColorCard>
      </Paper>

      {/* 颜色系统 */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <SectionTitle variant="h3">颜色系统</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>重点:</strong> 每个主题颜色都有三个变体:
          main（主色）、light（浅色）和dark（深色）。
          设计时应合理使用这三种变体来创建层次感和一致性。
        </Typography>

        <Typography variant="h4" gutterBottom>
          主题颜色及其变体
        </Typography>
        <Grid container spacing={3}>
          <Grid size={12}>
            {/* Primary颜色 */}
            <ColorCard>
              <Typography variant="h5" gutterBottom>
                Primary 主色
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <ColorBlock
                  color={theme.palette.primary.light}
                  name="Light"
                  code="primary.light"
                />
                <ColorBlock
                  color={theme.palette.primary.main}
                  name="Main"
                  code="primary.main"
                />
                <ColorBlock
                  color={theme.palette.primary.dark}
                  name="Dark"
                  code="primary.dark"
                />
              </Stack>
              <CodeBlock>{`// 使用主色的三种变体
theme.palette.primary.light  // 浅色变体
theme.palette.primary.main   // 主色
theme.palette.primary.dark   // 深色变体`}</CodeBlock>
            </ColorCard>

            {/* Secondary颜色 */}
            <ColorCard>
              <Typography variant="h5" gutterBottom>
                Secondary 次要色
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <ColorBlock
                  color={theme.palette.secondary.light}
                  name="Light"
                  code="secondary.light"
                />
                <ColorBlock
                  color={theme.palette.secondary.main}
                  name="Main"
                  code="secondary.main"
                />
                <ColorBlock
                  color={theme.palette.secondary.dark}
                  name="Dark"
                  code="secondary.dark"
                />
              </Stack>
            </ColorCard>

            {/* 语义颜色 */}
            <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
              语义颜色
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <ColorCard>
                  <Typography variant="subtitle1" gutterBottom>
                    Error 错误色
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <ColorBlock
                      color={theme.palette.error.light}
                      name="Light"
                      code="error.light"
                    />
                    <ColorBlock
                      color={theme.palette.error.main}
                      name="Main"
                      code="error.main"
                    />
                    <ColorBlock
                      color={theme.palette.error.dark}
                      name="Dark"
                      code="error.dark"
                    />
                  </Stack>
                </ColorCard>
              </Grid>
              <Grid size={6}>
                <ColorCard>
                  <Typography variant="subtitle1" gutterBottom>
                    Warning 警告色
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <ColorBlock
                      color={theme.palette.warning.light}
                      name="Light"
                      code="warning.light"
                    />
                    <ColorBlock
                      color={theme.palette.warning.main}
                      name="Main"
                      code="warning.main"
                    />
                    <ColorBlock
                      color={theme.palette.warning.dark}
                      name="Dark"
                      code="warning.dark"
                    />
                  </Stack>
                </ColorCard>
              </Grid>
              <Grid size={6}>
                <ColorCard>
                  <Typography variant="subtitle1" gutterBottom>
                    Info 信息色
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <ColorBlock
                      color={theme.palette.info.light}
                      name="Light"
                      code="info.light"
                    />
                    <ColorBlock
                      color={theme.palette.info.main}
                      name="Main"
                      code="info.main"
                    />
                    <ColorBlock
                      color={theme.palette.info.dark}
                      name="Dark"
                      code="info.dark"
                    />
                  </Stack>
                </ColorCard>
              </Grid>
              <Grid size={6}>
                <ColorCard>
                  <Typography variant="subtitle1" gutterBottom>
                    Success 成功色
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <ColorBlock
                      color={theme.palette.success.light}
                      name="Light"
                      code="success.light"
                    />
                    <ColorBlock
                      color={theme.palette.success.main}
                      name="Main"
                      code="success.main"
                    />
                    <ColorBlock
                      color={theme.palette.success.dark}
                      name="Dark"
                      code="success.dark"
                    />
                  </Stack>
                </ColorCard>
              </Grid>
            </Grid>

            <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
              在组件中使用颜色
            </Typography>
            <CodeBlock>{`// 在styled组件中使用颜色
const HighlightBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  borderLeft: \`4px solid \${theme.palette.primary.main}\`,
  padding: theme.spacing(2),
}));

// 特殊情况可以使用sx (尽量避免)
<Typography 
  variant="body1" 
  sx={{ color: 'secondary.main' }}
>
  彩色文本
</Typography>`}</CodeBlock>
          </Grid>
        </Grid>
      </Paper>

      {/* 间距系统 */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <SectionTitle variant="h3">间距系统</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          我们的间距系统基于<strong>4px</strong>
          作为基本单位。使用spacing函数可以获得一致的间距值。
        </Typography>

        <Grid container spacing={2}>
          <Grid size={12}>
            <ColorCard>
              <Typography variant="h5" gutterBottom>
                间距单位换算
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>spacing(1) = 4px</li>
                  <li>spacing(2) = 8px</li>
                  <li>spacing(3) = 12px</li>
                  <li>spacing(4) = 16px</li>
                  <li>spacing(5) = 20px</li>
                  <li>... 依此类推</li>
                </ul>
              </Typography>
            </ColorCard>

            <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
              间距演示
            </Typography>
            <Stack direction="row" alignItems="flex-end" sx={{ mb: 3 }}>
              {[1, 2, 3, 4, 5, 6].map(value => (
                <Box
                  key={value}
                  sx={{
                    width: theme.spacing(5),
                    height: theme.spacing(value),
                    backgroundColor: theme.palette.primary.main,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: theme.palette.primary.contrastText,
                    marginRight: 1,
                  }}
                >
                  {value}
                </Box>
              ))}
            </Stack>

            <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
              在styled API中使用间距
            </Typography>
            <CodeBlock>{`const CardComponent = styled(Paper)(({ theme }) => ({
  // 使用间距系统设置内边距和外边距
  padding: theme.spacing(3),        // 12px 的内边距
  margin: theme.spacing(2),         // 8px 的外边距
  marginBottom: theme.spacing(4),   // 16px 的下外边距
  
  // 可以使用数组指定不同方向的内边距 [上, 右, 下, 左]
  padding: theme.spacing(2, 3, 2, 3), // 上下8px, 左右12px
}));`}</CodeBlock>

            <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
              应用场景示例
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <ColorCard sx={{ bgcolor: 'background.paper' }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'primary.light',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      间距为8px (spacing(2))
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: 'secondary.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      间距为12px (spacing(3))
                    </Typography>
                  </Box>
                </ColorCard>
              </Grid>
              <Grid size={6}>
                <ColorCard>
                  <Typography variant="subtitle2" gutterBottom>
                    常用间距场景
                  </Typography>
                  <Typography variant="body2" component="div">
                    <ul>
                      <li>组件内内边距: spacing(2-3) (8-12px)</li>
                      <li>组件间距: spacing(2-4) (8-16px)</li>
                      <li>段落间距: spacing(2) (8px)</li>
                      <li>区块间距: spacing(4-6) (16-24px)</li>
                      <li>页面边距: spacing(4-8) (16-32px)</li>
                    </ul>
                  </Typography>
                </ColorCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* 阴影系统 */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <SectionTitle variant="h3">阴影系统</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          MUI主题提供了25个阴影级别(0-24)，从无阴影(0)到强烈阴影(24)。通过阴影可以创建层次感和深度。
        </Typography>

        <Typography variant="h4" gutterBottom>
          阴影级别演示
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map(elevation => (
            <Grid size={{ xs: 4, sm: 2 }} key={elevation}>
              <ShadowCard elevation={elevation}>
                <Typography variant="body2">{elevation}</Typography>
              </ShadowCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom>
          如何使用阴影
        </Typography>
        <CodeBlock>{`// 方式1: 在Paper或Card组件上使用elevation属性
<Paper elevation={2}>使用阴影级别2</Paper>

// 方式2: 在styled API中使用shadows数组
const CustomBox = styled(Box)(({ theme }) => ({
  boxShadow: theme.shadows[3],
}));

// 方式3: 在sx属性中使用boxShadow (不推荐)
<Box sx={{ boxShadow: 3 }}>阴影级别3</Box>`}</CodeBlock>

        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
          阴影使用场景
        </Typography>
        <ColorCard>
          <Typography variant="body1" component="div">
            <ul>
              <li>
                <strong>elevation 0-1:</strong> 平面元素，卡片分隔
              </li>
              <li>
                <strong>elevation 2-4:</strong> 悬浮元素，按钮，下拉菜单
              </li>
              <li>
                <strong>elevation 6-8:</strong> 对话框，弹出窗口
              </li>
              <li>
                <strong>elevation 12-16:</strong> 抽屉，侧边栏
              </li>
              <li>
                <strong>elevation 24:</strong> 模态框，最高层级元素
              </li>
            </ul>
          </Typography>
        </ColorCard>
      </Paper>

      {/* Z-Index系统 */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <SectionTitle variant="h3">Z-Index层级系统</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Z-Index控制元素在垂直方向上的堆叠顺序。MUI主题提供了预设的Z-Index值，以确保组件间的正确堆叠。
        </Typography>

        <Typography variant="h4" gutterBottom>
          Z-Index预设值
        </Typography>
        <ColorCard>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body1" component="div">
                <ul>
                  <li>
                    <strong>mobileStepper:</strong> {theme.zIndex.mobileStepper}
                  </li>
                  <li>
                    <strong>speedDial:</strong> {theme.zIndex.speedDial}
                  </li>
                  <li>
                    <strong>appBar:</strong> {theme.zIndex.appBar}
                  </li>
                </ul>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body1" component="div">
                <ul>
                  <li>
                    <strong>drawer:</strong> {theme.zIndex.drawer}
                  </li>
                  <li>
                    <strong>modal:</strong> {theme.zIndex.modal}
                  </li>
                  <li>
                    <strong>snackbar:</strong> {theme.zIndex.snackbar}
                  </li>
                  <li>
                    <strong>tooltip:</strong> {theme.zIndex.tooltip}
                  </li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </ColorCard>

        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
          在组件中使用Z-Index
        </Typography>
        <CodeBlock>{`// 在styled API中使用Z-Index
const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: theme.zIndex.speedDial, // 使用预设值
}));

// 创建相对于MUI层级的自定义Z-Index
const CustomOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.modal - 1, // 在modal下方但在其他元素上方
}));`}</CodeBlock>

        <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
          层级使用规范
        </Typography>
        <Typography variant="body1">
          为保持一致性，应尽量使用主题提供的Z-Index值。如需自定义值，应相对于主题值设置，
          避免使用任意的大数值如9999，这会破坏系统的一致性。
        </Typography>
      </Paper>

      {/* 断点系统 */}
      <Paper sx={{ p: 3 }}>
        <SectionTitle variant="h3">断点系统</SectionTitle>
        <Typography variant="body1" sx={{ mb: 3 }}>
          断点系统用于创建响应式设计，让界面能够适应不同屏幕尺寸。MUI提供了五个默认断点：xs、sm、md、lg、xl。
        </Typography>

        <Typography variant="h4" gutterBottom>
          断点值
        </Typography>
        <ColorCard>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body1" component="div">
                <ul>
                  <li>
                    <strong>xs:</strong> 0px 起始
                  </li>
                  <li>
                    <strong>sm:</strong> 600px 起始
                  </li>
                  <li>
                    <strong>md:</strong> 900px 起始
                  </li>
                </ul>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body1" component="div">
                <ul>
                  <li>
                    <strong>lg:</strong> 1200px 起始
                  </li>
                  <li>
                    <strong>xl:</strong> 1536px 起始
                  </li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </ColorCard>

        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
          使用断点的方式
        </Typography>

        <Typography variant="h5" gutterBottom>
          1. 在Grid组件中
        </Typography>
        <CodeBlock>{`<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    {/* 手机端全宽，平板端半宽，桌面端三分之一宽 */}
    <Box>内容</Box>
  </Grid>
</Grid>`}</CodeBlock>

        <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
          2. 在styled API中使用媒体查询
        </Typography>
        <CodeBlock>{`const ResponsiveBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  
  // 从sm(600px)开始应用这些样式
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  
  // 从md(900px)开始应用这些样式
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  
  // 仅在md断点范围内应用
  [theme.breakpoints.only('md')]: {
    backgroundColor: theme.palette.primary.light,
  },
  
  // 从xs到md之间应用
  [theme.breakpoints.between('xs', 'md')]: {
    margin: theme.spacing(1),
  },
}));`}</CodeBlock>

        <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
          3. 断点辅助函数
        </Typography>
        <ColorCard>
          <Typography variant="body1" component="div">
            <ul>
              <li>
                <strong>up(breakpoint)</strong> - 大于等于断点时应用
              </li>
              <li>
                <strong>down(breakpoint)</strong> - 小于断点时应用
              </li>
              <li>
                <strong>only(breakpoint)</strong> - 仅在特定断点范围内应用
              </li>
              <li>
                <strong>between(start, end)</strong> - 在指定断点范围内应用
              </li>
            </ul>
          </Typography>
        </ColorCard>

        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
          响应式设计最佳实践
        </Typography>
        <Typography variant="body1" paragraph>
          1. 使用<strong>移动优先</strong>
          的设计方法，先为最小屏幕设计，再逐步适配更大屏幕
        </Typography>
        <Typography variant="body1" paragraph>
          2. <strong>优先使用Flex布局</strong>
          实现响应式设计，它比Grid更灵活，性能更好，易于维护
        </Typography>
        <Typography variant="body1" paragraph>
          3. 对于复杂的响应式行为，可以使用useMediaQuery
          Hook来根据屏幕尺寸条件渲染内容
        </Typography>

        <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
          Flex布局示例
        </Typography>
        <CodeBlock>{`// 在styled组件中使用Flex布局
const ResponsiveContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // 移动端垂直排列
  gap: theme.spacing(2),
  
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row', // 平板和桌面端水平排列
    flexWrap: 'wrap',
  },
  
  '& > *': { // 子元素样式
    flex: '1 1 100%', // 移动端全宽
    
    [theme.breakpoints.up('sm')]: {
      flex: '1 1 45%', // 平板端占据约一半宽度
    },
    
    [theme.breakpoints.up('md')]: {
      flex: '1 1 30%', // 桌面端占据约三分之一宽度
    }
  }
}));

// 使用示例
<ResponsiveContainer>
  <Paper>项目1</Paper>
  <Paper>项目2</Paper>
  <Paper>项目3</Paper>
</ResponsiveContainer>`}</CodeBlock>

        <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
          结合Stack组件使用Flex
        </Typography>
        <Typography variant="body1" paragraph>
          MUI的Stack组件是基于Flex实现的，非常适合创建响应式布局：
        </Typography>
        <CodeBlock>{`<Stack
  direction={{ xs: 'column', sm: 'row' }}
  spacing={{ xs: 1, sm: 2, md: 3 }}
  divider={<Divider orientation="vertical" flexItem />}
>
  <Box>项目1</Box>
  <Box>项目2</Box>
  <Box>项目3</Box>
</Stack>`}</CodeBlock>
      </Paper>
    </Container>
  );
};

export default ThemeDemo;
