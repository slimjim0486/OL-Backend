// Feature flags - env-based for Phase 1
// Upgrade to database-backed flags later for gradual rollout

export const FEATURE_FLAGS = {
  TEACHER_AGENT_ENABLED: 'FEATURE_TEACHER_AGENT_ENABLED',
} as const;

const FLAG_DEFAULTS: Record<string, boolean> = {
  [FEATURE_FLAGS.TEACHER_AGENT_ENABLED]: false,
};

export function isFeatureEnabled(flag: string): boolean {
  const envValue = process.env[flag];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }
  return FLAG_DEFAULTS[flag] ?? false;
}

export function getAllFlags(): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const [key, envKey] of Object.entries(FEATURE_FLAGS)) {
    result[key] = isFeatureEnabled(envKey);
  }
  return result;
}
