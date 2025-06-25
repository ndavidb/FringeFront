// app/admin/portal/shows-management/components/ShowForm.tsx
'use client';

import React from 'react';
import {
    TextInput,
    Textarea,
    Button,
    Group,
    Select,
    Switch,
    Stack,
    Box,
    Paper,
    SimpleGrid,
    Title,
    Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {DatePickerInput} from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    IconCalendar,
    IconBuilding,
    IconUser,
    IconTicket,
    IconPhoto,
    IconVideo,
    IconAlertTriangle,
    IconInfoCircle
} from '@tabler/icons-react';
import { Show } from '@/types/api/show';
import {CreateShowDto} from "@/types/api/createShowDto";
import {UpdateShowDto} from "@/types/api/updateShowDto";
import {
    createShow,
    updateShow,
    getAgeRestrictions,
    getShowTypes
} from '@/services/showsService';
import { getVenues } from '@/services/venueService';
// import { useAuth } from '@/contexts/auth-context';

interface ShowFormProps {
    show?: Show | null;
    onClose: () => void;
    isCreate: boolean;
}

export default function ShowForm({ show, onClose, isCreate }: ShowFormProps) {
    // const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch form dependencies with loading states
    const { data: ageRestrictions = [], isLoading: isLoadingAgeRestrictions } = useQuery({
        queryKey: ['ageRestrictions'],
        queryFn: getAgeRestrictions,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const { data: showTypes = [], isLoading: isLoadingShowTypes } = useQuery({
        queryKey: ['showTypes'],
        queryFn: getShowTypes,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Fetch venues using our venueService
    const { data: venues = [], isLoading: isLoadingVenues } = useQuery({
        queryKey: ['venues'],
        queryFn: getVenues,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Create mutation with error handling
    const createMutation = useMutation(
        {
        mutationFn: (data: CreateShowDto) => createShow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
            notifications.show({
                title: 'Success',
                message: 'Show created successfully',
                color: 'green'
            });
            onClose();
        },

        onError: (error: Error) => {
            console.error('Create show error:', error);

            // Check if it's a name duplication error using a more specific pattern
            if (error.message && error.message.toLowerCase().includes('show with name') &&
                error.message.toLowerCase().includes('already exists')) {
                // Set an error directly on the showName field
                form.setFieldError('showName', 'A show with this name already exists');
            }

            notifications.show({
                title: 'Show Creation Failed',
                message: error.message || 'Failed to create show',
                color: 'red'
            });
        }
    });

    // Update mutation with error handling
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateShowDto }) =>
            updateShow(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
            notifications.show({
                title: 'Success',
                message: 'Show updated successfully',
                color: 'green'
            });
            onClose();
        },
        onError: (error: Error) => {
            console.error('Create show error:', error);

            // Check if it's a name duplication error using a more specific pattern
            if (error.message && error.message.toLowerCase().includes('show with name') &&
                error.message.toLowerCase().includes('already exists')) {
                // Set an error directly on the showName field
                form.setFieldError('showName', 'A show with this name already exists');
            }

            notifications.show({
                title: 'Show Creation Failed',
                message: error.message || 'Failed to create show',
                color: 'red'
            });
        }
    });

    // Initialize form with default values or existing show values
    const form = useForm({
        initialValues: {
            showName: show?.showName || '',
            venueId: show?.venueId ? show.venueId.toString() : '',
            showTypeId: show?.showTypeId ? show.showTypeId.toString() : '',
            description: show?.description || '',
            ageRestrictionId: show?.ageRestrictionId ? show.ageRestrictionId.toString() : '',
            warningDescription: show?.warningDescription || '',
            startDate: show?.startDate ? new Date(show.startDate) : null,
            endDate: show?.endDate ? new Date(show.endDate) : null,
            ticketTypeId: show?.ticketTypeId ? show.ticketTypeId.toString() : '',
            imagesUrl: show?.imagesUrl || '',
            videosUrl: show?.videosUrl || '',
            active: show?.active ?? true,
        },
        validate: {
            showName: (value) => (!value ? 'Show name is required' : null),
            venueId: (value) => (!value ? 'Venue is required' : null),
            showTypeId: (value) => (!value ? 'Show type is required' : null),
            ageRestrictionId: (value) => (!value ? 'Age restriction is required' : null),
            startDate: (value) => (!value ? 'Start date is required' : null),
            endDate: (value, values) => {
                if (!value) return 'End date is required';
                if (values.startDate && new Date(value) < new Date(values.startDate)) {
                    return 'End date must be after start date';
                }
                return null;
            },
        },
    });

    // Format age restrictions for select
    const ageRestrictionOptions = ageRestrictions.map((ar) => ({
        value: ar.ageRestrictionId.toString(),
        label: `${ar.code} - ${ar.description}`,
    }));

    // Format show types for select
    const showTypeOptions = showTypes.map((st) => ({
        value: st.typeId.toString(),
        label: st.showType,
    }));

    // Format venues for select using our actual venue data
    const venueOptions = venues.map((venue) => ({
        value: venue.venueId.toString(),
        label: venue.venueName,
    }));

    // Format ticket types for select using actual ticket type data
    // If the endpoint is not available, we'll use a fallback

    const handleSubmit = (values: typeof form.values) => {
        // Create date helper that preserves the selected date regardless of timezone
        const formatDateToNoonISO = (date: Date | null) => {
            if (!date) return '';
            const dateWithNoon = new Date(date);
            // Set time to noon in local timezone to prevent date shifting
            dateWithNoon.setHours(12, 0, 0, 0);
            return dateWithNoon.toISOString();
        };

        const formattedValues = {
            ...values,
            venueId: Number(values.venueId),
            showTypeId: Number(values.showTypeId),
            ageRestrictionId: Number(values.ageRestrictionId),
            ticketTypeId: values.ticketTypeId ? Number(values.ticketTypeId) : null,
            startDate: formatDateToNoonISO(values.startDate),
            endDate: formatDateToNoonISO(values.endDate),
        };

        if (isCreate) {
            createMutation.mutate(formattedValues as CreateShowDto);
        } else if (show) {
            updateMutation.mutate({
                id: show.showId,
                data: formattedValues as UpdateShowDto,
            });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;
    const isLoading = isLoadingAgeRestrictions || isLoadingShowTypes || isLoadingVenues;

    // Display loading state
    if (isLoading) {
        return (
            <Alert color="blue" title="Loading form data">
                Please wait while we fetch the necessary data...
            </Alert>
        );
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    {/* Basic Info Section */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Basic Information</Title>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput
                                label="Show Name"
                                placeholder="Enter show name"
                                required
                                {...form.getInputProps('showName')}
                                leftSection={<IconInfoCircle size="1rem" />}
                            />

                            <Select
                                label="Show Type"
                                placeholder="Select show type"
                                data={showTypeOptions}
                                required
                                searchable
                                leftSection={<IconTicket size="1rem" />}
                                {...form.getInputProps('showTypeId')}
                            />
                        </SimpleGrid>

                        <Textarea
                            label="Description"
                            placeholder="Enter show description"
                            minRows={3}
                            mt="md"
                            {...form.getInputProps('description')}
                        />
                    </Paper>

                    {/* Venue & Timing Section */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Venue & Show Dates</Title>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <Select
                                label="Venue"
                                placeholder={isLoadingVenues ? "Loading venues..." : "Select venue"}
                                data={venueOptions}
                                required
                                searchable
                                leftSection={<IconBuilding size="1rem" />}
                                disabled={isLoadingVenues}
                                {...form.getInputProps('venueId')}
                            />

                            <Select
                                label="Age Restriction"
                                placeholder="Select age restriction"
                                data={ageRestrictionOptions}
                                required
                                searchable
                                leftSection={<IconUser size="1rem" />}
                                {...form.getInputProps('ageRestrictionId')}
                            />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                            <DatePickerInput
                                label="Start Date"
                                placeholder="Select start date"
                                leftSection={<IconCalendar size="1rem" />}
                                required
                                minDate={new Date()}

                                clearable={false}
                                {...form.getInputProps('startDate')}
                            />

                            <DatePickerInput
                                label="End Date"
                                placeholder="Select end date"
                                leftSection={<IconCalendar size="1rem" />}
                                required
                                minDate={form.values.startDate || undefined}

                                clearable={false}
                                {...form.getInputProps('endDate')}
                            />
                        </SimpleGrid>
                    </Paper>

                    {/* Additional Info Section */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Additional Information</Title>

                        {/*<Select*/}
                        {/*    label="Ticket Type (Optional)"*/}
                        {/*    placeholder="Select ticket type"*/}
                        {/*    data={ticketTypeOptions}*/}
                        {/*    clearable*/}
                        {/*    leftSection={<IconTicket size="1rem" />}*/}
                        {/*    {...form.getInputProps('ticketTypeId')}*/}
                        {/*    mb="md"*/}
                        {/*/>*/}

                        <Textarea
                            label="Content Warning"
                            placeholder="Enter any content warnings or advisories"
                            minRows={2}
                            leftSection={<IconAlertTriangle size="1rem" />}
                            {...form.getInputProps('warningDescription')}
                            mb="md"
                        />

                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput
                                label="Images URL"
                                placeholder="Enter URL for show images"
                                leftSection={<IconPhoto size="1rem" />}
                                {...form.getInputProps('imagesUrl')}
                            />

                            <TextInput
                                label="Videos URL"
                                placeholder="Enter URL for show videos"
                                leftSection={<IconVideo size="1rem" />}
                                {...form.getInputProps('videosUrl')}
                            />
                        </SimpleGrid>

                        {!isCreate && (
                            <Switch
                                label="Active"
                                {...form.getInputProps('active', { type: 'checkbox' })}
                                mt="md"
                                size="md"
                                color="green"
                            />
                        )}
                    </Paper>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="default" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={isPending}
                            color="pink.8"
                        >
                            {isCreate ? 'Create Show' : 'Update Show'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}