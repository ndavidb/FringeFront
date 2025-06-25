'use client';

import { notifications } from '@mantine/notifications';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Group,
    Title,
    Paper,
    Text,
    Center,
    SimpleGrid,
    Skeleton,
    RingProgress,
    Modal
} from '@mantine/core';
import { IconMapPin, IconBuildingSkyscraper } from '@tabler/icons-react';
import { getVenues } from '@/services/locationservice';
import { LocationsTable } from '@/app/admin/portal/location-management/components/LocationTable';
import { LocationForm } from '@/app/admin/portal/location-management/components/LocationForm';
import {
    DeleteConfirmationModal,
    ViewLocationModal
} from '@/app/admin/portal/location-management/components/LocationModal';
import { LocationDto } from '@/types/api/locationDto';

export default function LocationManagementPage() {
    const [locations, setLocations] = useState<LocationDto[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<LocationDto | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationDto | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                const data = await getVenues();
                const mapped = data.map((loc: LocationDto) => ({
                    ...loc,
                    id: String(loc.locationId)
                }));
                setLocations(mapped);
            } catch (error) {
                console.error('Failed to fetch locations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const activeLocations = locations.filter(l => l.active).length;
    const inactiveLocations = locations.filter(l => !l.active).length;
    const activePercent = locations.length ? Math.round((activeLocations / locations.length) * 100) : 0;
    const inactivePercent = locations.length ? Math.round((inactiveLocations / locations.length) * 100) : 0;

    const handleEdit = (loc: LocationDto) => {
        setCurrentLocation(loc);
        setShowFormModal(true);
    };

    const handleView = (loc: LocationDto) => {
        setSelectedLocation(loc);
        setViewModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setLocationToDelete(id);
        setShowDeleteModal(true);
    };

    const handleFormSubmit = (data: LocationDto) => {
        if (currentLocation) {
            setLocations(locations.map(l => (l.id === currentLocation.id ? data : l)));
            notifications.show({
                title: 'Success',
                message: 'Location updated successfully!',
                color: 'green',
            });
        } else {
            setLocations([...locations, { ...data, id: String(data.locationId) }]);
            notifications.show({
                title: 'Success',
                message: 'Location added successfully!',
                color: 'green',
            });
        }
        setShowFormModal(false);
        setCurrentLocation(null);
    };

    return (
        <Box p="md">
            <Paper p="md" mb="lg" withBorder radius="md">
                <Group justify="space-between" mb="md">
                    <Title order={2}>Location Dashboard</Title>
                </Group>
                <Text size="sm" c="dimmed" mb="lg">
                    Manage your location records and associated details from here.
                </Text>

                {isLoading ? (
                    <SimpleGrid cols={4} spacing="lg">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} height={120} radius="md" />
                        ))}
                    </SimpleGrid>
                ) : (
                    <SimpleGrid cols={4} spacing="lg">
                        <StatCard
                            title="Total Locations"
                            value={locations.length.toString()}
                            color="blue"
                            icon={<IconBuildingSkyscraper size={30} />}
                        />
                        <StatCard
                            title="Active Locations"
                            value={activeLocations.toString()}
                            color="green"
                            icon={<IconMapPin size={30} />}
                            percent={activePercent}
                        />
                        <StatCard
                            title="Inactive Locations"
                            value={inactiveLocations.toString()}
                            color="red"
                            icon={<IconMapPin size={30} />}
                            percent={inactivePercent}
                        />
                    </SimpleGrid>
                )}
            </Paper>

            <Box mt="md">
                <LocationsTable
                    locations={locations}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDeleteClick}
                    onAddLocationClick={() => {
                        setCurrentLocation(null);
                        setShowFormModal(true);
                    }}
                    showTabs
                    enableSorting
                    paginate
                />
                <Text c="dimmed" size="sm" mt="sm">
                    Showing all {locations.length} locations
                </Text>
            </Box>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                locationId={locationToDelete}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    setShowDeleteModal(false);
                    setLocationToDelete(null);
                    try {
                        const refreshed = await getVenues();
                        setLocations(refreshed.map((loc: LocationDto) => ({ ...loc, id: String(loc.locationId) })));
                        notifications.show({
                            title: 'Deleted',
                            message: 'Location deleted successfully!',
                            color: 'red',
                        });
                    } catch {
                        notifications.show({
                            title: 'Error',
                            message: 'Failed to delete location.',
                            color: 'red',
                        });
                    }
                }}
            />

            <Modal
                opened={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={currentLocation ? 'Edit Location' : 'Add New Location'}
                size="lg"
                centered
                overlayProps={{ blur: 3 }}
            >
                <LocationForm
                    location={currentLocation}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowFormModal(false)}
                />
            </Modal>

            <ViewLocationModal
                isOpen={viewModalOpen}
                location={selectedLocation}
                onClose={() => setViewModalOpen(false)}
            />
        </Box>
    );
}

function StatCard({
    title,
    value,
    color,
    icon,
    percent
}: {
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
                            sections={[{ value: percent, color }]}
                            label={<Center>{icon}</Center>}
                        />
                    ) : (
                        <Box style={{ color }} p="md">
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
