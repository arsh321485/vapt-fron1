import { createRouter, createWebHistory } from 'vue-router'
// admin import
import Login from '../components/admin-component/Login.vue'
import HomeView from '../views/admin-views/HomeView.vue'
import LocationView from '../views/admin-views/LocationView.vue'
import Dashboard1View from '../views/admin-dashboard/Dashboard1View.vue'
import SignupView from '../views/admin-views/SignupView.vue'
import SignInView from '../views/admin-views/SignInView.vue'
import ForgotPasswordView from '../views/admin-views/ForgotPasswordView.vue'
import CreateNewTicketView from '../views/admin-dashboard/CreateNewTicketView.vue'
import SupportTicketView from '../views/admin-dashboard/SupportTicketView.vue'
import PendingView from '../views/admin-dashboard/PendingView.vue'
import FixesView from '../views/admin-dashboard/FixesView.vue'
import ExceptionsView from '../views/admin-dashboard/ExceptionsView.vue'
import VulnerabilityRegisterView from '../views/admin-dashboard/VulnerabilityRegisterView.vue'
import Onboarding1View from '../views/admin-dashboard/Onboarding1View.vue'
import AdminDashboardOnboardingView from '../views/admin-dashboard/AdminDashboardOnboardingView.vue'
import MitigationStrategyView from '../views/admin-dashboard/MitigationStrategyView.vue'
import AssetsView from '../views/admin-dashboard/AssetsView.vue'
import VulnerabilityExplorerView from '../views/admin-views/VulnerabilityExplorerView.vue'
import MissingSecurityUpdatesView from '../views/admin-dashboard/MissingSecurityUpdatesView.vue'
import UserMissingSecurityUpdatesView from '../views/user-views/UserMissingSecurityUpdatesView.vue'
import VulnerabilityCardView from '../views/admin-dashboard/VulnerabilityCardView.vue'
import YourTeamView from '../views/admin-dashboard/YourTeamView.vue'
import PricingplansView from '../views/admin-views/PricingplansView.vue'
import RiskCriteriaView from '../views/admin-views/RiskCriteriaView.vue'
import HowitWork from '../components/admin-component/HowitWork.vue'
import Profile from '../components/admin-component/Profile.vue'
import ResetPasswordView from '../views/admin-views/ResetPasswordView.vue'
import NotificationPanel from '../components/admin-component/NotificationPanel.vue'

// user import
import UserAssetsView from '../views/user-views/UserAssetsView.vue'
import DelayedvulnerabilitiesView from '../views/user-views/DelayedvulnerabilitiesView.vue'
import DelayedvulnerabilitycardView from '../views/user-views/DelayedvulnerabilitycardView.vue'
import UserExceptionsView from '../views/user-views/UserExceptionsView.vue'
import FixedvulnerabilitiesView from '../views/user-views/FixedvulnerabilitiesView.vue'
import PendingvulnerabilitiesView from '../views/user-views/PendingvulnerabilitiesView.vue'
import PendingvulnerabilitycardView from '../views/user-views/PendingvulnerabilitycardView.vue'
import UserVulnerabilityregisterView from '../views/user-views/UserVulnerabilityregisterView.vue'
import UserVulnerabilityCardView from '../views/user-views/UserVulnerabilityCardView.vue'
import UserCreateTicketView from '../views/user-views/UserCreateTicketView.vue'
import UserTicketsView from '../views/user-views/UserTicketsView.vue'
import UserDashboard1View from '../views/user-views/UserDashboard1View.vue'
import UserSignupView from '../views/user-views/UserSignupView.vue'
import ChooseAccountView from '../views/admin-views/ChooseAccountView.vue'
import AuthView from '../views/admin-views/AuthView.vue'
import JiraCallbackView from '../views/admin-views/JiraCallbackView.vue'
import SlackCallbackView from '../views/admin-views/SlackCallbackView.vue'
import ReportView from '../views/admin-dashboard/ReportView.vue'
import ScopeView from '../views/admin-dashboard/ScopeView.vue'
import MicrosoftCallbackView from '../views/admin-views/MicrosoftCallbackView.vue'
import PerformanceMonitoringView from '../views/admin-dashboard/PerformanceMonitoringView.vue'
import ViewReportPage from '../views/admin-dashboard/ViewReportPage.vue'
import ScopingFormView from '../views/admin-dashboard/ScopingFormView.vue'
import ScopingFormView2 from '../views/admin-dashboard/ScopingFormView2.vue'
import UserSetPasswordView from '../views/user-views/UserSetPasswordView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // admin path
   
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/choose-account",
      redirect: "/auth"
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/pricingplan',
      name: 'pricingplan',
      component: PricingplansView,
    },
    {
      path: '/vulnerabilityexplorer',
      name: 'vulnerabilityexplorer',
      component: VulnerabilityExplorerView,
    },
    {
      path: '/communication',
      name: 'communication',
      component: LocationView,
    },
    {
      path: "/microsoft/callback",
      name: "MicrosoftCallback",
      component: MicrosoftCallbackView
    },
    {
      path: '/riskcriteria',
      name: 'riskcriteria',
      component: RiskCriteriaView,
    },
    // {
    //   path: '/uploadreport',
    //   name: 'uploadreport',
    //   component: UploadReportView,
    // },
    {
      path: '/onboarding1',
      name: 'onboarding1',
      component: Onboarding1View,
    },
    {
      path: '/admindashboardonboarding',
      name: 'admindashboardonboarding',
      component: AdminDashboardOnboardingView,
    },
    {
      path: '/scope',
      name: 'scope',
      component: ScopeView,
    },
    {
      path: '/mitigationstrategy',
      name: 'mitigationstrategy',
      component: MitigationStrategyView,
    },
    {
      path: '/missingsecurityupdates',
      name: 'missingsecurityupdates',
      component: MissingSecurityUpdatesView,
    },
    {
      path: '/usermissingsecurityupdates',
      name: 'usermissingsecurityupdates',
      component: UserMissingSecurityUpdatesView,
    },
    // {
    //   path: '/vulnerabilitycard',
    //   name: 'vulnerabilitycard',
    //   component: VulnerabilityCardView,
    // },
    {
      path: '/vulnerabilitycard/:reportId/:asset',
      name: "VulFix",
      component: VulnerabilityCardView,
      props: true
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: ForgotPasswordView,
    },
    {
      path: '/dashboard1',
      name: 'dashboard1',
      component: Dashboard1View,
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
},
    // {
    //   path: '/supportticket',
    //   name: 'supportticket',
    //   component: SupportTicketView,
    // },
    {
  // path: '/supportticket/:reportId',
  path: '/supportticket/:reportId?',
  name: 'supportticket',
  component: SupportTicketView,
  props: true
},
    {
      path: '/pending',
      name: 'pending',
      component: PendingView,
    },
    {
      path: '/fixes',
      name: 'fixes',
      component: FixesView,
    },
    {
      path: '/supportrequests',
      name: 'exceptions',
      component: ExceptionsView,
    },
    {
      path: '/vulnerabilityregister',
      name: 'vulnerabilityregister',
      component: VulnerabilityRegisterView,
    }, 
    {
      path: '/report',
      name: 'report',
      component: ReportView,
    }, 
    {
      path: '/assets',
      name: 'assets',
      component: AssetsView,
    },
    {
      path: '/performance-monitoring',
      name: 'performance-monitoring',
      component: PerformanceMonitoringView,
    },
    {
      path: '/viewreport',
      name: 'viewreport',
      component: ViewReportPage,
    },
    {
      path: '/scoping-form',
      name: 'scoping-form',
      component: ScopingFormView,
    },
    {
      path: '/scoping-form-2',
      name: 'scoping-form-2',
      component: ScopingFormView2,
    },
    {
      path: '/yourteam',
      name: 'yourteam',
      component: YourTeamView,
    },
    {
      path: '/howitwork',
      name: 'howitwork',
      component: HowitWork,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/set-password/:uidb64/:token',
      name: 'set-password',
      component: ResetPasswordView
    },
    {
      path: '/user-set-password/:uidb64/:token',
      name: 'user-set-password',
      component: UserSetPasswordView,
    },
    {
      path: '/reset-password/:uidb64/:token',
      name: 'reset-password',
      component: ResetPasswordView
    },
    {
      path: '/notification',
      name: 'notification',
      component: NotificationPanel,
    },
    {
      path: '/jira/callback',
      name: 'jira-callback',
      component: JiraCallbackView,
    },
    {
      path: '/slack/callback',
      name: 'slack-callback',
      component: SlackCallbackView,
    },

    // user path
    {
      path: '/usersignup',
      redirect: '/auth'
    },
    {
      path: '/userdashboard',
      name: 'userdashboard1',
      component: UserDashboard1View,
    },
    {
      path: '/userassets',
      name: 'userassets',
      component: UserAssetsView,
    },
    {
      path: '/delayedvulnerabilities',
      name: 'delayedvulnerabilities',
      component: DelayedvulnerabilitiesView,
    },
    {
      path: '/delayedvulnerabilitycard',
      name: 'delayedvulnerabilitycard',
      component: DelayedvulnerabilitycardView,
    },
    {
      path: '/userexception',
      name: 'userexception',
      component: UserExceptionsView,
    },
    {
      path: '/fixedvulnerabilities',
      name: 'fixedvulnerabilities',
      component: FixedvulnerabilitiesView,
    },
    {
      path: '/pendingvulnerabilities',
      name: 'pendingvulnerabilities',
      component: PendingvulnerabilitiesView,
    },
    {
      path: '/pendingvulnerabilitycard',
      name: 'pendingvulnerabilitycard',
      component: PendingvulnerabilitycardView,
    },
    {
      path: '/userVulnerabilityregister',
      name: 'userVulnerabilityregister',
      component: UserVulnerabilityregisterView,
    },
    {
      path: '/user-vulnerabilitycard/:reportId/:asset',
      name: 'UserVulFix',
      component: UserVulnerabilityCardView,
      props: true
    },
    {
      path: '/user-ticket/:reportId/:fixVulId/:asset?/:ticketId?',
      name: 'UserCreateTicket',
      component: UserCreateTicketView,
    },
    {
      path: '/user-tickets',
      name: 'UserTickets',
      component: UserTicketsView,
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top only when navigating to admin dashboard onboarding
    if (to.path === '/admindashboardonboarding') {
      return { top: 0 }
    }
    // For other routes, preserve default behavior
    return false
  }
})

export default router
