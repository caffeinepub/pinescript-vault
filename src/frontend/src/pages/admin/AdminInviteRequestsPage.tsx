import { useGetInviteStatuses, useUpdateInviteStatus } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { InviteStatusType } from '../../backend';

export default function AdminInviteRequestsPage() {
  const { data: inviteStatuses = [], isLoading } = useGetInviteStatuses();
  const updateStatus = useUpdateInviteStatus();

  const handleStatusUpdate = async (
    username: string,
    newStatus: InviteStatusType,
    productId: string,
    orderId: string,
    buyer: string
  ) => {
    try {
      await updateStatus.mutateAsync({
        username,
        status: newStatus,
        productId,
        orderId,
        buyer: { toText: () => buyer } as any,
      });
      toast.success('Invite status updated');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite-Only Access Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading invite requests...</div>
        ) : inviteStatuses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No invite requests yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TradingView Username</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteStatuses.map((invite, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{invite.username}</TableCell>
                  <TableCell className="text-xs">{invite.productId}</TableCell>
                  <TableCell className="text-xs">{invite.orderId}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Select
                      value={invite.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(
                          invite.username,
                          value as InviteStatusType,
                          invite.productId,
                          invite.orderId,
                          invite.buyer.toString()
                        )
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="granted">Granted</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="usernameIncorrect">Username Incorrect</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
