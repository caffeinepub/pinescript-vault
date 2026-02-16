import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import LoginButton from './LoginButton';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto py-12">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to access your purchases and downloads.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <LoginButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
