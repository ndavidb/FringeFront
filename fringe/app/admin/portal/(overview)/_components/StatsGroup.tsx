// app/dashboard/_components/StatsGroup.tsx
'use client';
import { Card, Text, Group, SimpleGrid } from '@mantine/core';
import classes from './StatsGroup.module.css';

interface Stat {
    title: string;
    value: string;
    description: string;
}

interface StatsGroupProps {
    stats: Stat[];
}

export function StatsGroup({ stats }: StatsGroupProps) {
    const items = stats.map((stat) => (
        <Card key={stat.title} withBorder p="md" radius="md">
            <Group justify="space-between">
                <Text size="xs" c="dimmed" className={classes.title}>
                    {stat.title}
                </Text>
            </Group>

            <Group align="flex-end" gap="xs" mt={25}>
                <Text className={classes.value}>{stat.value}</Text>
            </Group>

            <Text fz="xs" c="dimmed" mt={7}>
                {stat.description}
            </Text>
        </Card>
    ));

    // --- CHANGE: Adjusted 'cols' to fit 3 items better on medium screens and up ---
    return <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>{items}</SimpleGrid>;
}