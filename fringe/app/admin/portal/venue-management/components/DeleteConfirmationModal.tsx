'use client';

import React from 'react';
import { Modal, Text, Button, Group, Stack } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVenue } from '@/services/venueService';
import { notifications } from '@mantine/notifications';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    venueId: number | null;
    venueName?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({
                                                    isOpen,
                                                    venueId,
                                                    venueName,
                                                    onClose,
                                                    onConfirm
                                                }: DeleteConfirmationModalProps) {
    const queryClient = useQueryClient();

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteVenue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['venues'] });
            notifications.show({
                title: 'Deleted',
                message: 'Venue deleted successfully!',
                color: 'green',
            });
            onConfirm();
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete venue.',
                color: 'red',
            });
            onClose();
        }
    });

    const handleConfirm = () => {
        if (venueId) {
            deleteMutation.mutate(venueId);
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Confirm Delete"
            centered
        >
            <Stack>
                <Text>
                    Are you sure you want to delete the venue <strong>{venueName}</strong>? This action cannot be undone.
                </Text>

                <Group justify="flex-end">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        color="red"
                        onClick={handleConfirm}
                        loading={deleteMutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}