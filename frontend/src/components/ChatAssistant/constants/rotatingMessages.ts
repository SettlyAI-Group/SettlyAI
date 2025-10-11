/**
 * 轮播消息配置 - 为不同的 Agent 提供个性化的加载消息
 */

export type AgentName = 'tom' | 'ivy' | 'levin' | 'levan';

/**
 * 每个 Agent 的轮播消息配置
 */
export const ROTATING_MESSAGES: Record<AgentName, string[]> = {
  // 👨 Tom – The Practical Tech Guy
  // 简短、口语化、带点技术宅幽默
  tom: [
    "Calling Tom... he's probably knee-deep in data",
    "Tom's checking the numbers, coffee in hand",
    "Reaching Tom... hope he's not debugging again",
    "Tom's pulling up the reports now",
    "Connecting to Tom, his dashboard just lit up",
    "Tom's digging through the database...",
    "Asking Tom for the latest data",
    "Tom's running the query, one sec...",
    "Tom says 'just loading the charts'",
    "Pinging Tom... status: thinking",
  ],

  // 👩 Ivy – The Calm Archivist
  // 简短、沉稳、细心
  ivy: [
    "Calling Ivy... she's sorting through files",
    "Ivy's searching her archives now",
    "Reaching Ivy, she's checking the records",
    "Ivy's pulling up the documents...",
    "Connecting to Ivy, she's very thorough",
    "Ivy says 'let me find that for you'",
    "Ivy's going through her folders",
    "Asking Ivy to verify the details",
    "Ivy's double-checking everything",
    "Ivy says 'almost there, hold on'",
  ],

  // 👩 Levin/Levan – The Elegant Financial Analyst
  // 简短、专业、自信
  levin: [
    "Calling Levin... she's crunching numbers",
    "Levin's running the calculations now",
    "Reaching Levin, her calculator is ready",
    "Levin's checking the interest rates...",
    "Connecting to Levin, she loves math",
    "Levin says 'let me calculate that'",
    "Levin's analyzing the financials",
    "Asking Levin for the price breakdown",
    "Levin's verifying the numbers twice",
    "Levin says 'numbers don't lie, almost done'",
  ],

  // Levan 使用和 Levin 相同的消息
  levan: [
    "Calling Levin... she's crunching numbers",
    "Levin's running the calculations now",
    "Reaching Levin, her calculator is ready",
    "Levin's checking the interest rates...",
    "Connecting to Levin, she loves math",
    "Levin says 'let me calculate that'",
    "Levin's analyzing the financials",
    "Asking Levin for the price breakdown",
    "Levin's verifying the numbers twice",
    "Levin says 'numbers don't lie, almost done'",
  ],
};

/**
 * 获取随机的轮播消息
 */
export const getRotatingMessage = (agentName: AgentName): string => {
  const messages = ROTATING_MESSAGES[agentName];
  if (!messages || messages.length === 0) {
    return `Connecting to ${agentName}...`;
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

/**
 * 提取 Agent 名称（从工具名称中）
 */
export const extractAgentName = (toolName: string): AgentName | null => {
  const lowerToolName = toolName.toLowerCase();
  if (lowerToolName.includes('tom')) return 'tom';
  if (lowerToolName.includes('ivy')) return 'ivy';
  if (lowerToolName.includes('levin')) return 'levin';
  if (lowerToolName.includes('levan')) return 'levan';
  return null;
};
