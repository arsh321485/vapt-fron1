import { createRouter, createWebHistory } from "vue-router";
// admin import

// user import
// import UserToolboxView from "../views/user-views/UserToolboxView.vue"; // Toolbox commented out
// import ToolboxView from "../views/admin-dashboard/ToolboxView.vue"; // Toolbox commented out
import { tryShowPostLoginSuccessAlert } from "../utils/postLoginSuccess";
import {
  buildAdminSetPasswordHomeQuery,
  buildUserSetPasswordHomeQuery,
  normalizeUserSetPasswordRoute,
} from "../utils/userSetPasswordDeepLink";
import {
  clearExternalDeepLink,
  isAuthDeepLink,
  isPublicHomeLock,
  isRouteLockExempt,
  lockedLocation,
  markExternalDeepLink,
  readLockedRoute,
  sameLockedRoute,
  seedLockFromWindow,
  writeLockedRoute,
} from "../utils/routeLock";
import { extractClaimInviteToken, isClaimInviteFlow, storeClaimInviteToken } from "../utils/claimInvite";
import { fetchClaimInviteValidate } from "../services/claimInviteApi";
import { useAuthStore } from "../stores/authStore";
import { hasAuthSession, isStoredTeamMember } from "../utils/authenticatedHome";
import {
  captureChatHandoffSource,
  clearHandoffNavigation,
  hasHandoffError,
  isHandoffNavigation,
  markHandoffNavigation,
  readQueryAdminToken,
  storeHandoffError,
} from "../utils/adminHandoff";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // admin path

    {
      path: "/",
      redirect: (to) => ({ path: "/home", query: to.query, hash: to.hash }),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../components/admin-component/Login.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/admin-views/HomeView.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("../views/admin-views/PrivacyPolicyView.vue"),
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/admin-views/TermsOfServiceView.vue"),
    },
    {
      path: "/knowledge-base",
      name: "knowledge-base",
      component: () => import("../views/admin-views/KnowledgeBaseView.vue"),
    },
    {
      path: "/how-vaptfix-works",
      name: "how-vaptfix-works",
      component: () => import("../views/admin-views/HowVaptfixWorksView.vue"),
    },
    {
      path: "/support",
      name: "public-support",
      component: () => import("../views/admin-views/SupportCenterView.vue"),
    },
    {
      path: "/dpa",
      name: "dpa",
      component: () => import("../views/admin-views/DataProcessingAgreementView.vue"),
    },
    {
      path: "/sub-processors",
      name: "sub-processors",
      component: () => import("../views/admin-views/SubProcessorsView.vue"),
    },
    {
      path: "/choose-account",
      redirect: "/auth",
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/admin-views/AuthView.vue"),
    },
    {
      path: "/pricingplan",
      name: "pricingplan",
      component: () => import("../views/admin-views/PricingplansView.vue"),
    },
    {
      path: "/billing/success",
      name: "billing-success",
      component: () => import("../views/admin-views/BillingSuccessView.vue"),
    },
    {
      path: "/billing/cancel",
      name: "billing-cancel",
      component: () => import("../views/admin-views/BillingCancelView.vue"),
    },
    {
      path: "/partner",
      name: "partner",
      component: () => import("../views/admin-views/PartnerView.vue"),
    },
    {
      path: "/partner-lead-portal",
      name: "partner-lead-portal",
      component: () => import("../views/admin-views/PartnerLeadPortalView.vue"),
    },
    {
      path: "/partner-lead-thankyou",
      name: "partner-lead-thankyou",
      component: () => import("../views/admin-views/PartnerLeadThankYouView.vue"),
    },
    {
      path: "/partner-thankyou",
      name: "partner-thankyou",
      component: () => import("../views/admin-views/PartnerThankYouView.vue"),
    },
    {
      path: "/webinarform",
      name: "webinarform",
      component: () => import("../views/admin-views/WebinarFormView.vue"),
    },
    {
      path: "/webinarform-thankyou",
      name: "webinarform-thankyou",
      component: () => import("../views/admin-views/WebinarThankYouView.vue"),
    },
    {
      path: "/vulnerabilityexplorer",
      name: "vulnerabilityexplorer",
      component: () => import("../views/admin-views/VulnerabilityExplorerView.vue"),
    },
    {
      path: "/communication",
      name: "communication",
      component: () => import("../views/admin-views/LocationView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true, requiresPaidPlan: true },
    },
    {
      path: "/microsoft/callback",
      name: "MicrosoftCallback",
      component: () => import("../views/admin-views/MicrosoftCallbackView.vue"),
    },
    {
      path: "/riskcriteria",
      name: "riskcriteria",
      component: () => import("../views/admin-views/RiskCriteriaView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true, requiresPaidPlan: true },
    },
    // {
    //   path: '/uploadreport',
    //   name: 'uploadreport',
    //   component: UploadReportView,
    // },
    {
      path: "/onboarding1",
      name: "onboarding1",
      component: () => import("../views/admin-dashboard/Onboarding1View.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admindashboardonboarding",
      name: "admindashboardonboarding",
      component: () => import("../views/admin-dashboard/AdminDashboardOnboardingView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true, requiresPaidPlan: true },
    },
    {
      path: "/scope",
      name: "scope",
      component: () => import("../views/admin-dashboard/ScopeView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/mitigationstrategy",
      name: "mitigationstrategy",
      component: () => import("../views/admin-dashboard/MitigationStrategyView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/remediation-timeline/:reportId/:asset",
      name: "remediation-timeline",
      component: () => import("../views/admin-dashboard/RemediationTimelineView.vue"),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../views/admin-dashboard/CalendarView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/missingsecurityupdates",
      name: "missingsecurityupdates",
      component: () => import("../views/admin-dashboard/MissingSecurityUpdatesView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/usermissingsecurityupdates",
      name: "usermissingsecurityupdates",
      component: () => import("../views/user-views/UserMissingSecurityUpdatesView.vue"),
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/vulnerabilitycard',
    //   name: 'vulnerabilitycard',
    //   component: () => import("../views/admin-dashboard/VulnerabilityCardView.vue"),
    // },
    {
      path: "/vulnerabilitycard/:reportId/:asset",
      name: "VulFix",
      component: () => import("../views/admin-dashboard/VulnerabilityCardView.vue"),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/admin-views/SignupView.vue"),
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("../views/admin-views/SignInView.vue"),
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: () => import("../views/admin-views/ForgotPasswordView.vue"),
    },
    {
      path: "/dashboard1",
      name: "dashboard1",
      component: () => import("../views/admin-dashboard/Dashboard1View.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // {
    //   path: '/createnewticket',
    //   name: 'createnewticket',
    //   component: () => import("../views/admin-dashboard/CreateNewTicketView.vue"),
    // },
    {
      path: "/ticket/:reportId/:fixVulId/:asset?/:ticketId?",
      name: "CreateTicket",
      component: () => import("../views/admin-dashboard/CreateNewTicketView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // {
    //   path: '/supportticket',
    //   name: 'supportticket',
    //   component: () => import("../views/admin-dashboard/SupportTicketView.vue"),
    // },
    {
      // path: '/supportticket/:reportId',
      path: "/supportticket/:reportId?",
      name: "supportticket",
      component: () => import("../views/admin-dashboard/SupportTicketView.vue"),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/pending",
      name: "pending",
      component: () => import("../views/admin-dashboard/PendingView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/fixes",
      name: "fixes",
      component: () => import("../views/admin-dashboard/FixesView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/supportrequests",
      name: "exceptions",
      component: () => import("../views/admin-dashboard/ExceptionsView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/vulnerabilityregister",
      name: "vulnerabilityregister",
      component: () => import("../views/admin-dashboard/VulnerabilityRegisterView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/report",
      name: "report",
      component: () => import("../views/admin-dashboard/ReportView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/assets",
      name: "assets",
      component: () => import("../views/admin-dashboard/AssetsView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // Toolbox route commented out
    // {
    //   path: "/toolbox",
    //   name: "toolbox",
    //   component: ToolboxView,
    //   meta: { requiresAuth: true, requiresAdmin: true },
    // },
    {
      path: "/performance-monitoring",
      name: "performance-monitoring",
      component: () => import("../views/admin-dashboard/PerformanceMonitoringView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/viewreport",
      name: "viewreport",
      component: () => import("../views/admin-dashboard/ViewReportPage.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/waiting-for-report",
      name: "waiting-for-report",
      component: () => import("../views/admin-dashboard/WaitingForReportView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin-upload-report",
      name: "admin-upload-report",
      component: () => import("../views/admin-dashboard/AdminUploadReportView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true, allowDeepLink: true },
    },
    {
      path: "/scoping-form",
      name: "scoping-form",
      redirect: "/waiting-for-report",
    },
    {
      path: "/scoping-form-2",
      name: "scoping-form-2",
      redirect: "/waiting-for-report",
    },
    {
      path: "/yourteam",
      name: "yourteam",
      component: () => import("../views/admin-dashboard/YourTeamView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/howitwork",
      name: "howitwork",
      component: () => import("../components/admin-component/HowitWork.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../components/admin-component/Profile.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/manage-account",
      name: "manage-account",
      component: () => import("../views/admin-dashboard/AdminManageAccountView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // Settings route — hidden (commented out)
    // {
    //   path: "/settings",
    //   name: "settings",
    //   component: () => import("../views/admin-dashboard/AdminSettingsView.vue"),
    //   meta: { requiresAuth: true, requiresAdmin: true },
    // },
    {
      path: "/set-password/:uidb64/:token",
      name: "set-password",
      redirect: (to) => ({
        path: "/home",
        query: buildAdminSetPasswordHomeQuery(
          String(to.params.uidb64 ?? ""),
          String(to.params.token ?? ""),
          typeof to.query.email === "string" ? to.query.email : "",
        ),
      }),
    },
    {
      path: "/user-set-password/:uidb64/:token",
      redirect: (to) => ({
        path: "/home",
        query: buildUserSetPasswordHomeQuery(
          String(to.params.uidb64 ?? ""),
          String(to.params.token ?? ""),
          typeof to.query.email === "string" ? to.query.email : "",
        ),
      }),
    },
    {
      path: "/reset-password/:uidb64/:token",
      name: "reset-password",
      component: () => import("../views/admin-views/HomeView.vue"),
    },
    {
      path: "/notification",
      name: "notification",
      component: () => import("../components/admin-component/NotificationPanel.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/jira/callback",
      name: "jira-callback",
      component: () => import("../views/admin-views/JiraCallbackView.vue"),
    },
    {
      path: "/slack/callback",
      name: "slack-callback",
      component: () => import("../views/admin-views/SlackCallbackView.vue"),
    },

    // user path
    {
      path: "/usersignup",
      redirect: "/auth",
    },
    {
      path: "/userdashboard",
      name: "userdashboard1",
      component: () => import("../views/user-views/UserDashboard1View.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/user-manage-account",
      name: "user-manage-account",
      component: () => import("../views/user-views/UserManageAccountView.vue"),
      meta: { requiresAuth: true },
    },
    // User settings route — hidden (commented out)
    // {
    //   path: "/user-settings",
    //   name: "user-settings",
    //   component: () => import("../views/user-views/UserSettingsView.vue"),
    //   meta: { requiresAuth: true },
    // },
    {
      path: "/userassets",
      name: "userassets",
      component: () => import("../views/user-views/UserAssetsView.vue"),
      meta: { requiresAuth: true },
    },
    // User Toolbox route commented out
    // {
    //   path: "/user-toolbox",
    //   name: "user-toolbox",
    //   component: UserToolboxView,
    //   meta: { requiresAuth: true },
    // },
    {
      path: "/delayedvulnerabilities",
      name: "delayedvulnerabilities",
      component: () => import("../views/user-views/DelayedvulnerabilitiesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/delayedvulnerabilitycard",
      name: "delayedvulnerabilitycard",
      component: () => import("../views/user-views/DelayedvulnerabilitycardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/userexception",
      name: "userexception",
      component: () => import("../views/user-views/UserExceptionsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/fixedvulnerabilities",
      name: "fixedvulnerabilities",
      component: () => import("../views/user-views/FixedvulnerabilitiesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/pendingvulnerabilities",
      name: "pendingvulnerabilities",
      component: () => import("../views/user-views/PendingvulnerabilitiesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/pendingvulnerabilitycard",
      name: "pendingvulnerabilitycard",
      component: () => import("../views/user-views/PendingvulnerabilitycardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/userVulnerabilityregister",
      name: "userVulnerabilityregister",
      component: () => import("../views/user-views/UserVulnerabilityregisterView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/user-vulnerabilitycard/:reportId/:asset",
      name: "UserVulFix",
      component: () => import("../views/user-views/UserVulnerabilityCardView.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-ticket/:reportId/:fixVulId/:asset?/:ticketId?",
      name: "UserCreateTicket",
      component: () => import("../views/user-views/UserCreateTicketView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/user-tickets",
      name: "UserTickets",
      component: () => import("../views/user-views/UserTicketsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/user-remediation-timeline/:reportId/:asset",
      name: "user-remediation-timeline",
      component: () => import("../views/user-views/UserRemediationTimelineView.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-calendar",
      name: "user-calendar",
      component: () => import("../views/user-views/UserCalendarView.vue"),
      meta: { requiresAuth: true },
    },

    // Catch-all: redirect any unknown route to /home
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home",
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top for these public confirmation / onboarding pages
    if (
      to.path === "/admindashboardonboarding" ||
      to.path === "/webinarform-thankyou" ||
      to.path === "/webinarform"
    ) {
      return { top: 0, left: 0 };
    }
    // For other routes, preserve default behavior
    return false;
  },
});

seedLockFromWindow();

router.beforeEach(async (to, from, next) => {
  const normalized = normalizeUserSetPasswordRoute(to);
  if (normalized) {
    return next({ ...normalized, replace: true });
  }

  // Magic link is ?invite= only. Never rewrite ?token= (User/Admin set-password).
  // /signup?invite= and other auth URLs open Home Get Started.
  const inviteToken = extractClaimInviteToken(to.query || {});
  if (inviteToken) {
    storeClaimInviteToken(inviteToken);
    try {
      await fetchClaimInviteValidate(inviteToken);
    } catch {
      /* Home modal still re-check */
    }
  }
  const inviteHomePaths = new Set([
    "/signup",
    "/signin",
    "/auth",
    "/login",
    "/usersignup",
    "/how-vaptfix-works",
  ]);
  if (inviteToken && inviteHomePaths.has(to.path)) {
    return next({
      path: "/home",
      query: { ...(to.query as Record<string, any>), invite: inviteToken },
      replace: true,
    });
  }

  // Teams/Slack bot handoff: ?source=teams|slack (keep across upload → pricing → Stripe).
  captureChatHandoffSource(to.query as Record<string, unknown>);

  // Slack / Teams signed admin_token → same JWT exchange as a normal login.
  const adminToken = readQueryAdminToken(to.query as Record<string, unknown>);
  if (adminToken) {
    const strippedQuery = { ...(to.query as Record<string, any>) };
    delete strippedQuery.admin_token;
    // Keep source=teams|slack in the URL after token exchange.
    captureChatHandoffSource(strippedQuery);
    const authStore = useAuthStore();
    const result = await authStore.exchangePricingHandoff(adminToken);
    if (!result.status) {
      storeHandoffError(
        result.message || "This link has expired. Go back to Teams and tap the button again.",
      );
    }
    markHandoffNavigation(to.path);
    markExternalDeepLink(to.path);
    return next({
      path: to.path,
      query: strippedQuery,
      hash: to.hash,
      replace: true,
    });
  }

  // Public marketing pages must always render (Chrome leftover login used to
  // bounce /home → dashboard → /home and leave a white screen).
  const isPublicMarketing = to.path === "/" || to.path === "/home";

  // Team members are whoever member-profile returns. Checked once per login.
  // This runs before the address-bar lock so a typed admin URL is never shown.
  const sessionToken =
    sessionStorage.getItem("authorization") || localStorage.getItem("authorization");
  const billingPath = to.path === "/pricingplan" || to.path === "/billing/success" || to.path === "/billing/cancel";
  if (sessionToken && (to.meta.requiresAdmin || billingPath)) {
    const authStore = useAuthStore();
    await authStore.resolveAccountRole();
    if (isStoredTeamMember()) {
      return next({ path: "/userdashboard", replace: true });
    }
  }

  // Typed URL / refresh (no previous in-app route). Stay on the last real page.
  // Deep links (Teams / Slack / email) skip this lock and use token auth only.
  const isAddressBarEntry = !from.matched.length;
  if (isAddressBarEntry && isAuthDeepLink(to)) {
    markExternalDeepLink(to.path);
  }
  if (isAddressBarEntry && !isRouteLockExempt(to) && !isAuthDeepLink(to) && !isPublicMarketing) {
    const locked = readLockedRoute();
    if (locked && !sameLockedRoute(locked, to.fullPath)) {
      // A leftover /home lock must not fight dashboard (or the other way around).
      if (!(hasAuthSession() && isPublicHomeLock(locked))) {
        return next(lockedLocation(locked));
      }
    }
    // No lock yet (or HMR missed afterEach) — never open inner pages from the address bar.
    if (!locked && to.meta.requiresAuth && to.path !== "/home") {
      return next({ path: "/home", replace: true });
    }
  }

  if (!to.meta.requiresAuth) return next();

  const token = sessionStorage.getItem("authorization") || localStorage.getItem("authorization");
  const allowHandoffErrorPage =
    hasHandoffError() &&
    isHandoffNavigation(to.path) &&
    (to.path === "/pricingplan" || to.path === "/admin-upload-report");

  if (!token && !allowHandoffErrorPage) {
    return next("/home");
  }

  // Signup → upload → choose plan → pay. Magic-link signup (file already attached) skips this.
  // A scan report on file is not payment — Premium still requires checkout.
  if (to.meta.requiresPaidPlan && !isClaimInviteFlow()) {
    if (isStoredTeamMember()) {
      return next({ path: "/userdashboard", replace: true });
    }
    try {
      const authStore = useAuthStore();
      // hasPaidPlan() itself is the single source of truth here — it already
      // short-circuits fast via hasCachedPaidPlan() once a checkout has
      // actually completed. A report on file (or the backend's "ready" /
      // showDashboard report-processing state) is NOT proof of payment —
      // Premium uploads its report before checkout — so neither may be used
      // to skip this check.
      const paid = await authStore.hasPaidPlan();
      if (paid) {
        return next();
      }
      const dest = await authStore.unpaidAdminContinuePath();
      if (to.path === dest) {
        return next();
      }
      return next({ path: dest, replace: true });
    } catch {
      return next({ path: "/admin-upload-report", replace: true });
    }
  }

  return next();
});

router.afterEach((to) => {
  if (!isRouteLockExempt(to)) {
    // Don't pin public /home while a session exists — that recreates the white-screen bounce.
    if (!(hasAuthSession() && isPublicHomeLock(to.fullPath))) {
      writeLockedRoute(to.fullPath);
    }
  }
  if (!isAuthDeepLink(to)) {
    clearExternalDeepLink();
  }
  clearHandoffNavigation();
  tryShowPostLoginSuccessAlert();
});

export default router;
