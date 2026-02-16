import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface InviteOnlyUsernameFormProps {
  onSubmit: (username: string) => void;
  isSubmitting?: boolean;
}

export default function InviteOnlyUsernameForm({ onSubmit, isSubmitting }: InviteOnlyUsernameFormProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>TradingView Username Required</CardTitle>
        <CardDescription>This product requires invite-only access to TradingView</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            After purchase, provide your TradingView username. The admin will manually grant you access to the script.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tvUsername">TradingView Username</Label>
            <Input
              id="tvUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your TradingView username"
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !username.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit Username'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
