/** Canonical user set-password URL: /home?signin=user&tab=setPassword&uidb64=...&token=... */

import type {
  LocationQuery,
  LocationQueryValue,
  RouteLocationNormalized,
} from 'vue-router';

export type RouteQuery = LocationQuery;

function pickQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) {
    const first = value[0];
    if (first === null || first === undefined) return '';
    return String(first).trim();
  }
  return String(value).trim();
}

export function extractSetPasswordParams(query: RouteQuery = {}) {
  const token = pickQueryValue(query.token);
  const uidb64 = pickQueryValue(query.uidb64) || pickQueryValue(query.uid);
  const email = pickQueryValue(query.email);
  return { token, uidb64, email };
}

export function buildUserSetPasswordHomeQuery(
  uidb64: string,
  token: string,
  email = '',
): Record<string, string> {
  const query: Record<string, string> = {
    signin: 'user',
    tab: 'setPassword',
    uidb64,
    token,
  };
  if (email) query.email = email;
  return query;
}

const SET_PASSWORD_STORAGE_KEY = 'vaptfix_user_set_password_deeplink';

export type StoredSetPasswordDeepLink = {
  uidb64: string;
  token: string;
  email: string;
};

/** True when URL should open User Sign In → Set Password tab. */
export function isUserSetPasswordDeepLink(query: RouteQuery = {}): boolean {
  const tabVal = pickQueryValue(query.tab);
  const tabRaw = tabVal.toLowerCase();
  const signin = pickQueryValue(query.signin);
  if (signin === 'user' && (tabRaw === 'set-password' || tabVal === 'setPassword')) {
    return true;
  }

  const actionRaw = pickQueryValue(query.action).toLowerCase();
  if (actionRaw === 'set-password' || actionRaw === 'setpassword') return true;

  const platform = pickQueryValue(query.platform).toLowerCase();
  const source = pickQueryValue(query.source).toLowerCase();
  if (
    platform === 'slack' ||
    platform === 'teams' ||
    platform === 'microsoft_teams' ||
    source === 'slack' ||
    source === 'teams' ||
    source === 'microsoft_teams'
  ) {
    return true;
  }

  const { token, uidb64 } = extractSetPasswordParams(query);
  return !!(token && uidb64);
}

export function storeSetPasswordDeepLink(payload: StoredSetPasswordDeepLink) {
  try {
    sessionStorage.setItem(SET_PASSWORD_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
}

export function readStoredSetPasswordDeepLink(): StoredSetPasswordDeepLink | null {
  try {
    const raw = sessionStorage.getItem(SET_PASSWORD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSetPasswordDeepLink;
    if (!parsed?.uidb64 || !parsed?.token) return null;
    return {
      uidb64: String(parsed.uidb64).trim(),
      token: String(parsed.token).trim(),
      email: String(parsed.email || '').trim(),
    };
  } catch {
    return null;
  }
}

export function clearStoredSetPasswordDeepLink() {
  try {
    sessionStorage.removeItem(SET_PASSWORD_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function resolveSetPasswordDeepLink(
  query: RouteQuery = {},
): StoredSetPasswordDeepLink | null {
  const fromQuery = extractSetPasswordParams(query);
  if (fromQuery.uidb64 && fromQuery.token) {
    return fromQuery;
  }
  return readStoredSetPasswordDeepLink();
}

export function normalizeUserSetPasswordRoute(
  to: Pick<RouteLocationNormalized, 'path' | 'query'>,
): { path: string; query: Record<string, string> } | null {
  if (to.path !== '/home' || !isUserSetPasswordDeepLink(to.query)) return null;

  const { token, uidb64, email } = extractSetPasswordParams(to.query);
  if (!token || !uidb64) return null;

  const canonical = buildUserSetPasswordHomeQuery(uidb64, token, email);

  const alreadyCanonical =
    pickQueryValue(to.query.signin) === 'user' &&
    pickQueryValue(to.query.tab) === 'setPassword' &&
    pickQueryValue(to.query.uidb64) === uidb64 &&
    pickQueryValue(to.query.token) === token &&
    !pickQueryValue(to.query.action) &&
    !pickQueryValue(to.query.uid);

  if (alreadyCanonical) return null;
  return { path: '/home', query: canonical };
}

/** Pull uid/token from API error bodies (Slack/Teams member login). */
export function extractSetPasswordFromPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const nested =
    (root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : null) ||
    (root.details && typeof root.details === 'object' ? (root.details as Record<string, unknown>) : null) ||
    root;

  const token = String(nested.token || nested.password_token || '').trim();
  const uidb64 = String(
    nested.uidb64 || nested.uid || nested.user_id_b64 || '',
  ).trim();
  const email = String(nested.email || '').trim();

  if (!token || !uidb64) return null;
  return { uidb64, token, email };
}

export function redirectToUserSetPasswordHome(
  uidb64: string,
  token: string,
  email = '',
) {
  storeSetPasswordDeepLink({ uidb64, token, email });
  const params = new URLSearchParams(buildUserSetPasswordHomeQuery(uidb64, token, email));
  window.location.href = `${window.location.origin}/home?${params.toString()}`;
}

function wantsUserSetPasswordTab(query: RouteQuery = {}): boolean {
  const signin = pickQueryValue(query.signin);
  const tabVal = pickQueryValue(query.tab);
  const tabRaw = tabVal.toLowerCase();
  return signin === 'user' && (tabRaw === 'set-password' || tabVal === 'setPassword');
}

/** Apply deep-link state on a host component (Header). */
export function applySetPasswordModalState(
  vm: {
    signUpPreSelectedType: string;
    signUpUserInitialTab: string;
    setPasswordUidb64: string;
    setPasswordToken: string;
    setPasswordEmail: string;
    showSignUpModal: boolean;
    $nextTick: (fn: () => void) => void;
  },
  query: RouteQuery,
) {
  const resolved = resolveSetPasswordDeepLink(query);
  if (resolved?.uidb64 && resolved?.token) {
    storeSetPasswordDeepLink(resolved);
    vm.signUpPreSelectedType = 'user';
    vm.signUpUserInitialTab = 'setPassword';
    vm.setPasswordUidb64 = resolved.uidb64;
    vm.setPasswordToken = resolved.token;
    vm.setPasswordEmail = resolved.email;
    vm.$nextTick(() => {
      vm.showSignUpModal = true;
    });
    return true;
  }

  if (wantsUserSetPasswordTab(query)) {
    vm.signUpPreSelectedType = 'user';
    vm.signUpUserInitialTab = 'setPassword';
    vm.$nextTick(() => {
      vm.showSignUpModal = true;
    });
    return true;
  }

  return false;
}
