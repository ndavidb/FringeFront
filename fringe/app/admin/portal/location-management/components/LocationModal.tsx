'use client';

import React from 'react';
import {
    Modal,
    Text,
    Button,
    Group,
    Badge,
    Box,
    Title,
    Divider,
    Flex,
    Stack
} from '@mantine/core';
import {
    IconMapPin,
    IconHome,
    IconBuilding,
    IconGlobe,
    IconMap,
    IconGps,
    IconParking
} from '@tabler/icons-react';
import { deleteVenue } from '@/services/locationservice';
import { LocationDto } from '@/types/api/locationDto';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    locationId: number | null;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmationModal({
    isOpen,
    locationId,
    onClose,
    onConfirm
}: DeleteConfirmationModalProps) {
    const handleConfirm = async () => {
        if (locationId !== null) {
            try {
                const returnValue = await deleteVenue(locationId);
                if (returnValue != null) {
                    onConfirm();
                }
                onClose();
            } catch (error) {
                console.error("Failed to delete venue:", error);
                onClose();
            }
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Confirm Delete"
            centered
        >
            <Text mb="lg">Are you sure you want to delete this location?</Text>

            <Group justify="flex-end">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button color="red" onClick={handleConfirm}>Delete</Button>
            </Group>
        </Modal>
    );
}

interface ViewLocationModalProps {
    isOpen: boolean;
    location: LocationDto | null;
    onClose: () => void;
}

export function ViewLocationModal({
    isOpen,
    location,
    onClose
}: ViewLocationModalProps) {
    if (!location) return null;

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Location Details"
            size="lg"
            centered
            overlayProps={{ blur: 3 }}
        >
            <Box px="sm">
                <Group justify="space-between" align="center" mb="xs">
                    <Title order={3}>{location.locationName}</Title>
                    <Badge color={location.active ? 'green' : 'red'} size="lg" radius="xl">
                        {location.active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                </Group>

                <Divider my="sm" />

                <Stack gap="xs">
                    <Flex align="center" gap="xs">
                        <IconHome size={18} />
                        <Text size="sm"><strong>Address:</strong> {location.address}</Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        <IconBuilding size={18} />
                        <Text size="sm"><strong>Suburb:</strong> {location.suburb}</Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        <IconMap size={18} />
                        <Text size="sm"><strong>State:</strong> {location.state}</Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        <IconGlobe size={18} />
                        <Text size="sm"><strong>Country:</strong> {location.country}</Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        <IconMapPin size={18} />
                        <Text size="sm"><strong>Postal Code:</strong> {location.postalCode}</Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        <IconGps size={18} />
                        <Text size="sm"><strong>Coordinates:</strong> {location.latitude}, {location.longitude}</Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        <IconParking size={18} />
                        <Text size="sm"><strong>Parking:</strong> {location.parkingAvailable ? 'Yes' : 'No'}</Text>
                    </Flex>
                </Stack>
            </Box>
        </Modal>
    );
}
