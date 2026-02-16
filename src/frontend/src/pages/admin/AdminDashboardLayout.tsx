import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Package,
  FolderTree,
  PackageOpen,
  CreditCard,
  ShoppingCart,
  UserCheck,
  ArrowLeft,
  Users,
} from 'lucide-react';

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/bundles', label: 'Bundles', icon: PackageOpen },
    { path: '/admin/stripe', label: 'Stripe Settings', icon: CreditCard },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/invites', label: 'Invite Requests', icon: UserCheck },
    { path: '/admin/users', label: 'User Management', icon: Users },
  ];

  return (
    <AdminRouteGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 p-4 h-fit">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => navigate({ to: item.path as any })}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </Card>

          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
