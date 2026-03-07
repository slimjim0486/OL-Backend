// Claude Agent Service — Agentic tool-use loop replacing the classify-then-route pipeline
import type Anthropic from '@anthropic-ai/sdk';
import { anthropic, CLAUDE_AGENT_CONFIG } from '../../config/anthropic.js';
import { agentMemoryService } from './agentMemoryService.js';
import { AGENT_TOOLS } from './agentToolDefinitions.js';
import { executeToolCall, TOOL_TO_CONTENT_TYPE } from './agentToolExecutor.js';
import type { ToolCallResult } from './agentToolExecutor.js';
import type { IntentType } from './taskRouterService.js';
import type { AgentResponse } from './agentOrchestratorService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export type ActionResultItem = NonNullable<AgentResponse['actionResult']>;

export interface AgentLoopResult {
  message: string;
  intent: IntentType;
  actionResult?: AgentResponse['actionResult'];
  actionResults?: ActionResultItem[];
  tokensUsed: number;
  bridgeHandledInteraction: boolean;
}

// Map tool names to IntentType for the response contract
const TOOL_TO_INTENT: Record<string, IntentType> = {
  generate_lesson: 'generate_lesson',
  generate_quiz: 'generate_quiz',
  generate_flashcards: 'generate_flashcards',
  generate_sub_plan: 'generate_sub_plan',
  generate_iep_goals: 'generate_iep',
  generate_parent_email: 'generate_parent_email',
  generate_report_comments: 'generate_report_comments',
  create_weekly_prep: 'weekly_prep',
  navigate_to_weekly_prep: 'open_calendar',
  update_curriculum_progress: 'update_curriculum',
  navigate_to_page: 'chat',
  suggest_gap_actions: 'chat',
  get_proactive_suggestions: 'chat',
};

// ============================================
// SYSTEM PROMPT
// ============================================

function buildSystemPrompt(agent: {
  agentTone?: string | null;
  schoolName?: string | null;
  gradesTaught?: string[] | null;
  subjectsTaught?: string[] | null;
  curriculumType?: string | null;
  firstName?: string | null;
}): string {
  const tone = agent.agentTone?.toLowerCase() || 'friendly';
  const school = agent.schoolName || 'their school';
  const grades = agent.gradesTaught?.join(', ') || 'K-8';
  const subjects = agent.subjectsTaught?.join(', ') || 'various subjects';
  const curriculum = agent.curriculumType || 'American';
  const teacherName = (agent as any).firstName ? `The teacher's name is ${(agent as any).firstName}.` : '';

  return `You are Ollie, an AI teaching assistant at Orbit Learn. You are ${tone} in style.
${teacherName}
Teacher context: ${school} | Grades: ${grades} | Subjects: ${subjects} | Curriculum: ${curriculum}

RULES:
1. Use tools proactively — don't ask the teacher for info you can look up.
2. Before generating content, ALWAYS call get_style_preferences and get_classrooms first.
3. If essential params are missing (topic, subject, grade), ask the teacher naturally.
4. Be personal — reference specific classroom details and curriculum progress.
5. For navigation requests, use navigate_to_weekly_prep or navigate_to_page immediately.
6. After generating content, give a brief summary. The content renders as a card in the UI — don't repeat its full content.
7. Today's date is ${new Date().toISOString().split('T')[0]}.
8. Keep responses concise. Teachers are busy.
9. When asked about curriculum progress, standards gaps, or what to teach next, use the relevant tools to provide data-driven advice.`;
}

// ============================================
// AGENTIC LOOP
// ============================================

export async function runAgentLoop(
  teacherId: string,
  agentId: string,
  sessionId: string,
  userMessage: string,
  chatHistory: Array<{ role: string; content: string }>
): Promise<AgentLoopResult> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.');
  }

  // Load agent for system prompt
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) {
    throw new Error('Agent not initialized');
  }

  const systemPrompt = buildSystemPrompt(agent);

  // Build messages array: chat history + current user message
  const messages: Anthropic.Messages.MessageParam[] = [];

  // Add recent chat history (already in chronological order from caller)
  for (const msg of chatHistory.slice(-10)) {
    const role = msg.role === 'USER' ? 'user' : 'assistant';
    // Skip empty messages
    if (!msg.content?.trim()) continue;
    // Ensure alternation: skip if same role as last message
    if (messages.length > 0 && messages[messages.length - 1].role === role) continue;
    messages.push({ role, content: msg.content });
  }

  // Ensure last message in history is not a user message (since we're about to add one)
  if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
    messages.pop();
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  // Track across iterations
  let totalTokens = 0;
  const contentToolResults: ToolCallResult[] = [];

  // Agentic loop
  for (let iteration = 0; iteration < CLAUDE_AGENT_CONFIG.maxIterations; iteration++) {
    logger.info('Claude agent iteration', { teacherId, sessionId, iteration });

    const response = await anthropic.messages.create({
      model: CLAUDE_AGENT_CONFIG.model,
      max_tokens: CLAUDE_AGENT_CONFIG.maxTokens,
      system: systemPrompt,
      tools: AGENT_TOOLS,
      messages,
    });

    // Track token usage
    totalTokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    // If Claude is done (no more tool calls)
    if (response.stop_reason === 'end_turn') {
      const textBlocks = response.content.filter(
        (block): block is Anthropic.Messages.TextBlock => block.type === 'text'
      );
      const assistantText = textBlocks.map(b => b.text).join('\n\n') || 'Done!';

      return buildResult(assistantText, contentToolResults, totalTokens);
    }

    // If Claude wants to use tools
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
      );

      // Add assistant message with all content blocks (text + tool_use)
      messages.push({ role: 'assistant', content: response.content });

      // Execute all tool calls
      const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        logger.info('Executing tool', { teacherId, toolName: toolUse.name, iteration });

        const result = await executeToolCall(
          teacherId,
          agentId,
          toolUse.name,
          (toolUse.input as Record<string, any>) || {}
        );

        // Track all content generation results for response mapping
        if (result.isContentGeneration && !result.result?.error) {
          contentToolResults.push(result);
        }

        // Truncate result for Claude's context
        const resultStr = JSON.stringify(result.result);
        const truncated = resultStr.length > 8000
          ? resultStr.substring(0, 8000) + '... [truncated]'
          : resultStr;

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: truncated,
        });
      }

      // Add tool results as user message
      messages.push({ role: 'user', content: toolResults });

      // Continue loop for Claude to process results
      continue;
    }

    // Unexpected stop reason — extract whatever text we have
    logger.warn('Unexpected stop reason', { stopReason: response.stop_reason, teacherId });
    const textBlocks = response.content.filter(
      (block): block is Anthropic.Messages.TextBlock => block.type === 'text'
    );
    const fallbackText = textBlocks.map(b => b.text).join('\n\n') || "I've completed your request.";
    return buildResult(fallbackText, contentToolResults, totalTokens);
  }

  // Max iterations reached
  logger.warn('Claude agent max iterations reached', { teacherId, sessionId });
  return buildResult(
    "I've been working on this but hit my step limit. Here's what I have so far.",
    contentToolResults,
    totalTokens
  );
}

// ============================================
// RESPONSE MAPPING
// ============================================

function buildActionResult(
  toolResult: ToolCallResult,
  fallbackPreview: string
): NonNullable<AgentResponse['actionResult']> {
  const contentType = toolResult.contentType || TOOL_TO_CONTENT_TYPE[toolResult.toolName];

  const actionResult: NonNullable<AgentResponse['actionResult']> = {
    type: contentType || toolResult.toolName,
    content: toolResult.result?.content || toolResult.result,
    preview: toolResult.result?.preview || fallbackPreview,
    contentId: toolResult.result?.content?.id ||
               toolResult.result?.content?.prepId ||
               toolResult.result?.contentId,
    interactionId: toolResult.interactionId,
  };

  // For weekly prep, set contentId from prepId
  if (contentType === 'weekly_prep' && toolResult.result?.content?.prepId) {
    actionResult.contentId = toolResult.result.content.prepId;
  }

  return actionResult;
}

function buildResult(
  message: string,
  contentToolResults: ToolCallResult[],
  totalTokens: number
): AgentLoopResult {
  let intent: IntentType = 'chat';
  let bridgeHandledInteraction = false;

  // Build action results for ALL content generations
  const actionResults: NonNullable<AgentResponse['actionResult']>[] = [];
  for (const toolResult of contentToolResults) {
    actionResults.push(buildActionResult(toolResult, message));
  }

  // Use the first content result for intent derivation
  if (contentToolResults.length > 0) {
    const firstToolName = contentToolResults[0].toolName;
    intent = TOOL_TO_INTENT[firstToolName] || 'chat';
    bridgeHandledInteraction = true;
  }

  return {
    message,
    intent,
    actionResult: actionResults[0], // primary (backward compat)
    actionResults: actionResults.length > 0 ? actionResults : undefined,
    tokensUsed: totalTokens,
    bridgeHandledInteraction,
  };
}
