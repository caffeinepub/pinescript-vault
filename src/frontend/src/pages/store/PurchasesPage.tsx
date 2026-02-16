import RequireAuth from '../../components/auth/RequireAuth';
import { useGetMyInviteStatuses } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function PurchasesPage() {
  const { data: inviteStatuses = [], isLoading } = useGetMyInviteStatuses();

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Purchases</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading purchases...</div>
        ) : inviteStatuses.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>You haven't made any purchases yet.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {inviteStatuses.map((invite, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>Product ID: {invite.productId}</CardTitle>
                    <Badge
                      variant={
                        invite.status === 'granted'
                          ? 'default'
                          : invite.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {invite.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">TradingView Username:</span> {invite.username}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Order ID:</span> {invite.orderId}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      {invite.status === 'granted'
                        ? 'Access granted - check your TradingView invites'
                        : invite.status === 'pending'
                          ? 'Pending admin approval'
                          : invite.status === 'expired'
                            ? 'Access expired'
                            : 'Username incorrect - please contact support'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
