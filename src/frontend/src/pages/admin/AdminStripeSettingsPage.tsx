import { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { useIsStripeConfigured } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminStripeSettingsPage() {
  const { actor } = useActor();
  const { data: isConfigured, refetch } = useIsStripeConfigured();
  const [secretKey, setSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('US,CA,GB');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;

    try {
      setSaving(true);
      await actor.setStripeConfiguration({
        secretKey,
        allowedCountries: allowedCountries.split(',').map((c) => c.trim()),
      });
      toast.success('Stripe configuration saved successfully');
      setSecretKey('');
      refetch();
    } catch (error) {
      console.error('Stripe config error:', error);
      toast.error('Failed to save Stripe configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Payment Settings</CardTitle>
        <CardDescription>Configure your Stripe integration for payment processing</CardDescription>
      </CardHeader>
      <CardContent>
        {isConfigured && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>Stripe is currently configured. Update settings below if needed.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key *</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Your Stripe secret key. Find this in your Stripe dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedCountries">Allowed Countries *</Label>
            <Input
              id="allowedCountries"
              value={allowedCountries}
              onChange={(e) => setAllowedCountries(e.target.value)}
              placeholder="US,CA,GB"
              required
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of country codes (e.g., US,CA,GB,AU)
            </p>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Keep your Stripe secret key secure. Never share it publicly or commit it to
            version control.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
