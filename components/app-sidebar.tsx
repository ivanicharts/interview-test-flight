'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FlaskConical, Settings } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarHeader } from '@/components/ui/sidebar';

const navItems = [
  { url: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { url: '/documents', title: 'Documents', icon: FileText },
  { url: '/analysis', title: 'Analyses', icon: FlaskConical },
  { url: '/settings', title: 'Settings', icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const itemsWithActive = navItems.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavMain items={itemsWithActive} />
      </SidebarHeader>
    </Sidebar>
  );
}
