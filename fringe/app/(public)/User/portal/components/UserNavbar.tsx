'use client';

import Link from 'next/link';
import { Stack, Image } from '@mantine/core';
import { IconLayoutDashboard, IconCalendarEvent, IconUser, IconSettings } from '@tabler/icons-react';
import styles from './UserNavbar.module.css';

export default function UserNavbar() {
  return (
    <div className={styles.navbar}>
      <Image src="/images/main-logo.svg" alt="Logo" width={10} mb="lg" />

      <Stack gap="sm">
        <Link href="/User/portal/Dashboard" className={styles.link}>
          <span className={styles.linkContent}>
            <IconLayoutDashboard size={20} color="#ed1e79" />
            <span>Dashboard</span>
          </span>
        </Link>

        <Link href="/User/portal/booking" className={styles.link}>
          <span className={styles.linkContent}>
            <IconCalendarEvent size={20} color="#ed1e79" />
            <span>My Bookings</span>
          </span>
        </Link>

        <Link href="/User/portal/profile" className={styles.link}>
          <span className={styles.linkContent}>
            <IconUser size={20} color="#ed1e79" />
            <span>Profile</span>
          </span>
        </Link>

        <Link href="/User/portal/support" className={styles.link}>
          <span className={styles.linkContent}>
            <IconSettings size={20} color="#ed1e79" />
            <span>Support</span>
          </span>
        </Link>
      </Stack>
    </div>
  );
}
