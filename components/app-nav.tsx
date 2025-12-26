'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FlaskConical, PlusSquare, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/analysis', label: 'Analyses', icon: FlaskConical },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {items.map((it) => {
        const active = pathname === it.href || pathname.startsWith(it.href + '/');
        const Icon = it.icon;
        return (
          <Button
            key={it.href}
            asChild
            variant={active ? 'secondary' : 'ghost'}
            className={cn('justify-start gap-2', active && 'font-semibold')}
          >
            {/* prefetch off helps avoid “prefetch before cookies” edge cases */}
            <Link href={it.href} prefetch={false}>
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
