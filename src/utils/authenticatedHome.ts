/** In-app home for a logged-in session. Public /home is only for logged-out users. */

function readToken(): string {
  return (
    sessionStorage.getItem("authorization") ||
    localStorage.getItem("authorization") ||
    sessionStorage.getItem("authorization") ||
    localStorage.getItem("authorization") ||
    ""
  ).trim();
}

function readStoredUser(): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
}

export function hasAuthSession(): boolean {
  const token = readToken();
  return !!(token && token !== "null" && token !== "undefined");
}

export function isStoredTeamMember(): boolean {
  const user = readStoredUser();
  if (!user) return false;
  return Array.isArray(user.Member_role) || Array.isArray(user.Member_role);
}

/** Admin dashboard, user dashboard, or public /home when logged out. */
export function getAuthenticatedAppHome(): string {
  if (!hasAuthSession()) return "/home";
  return isStoredTeamMember() ? "/userdashboard" : "/admindashboardonboarding";
}
