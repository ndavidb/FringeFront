'use client';

import React, {useState} from 'react';
import {
    Box,
    Button,
    Group,
    Title,
    Paper,
    Text,
    Center,
    SimpleGrid,
    Skeleton,
    RingProgress,
    Alert,
    Modal
} from '@mantine/core';
import {IconBuilding, IconMapPin, IconAlertCircle, IconRefresh} from '@tabler/icons-react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getVenues} from '@/services/venueService';
import {useDisclosure} from '@mantine/hooks';
import VenueTable from './components/VenueTable';
import VenueForm from './components/VenueForm';
import VenueDetails from './components/VenueDetails';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import {Venue} from '@/types/api/venue';

export default function VenueManagementPage() {
    const queryClient = useQueryClient();

    // State for selected venue and modals
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [createModalOpened, {open: openCreateModal, close: closeCreateModal}] = useDisclosure(false);
    const [editModalOpened, {open: openEditModal, close: closeEditModal}] = useDisclosure(false);
    const [detailsModalOpened, {open: openDetailsModal, close: closeDetailsModal}] = useDisclosure(false);
    const [deleteModalOpened, {open: openDeleteModal, close: closeDeleteModal}] = useDisclosure(false);

    // Fetch venues data
    const {
        data: venues = [],
        isLoading,
        error,
        isError
    } = useQuery({
        queryKey: ['venues'],
        queryFn: getVenues,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Calculate statistics for the dashboard
    const activeVenues = venues.filter(v => v.active).length;
    const inactiveVenues = venues.filter(v => !v.active).length;
    const activePercent = venues.length > 0 ? Math.round((activeVenues / venues.length) * 100) : 0;
    const inactivePercent = venues.length > 0 ? Math.round((inactiveVenues / venues.length) * 100) : 0;

    // Handlers for venue actions
    const handleEdit = (venue: Venue) => {
        setSelectedVenue(venue);
        openEditModal();
    };

    const handleViewDetails = (venue: Venue) => {
        setSelectedVenue(venue);
        openDetailsModal();
    };

    const handleDelete = (venue: Venue) => {
        setSelectedVenue(venue);
        openDeleteModal();
    };

    // Handle refresh
    const handleRefresh = () => {
        queryClient.invalidateQueries({queryKey: ['venues']});
    };

    // Error state
    if (isError) {
        return (
            <Box p="md">
                <Alert
                    icon={<IconAlertCircle size={16}/>}
                    title="Error Loading Data"
                    color="red"
                >
                    {(error as Error).message || "Failed to load venue data"}
                </Alert>
                <VenueTable/>
            </Box>
        );
    }

    return (
        <Box p="xs">
            <Paper p="md" mb="lg" withBorder radius="md">
                <Group justify="space-between" mb="md">
                    <Title order={2}>Venues Dashboard</Title>
                    <Button
                        leftSection={<IconRefresh size="1rem"/>}
                        variant="subtle"
                        color="gray"
                        onClick={handleRefresh}
                        loading={isLoading}
                    >
                        Refresh Data
                    </Button>
                </Group>

                <Text size="sm" c="dimmed" mb="lg">
                    Manage your venues, their capacities, and details from this central dashboard.
                </Text>

                <SimpleGrid cols={{base: 1, xs: 2, md: 4}} spacing="lg">
                    {isLoading ? (
                        <>
                            <Skeleton height={120} radius="md"/>
                            <Skeleton height={120} radius="md"/>
                            <Skeleton height={120} radius="md"/>
                            <Skeleton height={120} radius="md"/>
                        </>
                    ) : (
                        <>
                            <StatCard
                                title="Total Venues"
                                value={venues.length.toString()}
                                color="blue"
                                icon={<IconBuilding size={30}/>}
                            />
                            <StatCard
                                title="Active Venues"
                                value={activeVenues.toString()}
                                color="green"
                                icon={<IconMapPin size={30}/>}
                                percent={activePercent}
                            />
                            <StatCard
                                title="Inactive Venues"
                                value={inactiveVenues.toString()}
                                color="red"
                                icon={<IconMapPin size={30}/>}
                                percent={inactivePercent}
                            />
                        </>
                    )}
                </SimpleGrid>
            </Paper>

            <VenueTable
                venues={venues}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onAddVenueClick={openCreateModal}
                showTabs={true}
                enableSorting={true}
                paginate={true}
            />

            {/* Create Venue Modal */}
            <Modal
                opened={createModalOpened}
                onClose={closeCreateModal}
                title="Add New Venue"
                size="xl"
                centered
                overlayProps={{
                    blur: 3
                }}
            >
                <VenueForm
                    venue={null}
                    onClose={closeCreateModal}
                    isCreate={true}
                />
            </Modal>

            {/* Edit Venue Modal */}
            <Modal
                opened={editModalOpened}
                onClose={closeEditModal}
                title="Edit Venue"
                size="xl"
                centered
                overlayProps={{
                    blur: 3
                }}
            >
                <VenueForm
                    venue={selectedVenue}
                    onClose={closeEditModal}
                    isCreate={false}
                />
            </Modal>

            {/* View Venue Details Modal */}
            <Modal
                opened={detailsModalOpened}
                onClose={closeDetailsModal}
                title="Venue Details"
                size="xl"
                centered
                overlayProps={{
                    blur: 3
                }}
            >
                <VenueDetails venue={selectedVenue}/>
            </Modal>

            {/* Delete Confirmation Modal using the separate component */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpened}
                venueId={selectedVenue?.venueId || null}
                venueName={selectedVenue?.venueName}
                onClose={closeDeleteModal}
                onConfirm={() => {
                    closeDeleteModal();
                    queryClient.invalidateQueries({queryKey: ['venues']});
                }}
            />
        </Box>
    );
}

function StatCard({title, value, color, icon, percent}: {
    title: string;
    value: string;
    color: string;
    icon: React.ReactNode;
    percent?: number;
}) {
    return (
        <Paper withBorder p="md" radius="md">
            <Group>
                <Center>
                    {percent !== undefined ? (
                        <RingProgress
                            size={80}
                            roundCaps
                            thickness={8}
                            sections={[{value: percent, color}]}
                            label={<Center>{icon}</Center>}
                        />
                    ) : (
                        <Box style={{color}} p="md">
                            {icon}
                        </Box>
                    )}
                </Center>
                <Box>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{title}</Text>
                    <Text fw={700} size="xl">{value}</Text>
                    {percent !== undefined && (
                        <Text size="xs" c="dimmed">{percent}% of total</Text>
                    )}
                </Box>
            </Group>
        </Paper>
    );
}
