'use client';

import { useQuery } from '@tanstack/react-query';
import { getShows } from "@/services/showsService";
import { getVenues } from "@/services/venueService";
import { getPerformances } from "@/services/performanceService";

import { StatsGroup } from './StatsGroup';
import { UpcomingPerformances } from './UpcomingPerformances';
import { Grid, GridCol, Stack, Loader, Center, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function DashboardClient() {
    const { data: shows = [], error: showsError } = useQuery({ queryKey: ['shows'], queryFn: getShows });
    const { data: venues = [], error: venuesError } = useQuery({ queryKey: ['venues'], queryFn: getVenues });
    const { data: performances = [], error: performancesError } = useQuery({ queryKey: ['performances'], queryFn: getPerformances });

    const isLoading = !shows || !venues || !performances;
    const error = showsError || venuesError || performancesError;

    if (isLoading) {
        return <Center h="50vh"><Loader /></Center>;
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red" variant="light">
                Failed to load dashboard data: {error.message}
            </Alert>
        );
    }

    // 2. Process operational data
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const performancesTodayCount = performances.filter(p => p.performanceDate.slice(0, 10) === todayStr).length;
    const activeVenues = venues.filter(v => v.active).length;
    const upcomingPerformances = performances
        .filter(p => new Date(p.performanceDate) >= now && p.active === true)
        .sort((a, b) => new Date(a.performanceDate).getTime() - new Date(b.performanceDate).getTime())
        .slice(0, 5);

    // --- UPDATED: Stats array now only contains operational metrics ---
    const stats = [
        { title: 'Performances Today', value: performancesTodayCount.toLocaleString('en-US'), description: `Total performances scheduled for ${now.toLocaleDateString('en-AU', { month: 'long', day: 'numeric' })}` },
        { title: 'Active Shows', value: shows.length.toLocaleString('en-US'), description: 'Total number of shows currently configured' },
        { title: 'Active Venues', value: activeVenues.toLocaleString('en-US'), description: 'Total number of venues ready for performances' },
    ];

    // 3. Render the simplified dashboard layout
    return (
        <Stack gap="lg">
            <StatsGroup stats={stats} />
            <Grid>
                {/* --- The Upcoming Performances component now takes the full width --- */}
                <GridCol span={12}>
                    <UpcomingPerformances performances={upcomingPerformances} />
                </GridCol>
            </Grid>
        </Stack>
    );
}