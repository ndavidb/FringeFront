'use client';
import React from "react";
import Link from 'next/link';
import { IconUser } from '@tabler/icons-react';
import {
  Button,
  Image,
  Flex,
  Group,
  useMantineTheme,
} from "@mantine/core";

export default function HeaderSection() {
  const theme = useMantineTheme();
  
  return (
    <header style={{ 
      width: '100%', 
      borderBottom: '1px solid #eee', 
      backgroundColor: 'white', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100,
      padding: `${theme.spacing.md} 0`
    }}>
      <Flex justify="space-between" align="center" wrap="wrap" style={{ 
        gap: theme.spacing.lg, 
        width: '90%', 
        maxWidth: '1600px', 
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <Flex align="center" gap="xl">
          <Image src="/images/main-logo.svg" alt="Fringe Logo" width={180} />
          <Group gap="lg">
            <Button component="a" href="#about" variant="subtle" color="pink" size="md" fw={700}>About Us</Button>
            <Button component="a" href="#contact" variant="subtle" color="pink" size="md" fw={700}>Contact Us</Button>
          </Group>
        </Flex>
        <Flex align="center" gap="sm">
          <Button component={Link} href="/planner" color="purple" variant="outline" radius="md" size="md" fw={700}>User Planner</Button>
          <Button component={Link} href="/admin/login" leftSection={<IconUser size={18} />} color="purple" radius="md" size="md" fw={700}>Admin Log In</Button>
        </Flex>
      </Flex>
    </header>
  );
}