'use client';

import React, {useEffect, useState} from 'react';
import {
    Accordion,
    Alert,
    Box,
    Button, Divider,
    Group,
    NumberInput,
    Paper,
    Select,
    SimpleGrid,
    Space,
    Stack,
    Text,
    Switch,
    Textarea,
    TextInput,
    Title
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {notifications} from '@mantine/notifications';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {IconArmchair, IconBuilding, IconCategory, IconLink, IconMail, IconPhone, IconUsers} from '@tabler/icons-react';
import {createVenue, getVenueTypes, updateVenue} from '@/services/venueService';
import {getVenues as getLocations} from '@/services/locationservice';
import {CreateVenueDto, Venue} from '@/types/api/venue';
// Import our improved ImageUploader
// import {ImageUploader} from "@/components/ImageUploader/ImageUploader";
// import {uploadFile} from "@/services/fileUploadService";
import {SeatingVisualizer} from "./VenueSeatingPlan"

interface VenueFormProps {
    venue?: Venue | null;
    onClose: () => void;
    isCreate: boolean;
}

export default function VenueForm({venue, onClose, isCreate}: VenueFormProps) {
    const queryClient = useQueryClient();
    // Store the selected image file

    const [isInitialLoad, setIsInitialLoad] = useState(true);


    // Fetch form dependencies with loading states
    const {data: venueTypes = [], isLoading: isLoadingVenueTypes} = useQuery({
        queryKey: ['venueTypes'],
        queryFn: getVenueTypes,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Fetch locations/venues using the location service
    const {data: locations = [], isLoading: isLoadingLocations} = useQuery({
        queryKey: ['locations'],
        queryFn: getLocations,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Create mutation with error handling
    const createMutation = useMutation({
        mutationFn: async (data: CreateVenueDto) => {
            return createVenue(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['venues']});
            notifications.show({
                title: 'Success',
                message: 'Venue created successfully',
                color: 'green'
            });
            onClose();
        },
        onError: (error: Error) => {
            console.error('Create venue error:', error);

            notifications.show({
                title: 'Venue Creation Failed',
                message: error.message || 'Failed to create venue',
                color: 'red'
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({id, data}: { id: number, data: CreateVenueDto }) => {
            return updateVenue(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['venues']});
            notifications.show({
                title: 'Success',
                message: 'Venue updated successfully',
                color: 'green'
            });
            onClose();
        },
        onError: (error: Error) => {
            console.error('Update venue error:', error);

            notifications.show({
                title: 'Venue Update Failed',
                message: error.message || 'Failed to update venue',
                color: 'red'
            });
        }
    });

    // Initialize form with default values or existing venue values
    const form = useForm({
        initialValues: {
            venueName: venue?.venueName || '',
            typeId: venue?.typeId ? venue.typeId.toString() : '',
            maxCapacity: venue?.maxCapacity || 10,
            description: venue?.description || '',
            contactEmail: venue?.contactEmail || '',
            contactPhone: venue?.contactPhone || '',
            active: venue?.active ?? true,
            venueUrl: venue?.venueUrl || '',
            locationId: venue?.locationId ? venue.locationId.toString() : '',
            imagesUrl: venue?.imagesUrl || '',
            rows: venue?.rows || 2,
            seatsPerRow: venue?.seatsPerRow || 5,
        },
        validate: {
            venueName: (value) => (!value ? 'Venue name is required' : null),
            typeId: (value) => (!value ? 'Venue type is required' : null),
            maxCapacity: (value) => (value <= 0 ? 'Capacity must be greater than 0' : null),
            locationId: (value) => (!value ? 'Location is required' : null),
            contactEmail: (value) => {
                if (!value) return 'Email is required';
                return /^\S+@\S+$/.test(value) ? null : 'Invalid email address';
            },
            rows: (value) => (value <= 0 ? 'Rows must be greater than 0' : null),
            seatsPerRow: (value) => (value <= 0 ? 'Seats per row must be greater than 0' : null),
        },
    });

    // Only set default capacity on initial form setup for new venues
    useEffect(() => {
        if (isInitialLoad && isCreate) {
            // Only update maxCapacity for new venues on initial load
            const totalSeats = form.values.rows * form.values.seatsPerRow;
            form.setFieldValue('maxCapacity', totalSeats);
            setIsInitialLoad(false);
        } else {
            setIsInitialLoad(false);
        }
    }, [form, isCreate, isInitialLoad]);

    // Format venue types for select
    const venueTypeOptions = venueTypes.map((type) => ({
        value: type.typeId.toString(),
        label: type.venueType,
    }));

    // Format locations for select
    const locationOptions = locations.map((location) => ({
        value: location.locationId.toString(),
        label: location.locationName,
    }));

    const totalSeats = form.values.rows * form.values.seatsPerRow;


    const handleSubmit = (values: typeof form.values) => {
        const formattedValues: CreateVenueDto = {
            venueName: values.venueName,
            typeId: Number(values.typeId),
            maxCapacity: Number(values.maxCapacity),
            description: values.description,
            contactEmail: values.contactEmail,
            contactPhone: values.contactPhone,
            active: values.active,
            venueUrl: values.venueUrl,
            locationId: Number(values.locationId),
            imagesUrl: values.imagesUrl,
            rows: Number(values.rows),
            seatsPerRow: Number(values.seatsPerRow),
        };

        if (isCreate) {
            createMutation.mutate(formattedValues);
        } else if (venue) {
            updateMutation.mutate({
                id: venue.venueId,
                data: formattedValues,
            });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;
    const isLoading = isLoadingVenueTypes || isLoadingLocations;

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
                        <SimpleGrid cols={{base: 1, sm: 2}} spacing="md">
                            <TextInput
                                label="Venue Name"
                                placeholder="Enter venue name"
                                required
                                {...form.getInputProps('venueName')}
                                leftSection={<IconBuilding size="1rem"/>}
                            />

                            <Select
                                label="Venue Type"
                                placeholder="Select venue type"
                                data={venueTypeOptions}
                                required
                                searchable
                                leftSection={<IconCategory size="1rem"/>}
                                {...form.getInputProps('typeId')}
                            />
                        </SimpleGrid>

                        <Textarea
                            label="Description"
                            placeholder="Enter venue description"
                            minRows={3}
                            mt="md"
                            {...form.getInputProps('description')}
                        />
                    </Paper>

                    {/* Capacity & Location Section */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Capacity & Location</Title>
                        <SimpleGrid cols={{base: 1, sm: 2}} spacing="md">
                            <NumberInput
                                label="Max Capacity"
                                placeholder="Enter maximum capacity"
                                min={1}
                                required
                                {...form.getInputProps('maxCapacity')}
                                leftSection={<IconUsers size="1rem"/>}
                                description="Total capacity of the venue (can differ from layout)"
                            />

                            <Select
                                label="Location"
                                placeholder={isLoadingLocations ? "Loading locations..." : "Select location"}
                                data={locationOptions}
                                required
                                searchable
                                disabled={isLoadingLocations}
                                {...form.getInputProps('locationId')}
                                description="&zwnj;"
                            />
                        </SimpleGrid>
                    </Paper>


                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Seating Configuration</Title>
                        <SimpleGrid cols={{base: 1, sm: 2}} spacing="md">
                            <NumberInput
                                label="Rows"
                                placeholder="Number of rows"
                                min={1}
                                max={30}
                                required
                                {...form.getInputProps('rows')}
                                leftSection={<IconArmchair size="1rem"/>}

                            />

                            <NumberInput
                                label="Seats Per Row"
                                placeholder="Seats in each row"
                                min={1}
                                max={50}
                                required
                                {...form.getInputProps('seatsPerRow')}
                                leftSection={<IconArmchair size="1rem"/>}

                            />
                        </SimpleGrid>

                        <Box my="md">
                            <Text size="sm" c="dimmed">
                                Total seats in layout: {totalSeats}
                                {totalSeats !== form.values.maxCapacity && (
                                    <Text component="span" ml={5} fs="italic">
                                        (differs from max capacity: {form.values.maxCapacity})
                                    </Text>
                                )}
                            </Text>
                        </Box>

                        <Divider my="md"/>

                        <Accordion>
                            <Accordion.Item value="seating-layout">
                                <Accordion.Control>
                                    <Group>
                                        <IconArmchair size="1rem"/>
                                        <span>View Seating Layout</span>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <SeatingVisualizer
                                        rows={form.values.rows}
                                        seatsPerRow={form.values.seatsPerRow}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Paper>

                    {/* Contact & Additional Info Section */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Contact & Additional Information</Title>
                        <SimpleGrid cols={{base: 1, sm: 2}} spacing="md">
                            <TextInput
                                label="Contact Email"
                                placeholder="Enter contact email"
                                required
                                {...form.getInputProps('contactEmail')}
                                leftSection={<IconMail size="1rem"/>}
                            />

                            <TextInput
                                label="Contact Phone"
                                placeholder="Enter contact phone"
                                {...form.getInputProps('contactPhone')}
                                leftSection={<IconPhone size="1rem"/>}
                            />
                            <TextInput
                                label="Venue URL"
                                placeholder="Enter venue website URL"
                                {...form.getInputProps('venueUrl')}
                                leftSection={<IconLink size="1rem"/>}
                            />
                        </SimpleGrid>

                        <Space h="md"/>

                        {/*<ImageUploader*/}
                        {/*    label="Venue Images"*/}
                        {/*    currentImageUrl={venue?.imagesUrl ? getFileUrl(venue.imagesUrl) : ''}*/}
                        {/*    onImageSelected={setSelectedImageFile}*/}
                        {/*    showUploadButton={false} // We'll handle the upload when the form is submitted*/}
                        {/*/>*/}

                        {!isCreate && (
                            <Switch
                                label="Active"
                                {...form.getInputProps('active', {type: 'checkbox'})}
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
                            {isCreate ? 'Create Venue' : 'Update Venue'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}