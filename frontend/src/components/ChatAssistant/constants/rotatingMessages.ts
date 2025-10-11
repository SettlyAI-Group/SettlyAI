/**
 * 轮播消息配置 - 为不同的 Agent 提供个性化的加载消息
 */

export type AgentName = 'tom' | 'ivy' | 'levin' | 'levan';

/**
 * 每个 Agent 的轮播消息配置
 */
export const ROTATING_MESSAGES: Record<AgentName, string[]> = {
  // 👨 Tom – The Practical Tech Guy
  // Tone: Reliable, slightly nerdy, with understated programmer humor
  tom: [
    "Summoning Tom, he's probably wrestling with another dataset.",
    "Knocking on Tom's door, hope he's not buried in code again.",
    "Connecting to Tom, signal's holding better than his patience.",
    "Tom's checking the reports, whispering SQL under his breath.",
    "Calling Tom, unless he's off fixing the server again.",
    "Syncing with Tom, he said 'just one more script to run.'",
    "Tom's staring at a graph, looking more serious than the trend line.",
    "Reaching out to Tom, the coffee just kicked in.",
    "Tom might be stuck in a debugging loop again.",
    "Summoning Tom, status: loading…",
  ],

  // 👩 Ivy – The Calm Archivist
  // Tone: Smart, composed, meticulous, with a quiet sense of humor
  ivy: [
    "Summoning Ivy, her archive is basically a galaxy.",
    "Ivy's digging through records, even the air feels like it's buffering.",
    "Connecting to Ivy, she's dusting off some old folders.",
    "Ivy's sorting through directories, counting softly under her breath.",
    "Reaching Ivy, her mouse clicks with metronome precision.",
    "Ivy got trapped in another subfolder spiral again.",
    "Syncing with Ivy, she insists on checking every detail herself.",
    "Ivy's wandering through data like she's chasing a lost star.",
    "Connected to Ivy, she says 'hold on, I see something.'",
    "Ivy's verifying the last page, the answer's almost here.",
  ],

  // 👩 Levin/Levan – The Elegant Financial Analyst
  // Tone: Confident, analytical, a little theatrical about her math
  levin: [
    "Summoning Levin, her calculator just started warming up.",
    "Levin's crunching numbers, and her coffee's getting cold.",
    "Connecting to Levin, she's negotiating with the interest rate.",
    "Levin's tuning her model, every decimal obeys her command.",
    "Contacting Levin, she says 'the rate's being stubborn today.'",
    "Levin's doing arithmetic gymnastics, precision like choreography.",
    "Summoning Levin, she's lining up the numbers like soldiers.",
    "Levin's cross-checking data, sharper than her calculator.",
    "Syncing with Levin, she says 'two more seconds for perfection.'",
    "Levin's running calculations, even the air smells like formulas.",
  ],

  // Levan 使用和 Levin 相同的消息（因为它们是同一个角色的不同拼写）
  levan: [
    "Summoning Levin, her calculator just started warming up.",
    "Levin's crunching numbers, and her coffee's getting cold.",
    "Connecting to Levin, she's negotiating with the interest rate.",
    "Levin's tuning her model, every decimal obeys her command.",
    "Contacting Levin, she says 'the rate's being stubborn today.'",
    "Levin's doing arithmetic gymnastics, precision like choreography.",
    "Summoning Levin, she's lining up the numbers like soldiers.",
    "Levin's cross-checking data, sharper than her calculator.",
    "Syncing with Levin, she says 'two more seconds for perfection.'",
    "Levin's running calculations, even the air smells like formulas.",
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
