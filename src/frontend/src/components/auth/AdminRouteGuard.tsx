import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../../hooks/useAuthz';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to access the admin dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access the admin dashboard.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
