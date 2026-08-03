const STORAGE_KEY = 'vaptfix_script_feedback';

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resolveFeedbackUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return String(user?._id || user?.id || user?.email || user?.user_id || 'anonymous');
  } catch {
    return 'anonymous';
  }
}

export function buildScriptFeedbackKey({ scriptName, vulnName, assetIp, severity }) {
  return [scriptName, vulnName, assetIp, severity]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join('::');
}

export function getUserScriptFeedback(feedbackKey, userId = resolveFeedbackUserId()) {
  const store = readStore();
  return store[`${feedbackKey}::${userId}`]?.vote || null;
}

export function setUserScriptFeedback(feedbackKey, vote, userId = resolveFeedbackUserId()) {
  const store = readStore();
  const entryKey = `${feedbackKey}::${userId}`;
  if (vote === 'up' || vote === 'down') {
    store[entryKey] = { vote, at: Date.now() };
  } else {
    delete store[entryKey];
  }
  writeStore(store);
}

function getDemoAggregateForReview(feedbackKey) {
  const parts = String(feedbackKey || '').split('::');
  const scriptName = (parts[0] || '').toLowerCase();
  const severity = String(parts[parts.length - 1] || '').trim().toLowerCase();

  if (severity === 'low') {
    return { up: 4, down: 0, total: 4, isDemo: true };
  }
  if (severity === 'high' || scriptName.includes('struts')) {
    return { up: 0, down: 3, total: 3, isDemo: true };
  }
  if (severity === 'critical' || scriptName.includes('isolate')) {
    return { up: 1, down: 4, total: 5, isDemo: true };
  }
  if (severity === 'medium') {
    return { up: 3, down: 1, total: 4, isDemo: true };
  }

  return { up: 2, down: 2, total: 4, isDemo: true };
}

export function getScriptFeedbackAggregate(feedbackKey, options = {}) {
  const { useDemoFallback = false } = options;
  const store = readStore();
  const prefix = `${feedbackKey}::`;
  let up = 0;
  let down = 0;

  Object.keys(store).forEach((key) => {
    if (!key.startsWith(prefix)) return;
    if (store[key]?.vote === 'up') up += 1;
    else if (store[key]?.vote === 'down') down += 1;
  });

  const total = up + down;
  if (useDemoFallback && total === 0 && feedbackKey) {
    return getDemoAggregateForReview(feedbackKey);
  }

  return { up, down, total };
}
