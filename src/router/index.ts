import { createRouter, createWebHistory } from "vue-router";
// admin import
import Login from "../components/admin-component/Login.vue";
import HomeView from "../views/admin-views/HomeView.vue";
import LocationView from "../views/admin-views/LocationView.vue";
import Dashboard1View from "../views/admin-dashboard/Dashboard1View.vue";
import SignupView from "../views/admin-views/SignupView.vue";
import SignInView from "../views/admin-views/SignInView.vue";
import ForgotPasswordView from "../views/admin-views/ForgotPasswordView.vue";
import CreateNewTicketView from "../views/admin-dashboard/CreateNewTicketView.vue";
import SupportTicketView from "../views/admin-dashboard/SupportTicketView.vue";
import PendingView from "../views/admin-dashboard/PendingView.vue";
import FixesView from "../views/admin-dashboard/FixesView.vue";
import ExceptionsView from "../views/admin-dashboard/ExceptionsView.vue";
import VulnerabilityRegisterView from "../views/admin-dashboard/VulnerabilityRegisterView.vue";
import Onboarding1View from "../views/admin-dashboard/Onboarding1View.vue";
import AdminDashboardOnboardingView from "../views/admin-dashboard/AdminDashboardOnboardingView.vue";
import MitigationStrategyView from "../views/admin-dashboard/MitigationStrategyView.vue";
import AssetsView from "../views/admin-dashboard/AssetsView.vue";
import VulnerabilityExplorerView from "../views/admin-views/VulnerabilityExplorerView.vue";
import MissingSecurityUpdatesView from "../views/admin-dashboard/MissingSecurityUpdatesView.vue";
import UserMissingSecurityUpdatesView from "../views/user-views/UserMissingSecurityUpdatesView.vue";
import VulnerabilityCardView from "../views/admin-dashboard/VulnerabilityCardView.vue";
import YourTeamView from "../views/admin-dashboard/YourTeamView.vue";
import PricingplansView from "../views/admin-views/PricingplansView.vue";
import BillingSuccessView from "../views/admin-views/BillingSuccessView.vue";
import BillingCancelView from "../views/admin-views/BillingCancelView.vue";
import PartnerView from "../views/admin-views/PartnerView.vue";
import PartnerLeadPortalView from "../views/admin-views/PartnerLeadPortalView.vue";
import PartnerLeadThankYouView from "../views/admin-views/PartnerLeadThankYouView.vue";
import PartnerThankYouView from "../views/admin-views/PartnerThankYouView.vue";
import WebinarFormView from "../views/admin-views/WebinarFormView.vue";
import WebinarThankYouView from "../views/admin-views/WebinarThankYouView.vue";
import PrivacyPolicyView from "../views/admin-views/PrivacyPolicyView.vue";
import TermsOfServiceView from "../views/admin-views/TermsOfServiceView.vue";
import KnowledgeBaseView from "../views/admin-views/KnowledgeBaseView.vue";
import HowVaptfixWorksView from "../views/admin-views/HowVaptfixWorksView.vue";
import DataProcessingAgreementView from "../views/admin-views/DataProcessingAgreementView.vue";
import SupportCenterView from "../views/admin-views/SupportCenterView.vue";
import RiskCriteriaView from "../views/admin-views/RiskCriteriaView.vue";
import HowitWork from "../components/admin-component/HowitWork.vue";
import Profile from "../components/admin-component/Profile.vue";
import AdminManageAccountView from "../views/admin-dashboard/AdminManageAccountView.vue";
import AdminSettingsView from "../views/admin-dashboard/AdminSettingsView.vue";
import UserManageAccountView from "../views/user-views/UserManageAccountView.vue";
import UserSettingsView from "../views/user-views/UserSettingsView.vue";
import NotificationPanel from "../components/admin-component/NotificationPanel.vue";

// user import
import UserAssetsView from "../views/user-views/UserAssetsView.vue";
// import UserToolboxView from "../views/user-views/UserToolboxView.vue"; // Toolbox commented out
import DelayedvulnerabilitiesView from "../views/user-views/DelayedvulnerabilitiesView.vue";
import DelayedvulnerabilitycardView from "../views/user-views/DelayedvulnerabilitycardView.vue";
import UserExceptionsView from "../views/user-views/UserExceptionsView.vue";
import FixedvulnerabilitiesView from "../views/user-views/FixedvulnerabilitiesView.vue";
import PendingvulnerabilitiesView from "../views/user-views/PendingvulnerabilitiesView.vue";
import PendingvulnerabilitycardView from "../views/user-views/PendingvulnerabilitycardView.vue";
import UserVulnerabilityregisterView from "../views/user-views/UserVulnerabilityregisterView.vue";
import UserVulnerabilityCardView from "../views/user-views/UserVulnerabilityCardView.vue";
import UserCreateTicketView from "../views/user-views/UserCreateTicketView.vue";
import UserTicketsView from "../views/user-views/UserTicketsView.vue";
import UserDashboard1View from "../views/user-views/UserDashboard1View.vue";
import UserSignupView from "../views/user-views/UserSignupView.vue";
import ChooseAccountView from "../views/admin-views/ChooseAccountView.vue";
import AuthView from "../views/admin-views/AuthView.vue";
import JiraCallbackView from "../views/admin-views/JiraCallbackView.vue";
import SlackCallbackView from "../views/admin-views/SlackCallbackView.vue";
import ReportView from "../views/admin-dashboard/ReportView.vue";
import ScopeView from "../views/admin-dashboard/ScopeView.vue";
import MicrosoftCallbackView from "../views/admin-views/MicrosoftCallbackView.vue";
import PerformanceMonitoringView from "../views/admin-dashboard/PerformanceMonitoringView.vue";
import ViewReportPage from "../views/admin-dashboard/ViewReportPage.vue";
// import ToolboxView from "../views/admin-dashboard/ToolboxView.vue"; // Toolbox commented out
import WaitingForReportView from "../views/admin-dashboard/WaitingForReportView.vue";
import AdminUploadReportView from "../views/admin-dashboard/AdminUploadReportView.vue";
import RemediationTimelineView from "../views/admin-dashboard/RemediationTimelineView.vue";
import UserRemediationTimelineView from "../views/user-views/UserRemediationTimelineView.vue";
import CalendarView from "../views/admin-dashboard/CalendarView.vue";
import UserCalendarView from "../views/user-views/UserCalendarView.vue";
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
import { extractClaimInviteToken, isClaimInviteFlow, storeClaimInviteToken, setClaimInviteValid, setClaimInviteReportCount } from "../utils/claimInvite";
import { useAuthStore } from "../stores/authStore";
import { hasAuthSession, isStoredTeamMember } from "../utils/authenticatedHome";
import {
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
      component: Login,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/privacy",
      name: "privacy",
      component: PrivacyPolicyView,
    },
    {
      path: "/terms",
      name: "terms",
      component: TermsOfServiceView,
    },
    {
      path: "/knowledge-base",
      name: "knowledge-base",
      component: KnowledgeBaseView,
    },
    {
      path: "/how-vaptfix-works",
      name: "how-vaptfix-works",
      component: HowVaptfixWorksView,
    },
    {
      path: "/support",
      name: "public-support",
      component: SupportCenterView,
    },
    {
      path: "/dpa",
      name: "dpa",
      component: DataProcessingAgreementView,
    },
    {
      path: "/choose-account",
      redirect: "/auth",
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthView,
    },
    {
      path: "/pricingplan",
      name: "pricingplan",
      component: PricingplansView,
    },
    {
      path: "/billing/success",
      name: "billing-success",
      component: BillingSuccessView,
    },
    {
      path: "/billing/cancel",
      name: "billing-cancel",
      component: BillingCancelView,
    },
    {
      path: "/partner",
      name: "partner",
      component: PartnerView,
    },
    {
      path: "/partner-lead-portal",
      name: "partner-lead-portal",
      component: PartnerLeadPortalView,
    },
    {
      path: "/partner-lead-thankyou",
      name: "partner-lead-thankyou",
      component: PartnerLeadThankYouView,
    },
    {
      path: "/partner-thankyou",
      name: "partner-thankyou",
      component: PartnerThankYouView,
    },
    {
      path: "/webinarform",
      name: "webinarform",
      component: WebinarFormView,
    },
    {
      path: "/webinarform-thankyou",
      name: "webinarform-thankyou",
      component: WebinarThankYouView,
    },
    {
      path: "/vulnerabilityexplorer",
      name: "vulnerabilityexplorer",
      component: VulnerabilityExplorerView,
    },
    {
      path: "/communication",
      name: "communication",
      component: LocationView,
      meta: { requiresAuth: true, requiresAdmin: true, requiresPaidPlan: true },
    },
    {
      path: "/microsoft/callback",
      name: "MicrosoftCallback",
      component: MicrosoftCallbackView,
    },
    {
      path: "/riskcriteria",
      name: "riskcriteria",
      component: RiskCriteriaView,
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
      component: Onboarding1View,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admindashboardonboarding",
      name: "admindashboardonboarding",
      component: AdminDashboardOnboardingView,
      meta: { requiresAuth: true, requiresAdmin: true, requiresPaidPlan: true },
    },
    {
      path: "/scope",
      name: "scope",
      component: ScopeView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/mitigationstrategy",
      name: "mitigationstrategy",
      component: MitigationStrategyView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/remediation-timeline/:reportId/:asset",
      name: "remediation-timeline",
      component: RemediationTimelineView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/calendar",
      name: "calendar",
      component: CalendarView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/missingsecurityupdates",
      name: "missingsecurityupdates",
      component: MissingSecurityUpdatesView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/usermissingsecurityupdates",
      name: "usermissingsecurityupdates",
      component: UserMissingSecurityUpdatesView,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/vulnerabilitycard',
    //   name: 'vulnerabilitycard',
    //   component: VulnerabilityCardView,
    // },
    {
      path: "/vulnerabilitycard/:reportId/:asset",
      name: "VulFix",
      component: VulnerabilityCardView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/signin",
      name: "signin",
      component: SignInView,
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: ForgotPasswordView,
    },
    {
      path: "/dashboard1",
      name: "dashboard1",
      component: Dashboard1View,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // {
    //   path: '/createnewticket',
    //   name: 'createnewticket',
    //   component: CreateNewTicketView,
    // },
    {
      path: "/ticket/:reportId/:fixVulId/:asset?/:ticketId?",
      name: "CreateTicket",
      component: CreateNewTicketView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // {
    //   path: '/supportticket',
    //   name: 'supportticket',
    //   component: SupportTicketView,
    // },
    {
      // path: '/supportticket/:reportId',
      path: "/supportticket/:reportId?",
      name: "supportticket",
      component: SupportTicketView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/pending",
      name: "pending",
      component: PendingView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/fixes",
      name: "fixes",
      component: FixesView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/supportrequests",
      name: "exceptions",
      component: ExceptionsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/vulnerabilityregister",
      name: "vulnerabilityregister",
      component: VulnerabilityRegisterView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/report",
      name: "report",
      component: ReportView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/assets",
      name: "assets",
      component: AssetsView,
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
      component: PerformanceMonitoringView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/viewreport",
      name: "viewreport",
      component: ViewReportPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/waiting-for-report",
      name: "waiting-for-report",
      component: WaitingForReportView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin-upload-report",
      name: "admin-upload-report",
      component: AdminUploadReportView,
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
      component: YourTeamView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/howitwork",
      name: "howitwork",
      component: HowitWork,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/manage-account",
      name: "manage-account",
      component: AdminManageAccountView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // Settings route — hidden (commented out)
    // {
    //   path: "/settings",
    //   name: "settings",
    //   component: AdminSettingsView,
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
      component: HomeView,
    },
    {
      path: "/notification",
      name: "notification",
      component: NotificationPanel,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/jira/callback",
      name: "jira-callback",
      component: JiraCallbackView,
    },
    {
      path: "/slack/callback",
      name: "slack-callback",
      component: SlackCallbackView,
    },

    // user path
    {
      path: "/usersignup",
      redirect: "/auth",
    },
    {
      path: "/userdashboard",
      name: "userdashboard1",
      component: UserDashboard1View,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-manage-account",
      name: "user-manage-account",
      component: UserManageAccountView,
      meta: { requiresAuth: true },
    },
    // User settings route — hidden (commented out)
    // {
    //   path: "/user-settings",
    //   name: "user-settings",
    //   component: UserSettingsView,
    //   meta: { requiresAuth: true },
    // },
    {
      path: "/userassets",
      name: "userassets",
      component: UserAssetsView,
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
      component: DelayedvulnerabilitiesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/delayedvulnerabilitycard",
      name: "delayedvulnerabilitycard",
      component: DelayedvulnerabilitycardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/userexception",
      name: "userexception",
      component: UserExceptionsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/fixedvulnerabilities",
      name: "fixedvulnerabilities",
      component: FixedvulnerabilitiesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/pendingvulnerabilities",
      name: "pendingvulnerabilities",
      component: PendingvulnerabilitiesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/pendingvulnerabilitycard",
      name: "pendingvulnerabilitycard",
      component: PendingvulnerabilitycardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/userVulnerabilityregister",
      name: "userVulnerabilityregister",
      component: UserVulnerabilityregisterView,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-vulnerabilitycard/:reportId/:asset",
      name: "UserVulFix",
      component: UserVulnerabilityCardView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-ticket/:reportId/:fixVulId/:asset?/:ticketId?",
      name: "UserCreateTicket",
      component: UserCreateTicketView,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-tickets",
      name: "UserTickets",
      component: UserTicketsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-remediation-timeline/:reportId/:asset",
      name: "user-remediation-timeline",
      component: UserRemediationTimelineView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-calendar",
      name: "user-calendar",
      component: UserCalendarView,
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
  const inviteToken = extractClaimInviteToken(to.query || {});
  if (inviteToken) {
    storeClaimInviteToken(inviteToken);
    try {
      const authStore = useAuthStore();
      void authStore.validateClaimInvite(inviteToken).then((res) => {
        setClaimInviteValid(!res.expired);
        if (!res.expired) setClaimInviteReportCount(res.report_count || 1);
      });
    } catch {
      /* Pinia may not be ready on the very first tick */
    }
  }
  const inviteSignupPaths = new Set([
    "/signup",
    "/signin",
    "/auth",
    "/login",
    "/usersignup",
    "/how-vaptfix-works",
  ]);
  if (inviteToken && inviteSignupPaths.has(to.path)) {
    return next({
      path: "/home",
      query: { ...(to.query as Record<string, any>), invite: inviteToken },
      replace: true,
    });
  }

  // Slack / Teams signed admin_token → same JWT exchange as a normal login.
  const adminToken = readQueryAdminToken(to.query as Record<string, unknown>);
  if (adminToken) {
    const strippedQuery = { ...(to.query as Record<string, any>) };
    delete strippedQuery.admin_token;
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

  if (to.meta.requiresAdmin && token) {
    try {
      const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      // Team-member accounts carry a Member_role array; admin accounts do not.
      if (user && Array.isArray(user.Member_role)) {
        return next({ path: "/userdashboard", replace: true });
      }
    } catch {
      // Unparseable user object — let the page's own API call surface the 401.
    }
  }

  // Signup → upload → choose plan → pay. Magic-link signup (file already attached) skips this.
  // A scan report on file is not payment — Premium still requires checkout.
  if (to.meta.requiresPaidPlan && !isClaimInviteFlow()) {
    if (isStoredTeamMember()) {
      return next({ path: "/userdashboard", replace: true });
    }
    try {
      const authStore = useAuthStore();
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
