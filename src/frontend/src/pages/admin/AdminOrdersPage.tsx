import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders & Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Order tracking will be available once the backend order storage is implemented. For now, check your Stripe
            dashboard for payment records.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
