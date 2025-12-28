import { useState, useEffect } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type Props = {
  onSubmit: (token: string, e: React.FormEvent) => void;
  onGoBack: () => void;
  onRetry: () => void;
  email: string;
  loading: boolean;
};

const SubmitForm = ({ onSubmit, onGoBack, onRetry, email, loading }: Props) => {
  const [token, setToken] = useState('');

  // small QoL: allow resend cooldown
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleRetry = () => {
    setCooldown(60);
    onRetry();
  };

  return (
    <form onSubmit={(e) => onSubmit(token, e)} className="grid gap-4">
      <div className="grid">
        <Label>Email</Label>
        <div className="flex items-center justify-between gap-2">
          <div className="text-muted-foreground line-clamp-1 text-sm">{email.trim()}</div>
          <Button type="button" variant="ghost" size="sm" onClick={onGoBack}>
            Change
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="token">6-digit code</Label>
        <Input
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="12345678"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          required
        />
      </div>

      <Button type="submit" loading={loading}>
        Verify & sign in
      </Button>

      <Separator />

      <div className="flex items-center justify-end">
        <Button type="button" variant="outline" disabled={loading || cooldown > 0} onClick={handleRetry}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </Button>
      </div>

      <p className="text-muted-foreground text-xs">Didn't get it? Check spam folder.</p>
    </form>
  );
};
export default SubmitForm;
