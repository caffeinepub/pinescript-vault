import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAssignUserRole } from '../../hooks/useAuthz';
import { UserRole } from '../../backend';
import { toast } from 'sonner';
import { UserPlus, Info } from 'lucide-react';

export default function AdminUsersPage() {
  const [principalId, setPrincipalId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);
  const assignRole = useAssignUserRole();

  const handleAssignRole = async () => {
    if (!principalId.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      await assignRole.mutateAsync({
        principal: principalId.trim(),
        role: selectedRole,
      });
      toast.success(`Successfully assigned ${selectedRole} role to user`);
      setPrincipalId('');
      setSelectedRole(UserRole.user);
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast.error(error.message || 'Failed to assign role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">User Management</h2>
        <p className="text-muted-foreground mt-2">Assign roles to users by their Principal ID</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>About User Roles</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Admin:</strong> Full access to all admin features and settings</li>
            <li><strong>User:</strong> Standard authenticated user with access to purchases</li>
            <li><strong>Guest:</strong> Unauthenticated visitor with limited access</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign User Role
          </CardTitle>
          <CardDescription>
            Enter a user's Principal ID and select the role you want to assign to them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principalId">Principal ID</Label>
            <Input
              id="principalId"
              placeholder="e.g., 7bzkw-ue5am-s2c6f-jvpfm-5uxw7-dkk76-u56hj-psrgc-hja4r-mztcz-xqe"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              The Internet Identity Principal ID of the user
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.admin}>Admin</SelectItem>
                <SelectItem value={UserRole.user}>User</SelectItem>
                <SelectItem value={UserRole.guest}>Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAssignRole}
            disabled={assignRole.isPending || !principalId.trim()}
            className="w-full"
          >
            {assignRole.isPending ? 'Assigning Role...' : 'Assign Role'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Quick Action</CardTitle>
          <CardDescription>Grant admin access to a specific user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Principal ID</Label>
            <Input
              value="7bzkw-ue5am-s2c6f-jvpfm-5uxw7-dkk76-u56hj-psrgc-hja4r-mztcz-xqe"
              readOnly
              className="font-mono text-sm bg-background"
            />
          </div>
          <Button
            onClick={() => {
              setPrincipalId('7bzkw-ue5am-s2c6f-jvpfm-5uxw7-dkk76-u56hj-psrgc-hja4r-mztcz-xqe');
              setSelectedRole(UserRole.admin);
              setTimeout(() => handleAssignRole(), 100);
            }}
            disabled={assignRole.isPending}
            variant="default"
            className="w-full"
          >
            Grant Admin Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
