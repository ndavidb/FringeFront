// app/admin/portal/shows-management/page.tsx
'use client';

import { Title, Box, Group, Button, Text, Paper, SimpleGrid, RingProgress, Center, Skeleton } from "@mantine/core";
import ShowsTable from "@/app/admin/portal/shows-management/components/ShowsTable";
import {
    IconCalendarEvent,
    IconTicket,
    IconUser,
    IconRefresh,
    IconAlertCircle
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getShows } from '@/services/showsService';
import { getVenues } from '@/services/venueService';
import { Alert } from '@mantine/core';

export default function ShowsManagementPage() {
    const queryClient = useQueryClient();

    // Fetch shows data
    const { data: shows = [], isLoading: isLoadingShows, error: showsError } = useQuery({
        queryKey: ['shows'],
        queryFn: getShows
    });

    // Fetch venues data to calculate capacity stats
    const { data: venues = [], isLoading: isLoadingVenues } = useQuery({
        queryKey: ['venues'],
        queryFn: getVenues
    });

    // Calculate total shows
    const totalShows = shows.length;

    // Calculate active shows and percentage
    const activeShows = shows.filter(show => show.active).length;
    const activeShowsPercent = totalShows > 0 ? Math.round((activeShows / totalShows) * 100) : 0;

    // Calculate upcoming shows (shows that haven't started yet)
    const currentDate = new Date();
    const upcomingShows = shows.filter(show => new Date(show.startDate) > currentDate).length;

    // Calculate venue utilization
    // This is a placeholder calculation since we don't have actual attendance data
    // Instead, we'll calculate the percentage of venues that are currently hosting active shows
    const venuesWithActiveShows = new Set(
        shows
            .filter(show =>
                show.active &&
                new Date(show.startDate) <= currentDate &&
                new Date(show.endDate) >= currentDate
            )
            .map(show => show.venueId)
    ).size;

    const venueUtilization = venues.length > 0
        ? Math.round((venuesWithActiveShows / venues.length) * 100)
        : 0;

    // Handle refresh
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['shows'] });
        queryClient.invalidateQueries({ queryKey: ['venues'] });
    };

    // If there's an error fetching shows
    if (showsError) {
        return (
            <Box p="md">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error Loading Data"
                    color="red"
                >
                    {(showsError as Error).message || "Failed to load show data"}
                </Alert>
                <ShowsTable />
            </Box>
        );
    }

    return (
        <Box p="xs">
            <Paper p="md" mb="lg" withBorder radius="md">
                <Group justify="space-between" mb="md">
                    <Title order={2}>Shows Dashboard</Title>
                    <Button
                        leftSection={<IconRefresh size="1rem" />}
                        variant="subtle"
                        color="gray"
                        onClick={handleRefresh}
                        loading={isLoadingShows || isLoadingVenues}
                    >
                        Refresh Data
                    </Button>
                </Group>

                <Text size="sm" c="dimmed" mb="lg">
                    Manage your festivals shows, performances, and events from this central dashboard.
                </Text>

                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
                    {isLoadingShows ? (
                        <>
                            <Skeleton height={120} radius="md" />
                            <Skeleton height={120} radius="md" />
                            <Skeleton height={120} radius="md" />
                            <Skeleton height={120} radius="md" />
                        </>
                    ) : (
                        <>
                            <StatCard
                                title="Total Shows"
                                value={totalShows.toString()}
                                color="blue"
                                icon={<IconCalendarEvent size={30} />}
                            />
                            <StatCard
                                title="Active Shows"
                                value={activeShows.toString()}
                                color="green"
                                icon={<IconTicket size={30} />}
                                percent={activeShowsPercent}
                            />
                            <StatCard
                                title="Upcoming Shows"
                                value={upcomingShows.toString()}
                                color="grape"
                                icon={<IconCalendarEvent size={30} />}
                            />
                            <StatCard
                                title="Venue Utilization"
                                value={`${venueUtilization}%`}
                                color="orange"
                                icon={<IconUser size={30} />}
                            />
                        </>
                    )}
                </SimpleGrid>
            </Paper>

            <ShowsTable />
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