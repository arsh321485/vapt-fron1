/** Django JWT from Slack/Teams OAuth postMessage — not platform tokens (MS Graph / Slack). */

type OAuthPayload = Record<string, any> | null | undefined;

export function extractDjangoOAuthTokens(payload: OAuthPayload = {}) {
  const source = payload || {};
  const nested =
    source.django_tokens && typeof source.django_tokens === "object"
      ? source.django_tokens
      : null;

  const access = String(
    nested?.access ||
      source.django_access_token ||
      source.jwt_tokens?.access ||
      "",
  ).trim();

  const refresh = String(
    nested?.refresh ||
      source.django_refresh_token ||
      source.jwt_tokens?.refresh ||
      "",
  ).trim();

  return { access, refresh };
}

/** Magic link / pricing-handoff may expose top-level access & refresh (Django JWT). */
export function extractDjangoOAuthTokensWithHandoffFallback(payload: OAuthPayload = {}) {
  const base = extractDjangoOAuthTokens(payload);
  const source = payload || {};
  return {
    access: base.access || String(source.access || source.access_token || "").trim(),
    refresh: base.refresh || String(source.refresh || source.refresh_token || "").trim(),
  };
}

export function resolveDjangoOAuthPostMessageFields(payload: OAuthPayload = {}) {
  const { access, refresh } = extractDjangoOAuthTokens(payload);
  const nested =
    payload?.django_tokens && typeof payload.django_tokens === "object"
      ? payload.django_tokens
      : access || refresh
        ? { access: access || undefined, refresh: refresh || undefined }
        : undefined;

  return {
    django_tokens: nested,
    django_access_token: access,
    django_refresh_token: refresh,
  };
}

export function persistDjangoOAuthTokens(payload: OAuthPayload = {}) {
  const { access, refresh } = extractDjangoOAuthTokens(payload);
  if (access) {
    localStorage.setItem("django_access_token", access);
    sessionStorage.setItem("authorization", access);
  }
  if (refresh) {
    localStorage.setItem("django_refresh_token", refresh);
    sessionStorage.setItem("refreshToken", refresh);
  }
  return { access, refresh };
}
