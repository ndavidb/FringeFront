    'use client';
    import React, { useState, useEffect } from 'react';
    import {
        Paper,
        Title,
        Grid,
        TextInput,
        NumberInput,
        Switch,
        Group,
        Button
    } from '@mantine/core';
    import { notifications } from '@mantine/notifications';
    import { createVenue, updateVenue, getVenues } from '@/services/locationservice';
    import { LocationDto } from '@/types/api/locationDto';
    import { CreateLocationDto } from '@/types/api/venue';

    interface LocationFormProps {
        location: LocationDto | null;
        onSubmit: (formData: LocationDto) => void;
        onCancel: () => void;
    }

    export function LocationForm({ location, onSubmit, onCancel }: LocationFormProps) {
        const [formData, setFormData] = useState<LocationDto>({
            id: "0",
            locationId: 0,
            locationName: "",
            name: '',
            address: '',
            suburb: '',
            postalCode: '',
            state: '',
            country: '',
            latitude: 0,
            longitude: 0,
            parkingAvailable: false,
            active: true,
        });

        useEffect(() => {
            if (location) {
                setFormData(location);
            }
        }, [location]);

        const handleTextChange = (field: keyof LocationDto) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value;

            if (['locationName', 'suburb', 'state', 'country'].includes(field) && /\d/.test(value)) {
                return;
            }

            if (field === 'postalCode' && /[^\d]/.test(value)) {
                return;
            }

            setFormData({
                ...formData,
                [field]: value,
            });
        };

        const handleNumberChange = (field: keyof LocationDto) => (value: number | string) => {
            setFormData({
                ...formData,
                [field]: typeof value === 'number' ? value : parseFloat(value) || 0,
            });
        };

        const handleSwitchChange = (field: keyof LocationDto) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [field]: event.currentTarget.checked,
            });
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                // Duplicate check only when creating
                if (!location) {
                    const allLocations = await getVenues();
                    const isDuplicate = allLocations.some(loc =>
                        loc.locationName.trim().toLowerCase() === formData.locationName.trim().toLowerCase()
                    );

                    if (isDuplicate) {
                        notifications.show({
                            title: 'Duplicate Location',
                            message: 'Duplicate Location',
                            color: 'red',
                        });
                        return;
                    }
                }

                const newLocation: CreateLocationDto = {
                    LocationId: formData.locationId,
                    LocationName: formData.locationName,
                    id: String(Number(formData.locationId) > 0 ? formData.locationId : formData.id),
                    Address: formData.address,
                    Suburb: formData.suburb,
                    PostalCode: formData.postalCode,
                    State: formData.state,
                    Country: formData.country,
                    Latitude: formData.latitude,
                    Longitude: formData.longitude,
                    ParkingAvailable: formData.parkingAvailable,
                    Active: formData.active
                };

                if (newLocation.id && Number(newLocation.id) > 0) {
                    await updateVenue(Number(newLocation.id), newLocation);
                    onSubmit(formData);            
                } else {
                    const data = await createVenue(newLocation);
                    const mappedData: LocationDto = {
                        locationId: data.locationId ?? 0,
                        locationName: data.locationName,
                        name: data.locationName,
                        id: String(data.locationId ?? 0),
                        address: data.address,
                        suburb: data.suburb,
                        state: data.state,
                        postalCode: data.postalCode,
                        country: data.country,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        parkingAvailable: data.parkingAvailable,
                        active: true,
                    };
                    onSubmit(mappedData);
                }
            } catch (error: any) {
                console.error('Error saving location:', error);
                notifications.show({
                    title: 'Error',
                    message: error.message || 'Something went wrong while saving the location.',
                    color: 'red',
                });
            }
        };

        return (
            <Paper withBorder p="md" mb="lg">
                <Title order={3} mb="md">{location ? 'Edit' : 'Add'} Location</Title>

                <form onSubmit={handleSubmit}>
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="Location Name"
                                value={formData.locationName}
                                onChange={handleTextChange('locationName')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="Address"
                                value={formData.address}
                                onChange={handleTextChange('address')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="Suburb"
                                value={formData.suburb}
                                onChange={handleTextChange('suburb')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="Postal Code"
                                value={formData.postalCode}
                                onChange={handleTextChange('postalCode')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="State"
                                value={formData.state}
                                onChange={handleTextChange('state')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="Country"
                                value={formData.country}
                                onChange={handleTextChange('country')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <NumberInput
                                label="Latitude"
                                value={formData.latitude}
                                onChange={handleNumberChange('latitude')}
                                required
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <NumberInput
                                label="Longitude"
                                value={formData.longitude}
                                onChange={handleNumberChange('longitude')}
                                required
                                mb="md"
                            />
                        </Grid.Col>
                    </Grid>

                    <Group mt="md">
                        <Switch
                            label="Parking Available"
                            checked={formData.parkingAvailable}
                            onChange={handleSwitchChange('parkingAvailable')}
                        />
                        <Switch
                            label="Active"
                            checked={formData.active}
                            onChange={handleSwitchChange('active')}
                        />
                    </Group>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </Group>
                </form>
            </Paper>
        );
    }
