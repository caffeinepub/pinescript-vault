import RequireAuth from '../../components/auth/RequireAuth';
import PrincipalIdSection from '../../components/account/PrincipalIdSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and Internet Identity details.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Internet Identity</CardTitle>
              <CardDescription>
                Your unique Internet Identity Principal ID. You may need this for admin access or support requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrincipalIdSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
