'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {
    Button,
    Group,
    Select,
    Switch,
    Stack,
    Box,
    Paper,
    SimpleGrid,
    Title,
    Alert,
    NumberInput,
    Table,
    Text,
    Loader
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    IconCalendar,
    IconClock,
    IconTicket,
    IconCurrencyDollar,
    IconAlertCircle
} from '@tabler/icons-react';
import { Performance } from '@/types/api/performance'; // Base type for list display
import { CreatePerformanceDto } from '@/types/api/createPerformanceDto';
import { UpdatePerformanceDto } from '@/types/api/updatePerformanceDto';
import {
    createPerformance,
    updatePerformance,
    getPerformanceById
} from '@/services/performanceService';
import { getShows } from '@/services/showsService'; // Assuming Show type from service
import { fetchTicketTypes} from '@/services/ticketTypeService'; // Assuming TicketType from service
import {SeatingType, Show, TicketType} from '@/types/api'
import dayjs from "dayjs";

interface FormTicketPrice {
    ticketTypeId: number;
    ticketPriceId?: number; // Add this for edit mode
    price: number;
    ticketTypeName?: string; // Add this for referencing the name in edit mode
}

// For ticket prices as returned by getPerformanceById API
interface ApiPerformanceTicketPrice {
    ticketPriceId: number;
    ticketTypeName: string;
    price: number;
}
interface ApiDetailedPerformance extends Omit<Performance, 'ticketPrices' | 'startTime' | 'endTime'> {
    ticketPrices?: ApiPerformanceTicketPrice[];
    startTime: string;
    endTime: string;
}

interface PerformanceFormProps {
    performance?: Performance | null;
    onClose: () => void;
    isCreate: boolean;
    showId?: number;
}

export default function PerformanceForm({ performance, onClose, isCreate, showId: propShowId }: PerformanceFormProps) {
    const queryClient = useQueryClient();
    const [ticketPrices, setTicketPrices] = useState<FormTicketPrice[]>([]);

    const { data: shows = [], isLoading: isLoadingShows } = useQuery<Show[], Error>({
        queryKey: ['shows'],
        queryFn: getShows,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: ticketTypes = [], isLoading: isLoadingTicketTypes } = useQuery<TicketType[], Error>({
        queryKey: ['ticketTypes'],
        queryFn: fetchTicketTypes,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const { data: performanceDetails, isLoading: isLoadingDetails, isError: isErrorDetails, error: detailsError } = useQuery<ApiDetailedPerformance | null, Error>({
        queryKey: ['performance', performance?.performanceId],
        queryFn: async () => {
            if (!performance || !performance.performanceId) return null;
            return getPerformanceById(performance.performanceId) as unknown as ApiDetailedPerformance;
        },
        enabled: !isCreate && !!performance?.performanceId,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation<Performance, Error, CreatePerformanceDto>({
        mutationFn: (data) => createPerformance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['performances'] });
            if (propShowId || performance?.showId) {
                queryClient.invalidateQueries({ queryKey: ['performances', 'show', propShowId || performance?.showId] });
            }
            notifications.show({
                title: 'Success',
                message: 'Performance created successfully',
                color: 'green'
            });
            onClose();
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Performance Creation Failed',
                message: error.message || 'An unexpected error occurred.',
                color: 'red'
            });
        }
    });

    const updateMutation = useMutation<Performance, Error, { id: number; data: UpdatePerformanceDto }>({
        mutationFn: ({ id, data }) => updatePerformance(id, data),
        onSuccess: (updatedData) => {
            queryClient.invalidateQueries({ queryKey: ['performances'] });
            if (propShowId || updatedData?.showId) {
                queryClient.invalidateQueries({ queryKey: ['performances', 'show', propShowId || updatedData?.showId] });
            }
            if (updatedData?.performanceId) {
                queryClient.invalidateQueries({ queryKey: ['performance', updatedData.performanceId] });
            }
            notifications.show({
                title: 'Success',
                message: 'Performance updated successfully',
                color: 'green'
            });
            onClose();
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Performance Update Failed',
                message: error.message || 'An unexpected error occurred.',
                color: 'red'
            });
        }
    });

    const formatTimeStringForForm = (timeInput: any): string => {
        if (!timeInput) return '';
        if (typeof timeInput === 'string' && /\d{2}:\d{2}(:\d{2})?/.test(timeInput)) {
            const parts = timeInput.split(':');
            const h = parts[0].padStart(2, '0');
            const m = parts[1].padStart(2, '0');
            const s = (parts[2] || '00').padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
        if (typeof timeInput === 'object' && typeof timeInput.hours !== 'undefined') { // Check for TimeSpan like obj
            const hours = (timeInput.hours || 0).toString().padStart(2, '0');
            const minutes = (timeInput.minutes || 0).toString().padStart(2, '0');
            const seconds = (timeInput.seconds || 0).toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
        return '00:00:00';
    };

    const form = useForm({
        initialValues: {
            showId: propShowId?.toString() || performance?.showId?.toString() || '',
            performanceDate: null as Date | null,
            startTime: '00:00:00',
            endTime: '00:00:00',
            seatingType: performance?.seatingType?.toString() || '0',
            soldOut: false,
            cancel: false,
            active: true,
        },
        validate: {
            showId: (value) => (!value ? 'Show is required' : null),
            performanceDate: (value) => (!value ? 'Performance date is required' : null),
            startTime: (value) => (!value ? 'Start time is required' : !/^\d{2}:\d{2}:\d{2}$/.test(value) ? 'Format HH:MM:SS' : null),
            endTime: (value) => (!value ? 'End time is required' : !/^\d{2}:\d{2}:\d{2}$/.test(value) ? 'Format HH:MM:SS' : null),
        },
    });

    useEffect(() => {
        if (!isCreate && performanceDetails) {
            form.setValues({
                showId: performanceDetails.showId.toString(),
                performanceDate: new Date(performanceDetails.performanceDate),
                startTime: formatTimeStringForForm(performanceDetails.startTime),
                endTime: formatTimeStringForForm(performanceDetails.endTime),
                seatingType: performanceDetails.seatingType?.toString() || '0',
                soldOut: performanceDetails.soldOut ?? false,
                cancel: performanceDetails.cancel ?? false,
                active: performanceDetails.active ?? true,
            });
        } else if (isCreate) {
            form.setValues({
                showId: propShowId?.toString() || '',
                performanceDate: null,
                startTime: '',
                endTime: '',
                seatingType: '0',
                soldOut: false,
                cancel: false,
                active: true,
            });
        }
    }, [performanceDetails, isCreate, propShowId]); // form.setValues should be stable

    useEffect(() => {
        if (isLoadingTicketTypes || (!isCreate && isLoadingDetails)) {
            return;
        }

        if (isCreate) {
            // For creation, initialize prices from global ticket types
            if (ticketTypes.length > 0) {
                const initialPrices = ticketTypes.map(type => ({
                    ticketTypeId: type.ticketTypeId,
                    price: 0
                }));
                setTicketPrices(initialPrices);
            } else {
                setTicketPrices([]);
            }
        } else {
            // Edit mode - use the ticket prices from the performance details
            if (performanceDetails?.ticketPrices && performanceDetails.ticketPrices.length > 0) {
                // Map the API performance ticket prices to our form structure
                const formTicketPrices = performanceDetails.ticketPrices.map(tp => {
                    // Find the matching ticket type in the global list for the ID
                    // This maintains the ID reference for the update operation
                    const matchingTicketType = ticketTypes.find(tt => tt.typeName === tp.ticketTypeName);

                    return {
                        ticketPriceId: tp.ticketPriceId,
                        ticketTypeId: matchingTicketType?.ticketTypeId || 0, // Fallback to 0 if not found
                        price: tp.price,
                        ticketTypeName: tp.ticketTypeName // Store the name for display
                    };
                });

                setTicketPrices(formTicketPrices);
            } else if (ticketTypes.length > 0) {
                // Fallback: If no prices in performance details, initialize from global types
                const initialPrices = ticketTypes.map(type => ({
                    ticketTypeId: type.ticketTypeId,
                    price: 0
                }));
                setTicketPrices(initialPrices);
            } else {
                setTicketPrices([]);
            }
        }
    }, [isCreate, performanceDetails, ticketTypes, isLoadingTicketTypes, isLoadingDetails]);

    const showOptions = useMemo(() => shows.map((s) => ({
        value: s.showId.toString(),
        label: s.showName,
    })), [shows]);

    const seatingTypeOptions = [
        { value: '0', label: 'General Admission' },
        { value: '1', label: 'Reserved Seating' },
    ];

    const updateTicketPrice = (ticketTypeId: number, price: number | string) => {
        const numericPrice = Number(price);
        setTicketPrices(prev =>
            prev.map(tp =>
                tp.ticketTypeId === ticketTypeId ? { ...tp, price: isNaN(numericPrice) ? 0 : numericPrice } : tp
            )
        );
    };

    const validateTicketPrices = (): boolean => {
        if (ticketTypes.length > 0 && ticketPrices.length === 0 && !isLoadingTicketTypes) {
            notifications.show({
                title: 'Ticket Prices Required',
                message: 'Please configure prices for the available ticket types.',
                color: 'orange'
            });
            return false; // Or true if prices are optional for some reason
        }
        const hasNegativePrice = ticketPrices.some(tp => tp.price < 1);
        if (hasNegativePrice) {
            notifications.show({
                title: 'Validation Error',
                message: 'Ticket prices must be positive and greater than zero.',
                color: 'red'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = (values: typeof form.values) => {
        if (!validateTicketPrices()) return;

        const performanceDateISO = values.performanceDate ? dayjs(values.performanceDate).format('YYYY-MM-DD') : '';

        if (!performanceDateISO) {
            notifications.show({title: 'Validation Error', message: 'Performance date is invalid.', color: 'red'});
            return;
        }

        const formatTimeForSubmit = (timeStr: string): string => {
            if (!timeStr || !/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return '00:00:00';
            return timeStr;
        };

        const parsedSeatingType = parseInt(values.seatingType, 10);
        let finalSeatingType: typeof SeatingType[keyof typeof SeatingType] | undefined = undefined;

        if (parsedSeatingType === SeatingType.NUMBER_0 || parsedSeatingType === SeatingType.NUMBER_1) {
            finalSeatingType = parsedSeatingType as typeof SeatingType[keyof typeof SeatingType];
        } else {
            console.warn("Invalid seating type value after parsing:", parsedSeatingType);
        }

        // Prepare ticket prices payload, handling both create and update scenarios
        const preparedTicketPrices = ticketPrices.map(tp => {
            if (isCreate) {
                // For create, just use ticketTypeId and price
                return {
                    ticketTypeId: tp.ticketTypeId,
                    price: tp.price
                };
            } else {
                // For update, include the ticketPriceId if available
                return tp.ticketPriceId
                    ? {
                        ticketPriceId: tp.ticketPriceId,
                        ticketTypeId: tp.ticketTypeId,
                        price: tp.price
                    }
                    : {
                        ticketTypeId: tp.ticketTypeId,
                        price: tp.price
                    };
            }
        });

        const dtoPayloadBase = {
            performanceDate: performanceDateISO,
            startTime: formatTimeForSubmit(values.startTime),
            endTime: formatTimeForSubmit(values.endTime),
            soldOut: values.soldOut,
            cancel: values.cancel,
            active: values.active,
            ticketPrices: preparedTicketPrices,
        };

        if (isCreate) {
            const createDto: CreatePerformanceDto = {
                ...dtoPayloadBase,
                showId: parseInt(values.showId, 10),
                seatingType: finalSeatingType,
            };
            createMutation.mutate(createDto);
        } else if (performance?.performanceId) {
            const updateDto: UpdatePerformanceDto = {
                ...dtoPayloadBase
            };
            updateMutation.mutate({ id: performance.performanceId, data: updateDto });
        }
    };

    const getTicketTypeName = (ticketPrice: FormTicketPrice) => {
        if (isLoadingTicketTypes) return <Loader size="xs" />;

        // In edit mode, use the name stored directly from the API response if available
        if (!isCreate && ticketPrice.ticketTypeName) {
            return ticketPrice.ticketTypeName;
        }

        // Otherwise, look it up from the global list
        if (ticketTypes.length === 0) return 'No Types';
        const ticketType = ticketTypes.find(tt => tt.ticketTypeId === ticketPrice.ticketTypeId);
        return ticketType ? ticketType.typeName : `Unknown (ID: ${ticketPrice.ticketTypeId})`;
    };

    const overallIsLoading = isLoadingShows || isLoadingTicketTypes || (!isCreate && isLoadingDetails);

    if (overallIsLoading) {
        return <Alert color="blue" title="Loading..." icon={<Loader />}>Please wait while form data is being prepared.</Alert>;
    }
    if (!isCreate && isErrorDetails) {
        return <Alert color="red" title="Error" icon={<IconAlertCircle />}>{detailsError?.message || "Failed to load performance details for editing."}</Alert>;
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Performance Information</Title>
                        <Select
                            label="Show"
                            placeholder={isLoadingShows ? "Loading shows..." : "Select show"}
                            data={showOptions}
                            required
                            searchable
                            disabled={isLoadingShows || (!isCreate && !!performanceDetails) || !!propShowId}
                            {...form.getInputProps('showId')}
                            mb="md"
                        />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <DatePickerInput
                                label="Performance Date"
                                placeholder="Select date"
                                required
                                clearable={false}
                                leftSection={<IconCalendar size="1rem" />}
                                {...form.getInputProps('performanceDate')}
                            />
                            <Select
                                label="Seating Type"
                                placeholder="Select seating type"
                                data={seatingTypeOptions}
                                leftSection={<IconTicket size="1rem" />}
                                disabled={!isCreate} // Usually not changeable after creation
                                {...form.getInputProps('seatingType')}
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                            <TimeInput
                                label="Start Time"
                                placeholder="HH:MM:SS"
                                required
                                withSeconds
                                leftSection={<IconClock size="1rem" />}
                                {...form.getInputProps('startTime')}
                            />
                            <TimeInput
                                label="End Time"
                                placeholder="HH:MM:SS"
                                required
                                withSeconds
                                leftSection={<IconClock size="1rem" />}
                                {...form.getInputProps('endTime')}
                            />
                        </SimpleGrid>
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Performance Status</Title>
                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                            <Switch label="Active" {...form.getInputProps('active', { type: 'checkbox' })} size="md" color="green"/>
                            <Switch label="Sold Out" {...form.getInputProps('soldOut', { type: 'checkbox' })} size="md" color="yellow"/>
                            {/*<Switch label="Cancelled" {...form.getInputProps('cancel', { type: 'checkbox' })} size="md" color="red"/>*/}
                        </SimpleGrid>
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                        <Title order={5} mb="md">Ticket Pricing</Title>
                        {isLoadingTicketTypes ? <Text>Loading ticket types...</Text> :
                            ticketTypes.length === 0 ? (
                                <Alert color="orange" title="No Ticket Types Defined">
                                    Ticket types must be created in the system before prices can be set.
                                </Alert>
                            ) : (
                                <>
                                    <Text size="sm" mb="md" c="dimmed">
                                        Set prices for all available ticket types.
                                    </Text>
                                    <Table withTableBorder withColumnBorders>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Ticket Type</Table.Th>
                                                <Table.Th style={{ width: '150px' }}>Price ($)</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {ticketPrices.map((tp) => (
                                                <Table.Tr key={tp.ticketTypeId || tp.ticketPriceId}>
                                                    <Table.Td>{getTicketTypeName(tp)}</Table.Td>
                                                    <Table.Td>
                                                        <NumberInput
                                                            value={tp.price}
                                                            onChange={(value) => updateTicketPrice(tp.ticketTypeId, value ?? 0)}
                                                            min={0}
                                                            step={0.01}
                                                            leftSection={<IconCurrencyDollar size="1rem" />}
                                                            required
                                                            hideControls
                                                        />
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                            {ticketPrices.length === 0 && !isLoadingTicketTypes && ticketTypes.length > 0 && (
                                                <Table.Tr><Table.Td colSpan={2}><Text c="dimmed" ta="center">Initializing prices...</Text></Table.Td></Table.Tr>
                                            )}
                                        </Table.Tbody>
                                    </Table>
                                </>
                            )}
                    </Paper>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="default" onClick={onClose} disabled={createMutation.isPending || updateMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={createMutation.isPending || updateMutation.isPending}
                            color="pink.8"
                            disabled={isLoadingTicketTypes || (ticketTypes.length === 0 && !isLoadingTicketTypes)}
                        >
                            {isCreate ? 'Create Performance' : 'Update Performance'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}