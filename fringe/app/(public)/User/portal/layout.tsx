'use client';

import { AuthProvider } from '@/contexts/auth-context';
import PortalLayout from './Portallayout'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PortalLayout>{children}</PortalLayout>
    </AuthProvider>
  );
}
