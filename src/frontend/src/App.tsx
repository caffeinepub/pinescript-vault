import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import StoreLayout from './components/layout/StoreLayout';
import HomePage from './pages/store/HomePage';
import ProductDetailPage from './pages/store/ProductDetailPage';
import CategoryListingPage from './pages/store/CategoryListingPage';
import BundlesListingPage from './pages/store/BundlesListingPage';
import BundleDetailPage from './pages/store/BundleDetailPage';
import PurchasesPage from './pages/store/PurchasesPage';
import AccountPage from './pages/store/AccountPage';
import PaymentSuccessPage from './pages/payments/PaymentSuccessPage';
import PaymentFailurePage from './pages/payments/PaymentFailurePage';
import DisclaimerPage from './pages/legal/DisclaimerPage';
import TermsPage from './pages/legal/TermsPage';
import RefundPolicyPage from './pages/legal/RefundPolicyPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminBundlesPage from './pages/admin/AdminBundlesPage';
import AdminStripeSettingsPage from './pages/admin/AdminStripeSettingsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminInviteRequestsPage from './pages/admin/AdminInviteRequestsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

const rootRoute = createRootRoute({
  component: () => (
    <StoreLayout>
      <Outlet />
    </StoreLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryName',
  component: CategoryListingPage,
});

const bundlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bundles',
  component: BundlesListingPage,
});

const bundleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bundle/$bundleId',
  component: BundleDetailPage,
});

const purchasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/purchases',
  component: PurchasesPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/disclaimer',
  component: DisclaimerPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const refundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/refund-policy',
  component: RefundPolicyPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicyPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardLayout,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/products',
  component: AdminProductsPage,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/categories',
  component: AdminCategoriesPage,
});

const adminBundlesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/bundles',
  component: AdminBundlesPage,
});

const adminStripeRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/stripe',
  component: AdminStripeSettingsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: AdminOrdersPage,
});

const adminInvitesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/invites',
  component: AdminInviteRequestsPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: AdminUsersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productRoute,
  categoryRoute,
  bundlesRoute,
  bundleRoute,
  purchasesRoute,
  accountRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  disclaimerRoute,
  termsRoute,
  refundRoute,
  privacyRoute,
  adminRoute.addChildren([
    adminProductsRoute,
    adminCategoriesRoute,
    adminBundlesRoute,
    adminStripeRoute,
    adminOrdersRoute,
    adminInvitesRoute,
    adminUsersRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
