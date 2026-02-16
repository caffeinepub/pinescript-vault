import { useState } from 'react';
import { usePrincipalId } from '../../hooks/usePrincipalId';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PrincipalIdSection() {
  const { principalId } = usePrincipalId();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!principalId) return;

    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!principalId) {
    return (
      <div className="text-sm text-muted-foreground">
        No principal ID available. Please log in.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="principal-id">Your Principal ID</Label>
        <div className="flex gap-2">
          <Input
            id="principal-id"
            value={principalId}
            readOnly
            className="font-mono text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          This is your unique identifier on the Internet Computer. Keep it safe and share it only when necessary.
        </p>
      </div>
    </div>
  );
}
