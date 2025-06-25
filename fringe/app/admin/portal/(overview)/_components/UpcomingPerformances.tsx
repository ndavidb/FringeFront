// app/dashboard/_components/UpcomingPerformances.tsx
'use client';
import { Performance } from '@/types/api/performance';
import { Card, Title, Text, Stack, Group, Badge } from '@mantine/core';

interface UpcomingPerformancesProps {
    performances: Performance[];
}

export function UpcomingPerformances({ performances }: UpcomingPerformancesProps) {

    return (
        <Card withBorder radius="md" p="lg" h="100%">
            <Title order={4}>Upcoming Performances</Title>
            <Text c="dimmed" fz="sm" mb="lg">The next 5 scheduled performances.</Text>
            <Stack>
                {performances.length > 0 ? (
                    performances.map(p => (
                        <Card key={p.performanceId} withBorder radius="sm" p="sm">
                            <Text fw={500} size="sm">{p.showName}</Text> {/**/}
                            <Text size="xs" c="dimmed">{p.venueName}</Text> {/**/}
                            <Group justify="space-between" mt="xs">
                                <Badge color="gray" variant="light">
                                    {new Date(p.performanceDate).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })} {/**/}
                                </Badge>
                                {/*<Text size="xs">{formatTime(p.startTime)}</Text> /!**!/*/}
                            </Group>
                        </Card>
                    ))
                ) : (
                    <Text c="dimmed" ta="center" mt="xl">No upcoming performances.</Text>
                )}
            </Stack>
        </Card>
    );
}