'use client';

import { Box, Title, Paper, Group, Button, Text, SimpleGrid, RingProgress, Center, Skeleton, Alert } from '@mantine/core';
import PerformancesTable from './components/PerformanceTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPerformances } from '@/services/performanceService';
import {
    IconCalendarEvent,
    IconRefresh,
    IconAlertCircle,
    IconCheck,
    IconX,
} from '@tabler/icons-react';

export default function PerformanceManagementPage() {
    const queryClient = useQueryClient();

    // Fetch performances data
    const {
        data: performances = [],
        isLoading: isLoadingPerformances,
        error: performancesError
    } = useQuery({
        queryKey: ['performances'],
        queryFn: getPerformances,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Calculate total performances
    const totalPerformances = performances.length;

    // Calculate active performances and percentage
    const activePerformances = performances.filter(p => p.active && !p.cancel).length;
    const activePerformancesPercent = totalPerformances > 0
        ? Math.round((activePerformances / totalPerformances) * 100)
        : 0;



    // Calculate upcoming performances (future date)
    const currentDate = new Date();
    const upcomingPerformances = performances.filter(p =>
        new Date(p.performanceDate) > currentDate && !p.cancel
    ).length;

    // Calculate general admission vs reserved seating
    // const generalAdmissionPerformances = performances.filter(
    //     p => p.seatingType === SeatingType.NUMBER_0
    // ).length;
    // const generalAdmissionPercent = totalPerformances > 0
    //     ? Math.round((generalAdmissionPerformances / totalPerformances) * 100)
    //     : 0;

    // Handle refresh
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['performances'] });
    };

    // If there's an error fetching performances
    if (performancesError) {
        return (
            <Box p="md">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error Loading Data"
                    color="red"
                >
                    {(performancesError as Error).message || "Failed to load performance data"}
                </Alert>
                <PerformancesTable />
            </Box>
        );
    }

    return (
        <Box p="xs">
            <Paper p="md" mb="lg" withBorder radius="md">
                <Group justify="space-between" mb="md">
                    <Title order={2}>Performance Dashboard</Title>
                    <Button
                        leftSection={<IconRefresh size="1rem" />}
                        variant="subtle"
                        color="gray"
                        onClick={handleRefresh}
                        loading={isLoadingPerformances}
                    >
                        Refresh Data
                    </Button>
                </Group>

                <Text size="sm" c="dimmed" mb="lg">
                    Monitor and manage all your festival performances with real-time statistics and status updates.
                </Text>

                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
                    {isLoadingPerformances ? (
                        <>
                            <Skeleton height={120} radius="md" />
                            <Skeleton height={120} radius="md" />
                            <Skeleton height={120} radius="md" />
                            <Skeleton height={120} radius="md" />
                        </>
                    ) : (
                        <>
                            <StatCard
                                title="Total Performances"
                                value={totalPerformances.toString()}
                                color="blue"
                                icon={<IconCalendarEvent size={30} />}
                            />
                            <StatCard
                                title="Active Performances"
                                value={activePerformances.toString()}
                                color="green"
                                icon={<IconCheck size={30} />}
                                percent={activePerformancesPercent}
                            />
                            <StatCard
                                title="Cancelled Performances"
                                value={performances.filter(p => p.cancel).length.toString()}
                                color="red"
                                icon={<IconX size={30} />}
                            />
                            <StatCard
                                title="Upcoming Performances"
                                value={upcomingPerformances.toString()}
                                color="pink.8"
                                icon={<IconCalendarEvent size={30} />}
                            />
                            {/*<StatCard*/}
                            {/*    title="General Admission"*/}
                            {/*    value={generalAdmissionPerformances.toString()}*/}
                            {/*    color="grape"*/}
                            {/*    icon={<IconCurrencyDollar size={30} />}*/}
                            {/*    percent={generalAdmissionPercent}*/}
                            {/*/>*/}
                            {/*<StatCard*/}
                            {/*    title="Reserved Seating"*/}
                            {/*    value={(totalPerformances - generalAdmissionPerformances).toString()}*/}
                            {/*    color="orange"*/}
                            {/*    icon={<IconTicket size={30} />}*/}
                            {/*    percent={100 - generalAdmissionPercent}*/}
                            {/*/>*/}
                        </>
                    )}
                </SimpleGrid>
            </Paper>

            <PerformancesTable />
        </Box>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    color: string;
    icon: React.ReactNode;
    percent?: number;
}

function StatCard({ title, value, color, icon, percent }: StatCardProps) {
    return (
        <Paper withBorder p="md" radius="md">
            <Group>
                <Center>
                    {percent !== undefined ? (
                        <RingProgress
                            size={80}
                            roundCaps
                            thickness={8}
                            sections={[{ value: percent, color }]}
                            label={
                                <Center>
                                    {icon}
                                </Center>
                            }
                        />
                    ) : (
                        <Box style={{ color }} p="md">
                            {icon}
                        </Box>
                    )}
                </Center>

                <Box>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                        {title}
                    </Text>
                    <Text fw={700} size="xl">
                        {value}
                    </Text>
                    {percent !== undefined && (
                        <Text size="xs" c="dimmed">
                            {percent}% of total
                        </Text>
                    )}
                </Box>
            </Group>
        </Paper>
    );
}