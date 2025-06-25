import { Stack, Title } from '@mantine/core';
import { DashboardClient } from './_components/DashboardClient';

export default function DashboardPage() {
    return (
        <Stack gap="lg">
            <Stack gap={0}>
                <Title order={2}>Fringe Festival Dashboard</Title>
            </Stack>
            <DashboardClient />
        </Stack>
    );
}