import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  onSubmit: (email: string, e: React.FormEvent) => void;
  loading: boolean;
};

const RequestForm = ({ onSubmit, loading }: Props) => {
  const [email, setEmail] = useState('');

  return (
    <form onSubmit={(e) => onSubmit(email, e)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          type="email"
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send code'}
      </Button>
    </form>
  );
};
export default RequestForm;
