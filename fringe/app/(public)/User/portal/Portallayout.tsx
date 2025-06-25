'use client';

import React from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Title,
  Button,
  Flex,
  Burger,
} from '@mantine/core';
import { useAuth } from '@/contexts/auth-context';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import UserNavbar from './components/UserNavbar';

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { logout } = useAuth();
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/User/login');
  };

  return (
    <AppShell
      padding="md"
      withBorder
      layout="alt"
      header={{ height: 70 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShellHeader withBorder={false}>
        <Flex justify="space-between" align="center" px="md" h="100%">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={4}>User Dashboard</Title>
          </Group>
          <Button color="pink.8" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </AppShellHeader>

      <AppShellNavbar>
        <Group px="md" pt="md" hiddenFrom="sm">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
        <UserNavbar />
      </AppShellNavbar>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
