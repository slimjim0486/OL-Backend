import Anthropic from '@anthropic-ai/sdk';
import { config } from './index.js';

export const anthropic = config.anthropic?.apiKey
  ? new Anthropic({ apiKey: config.anthropic.apiKey })
  : null;

export const CLAUDE_AGENT_CONFIG = {
  model: 'claude-sonnet-4-6',
  maxTokens: 4096,
  maxIterations: 15,
} as const;
