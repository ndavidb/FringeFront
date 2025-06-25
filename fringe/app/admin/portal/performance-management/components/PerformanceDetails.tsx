'use client';

import React from 'react';
import {
    Text,
    Paper,
    Group,
    Badge,
    Stack,
    Title,
    Divider,
    Box,
    Card,
    SimpleGrid,
    Table,
    Skeleton,
    Alert
} from '@mantine/core';
import {
    IconCalendarEvent,
    IconTicket,
    IconClock,
    IconCheck,
    IconX,
    IconCurrencyDollar,
    IconAlertCircle
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { SeatingType } from '@/types/api/seatingType';
import { useQuery } from '@tanstack/react-query';
import { formatTimeRange } from '@/utils/timeUtils';
import { getPerformanceById } from '@/services/performanceService';
import { Performance as ApiPerformance } from '@/types/api/performance'; // Import the main Performance type

interface PerformanceDetailsProps {
    performanceId: number | null;
}

// Define the structure of ticketPrice item as returned by getPerformanceById
interface PerformanceTicketPriceDetailFromApi {
    ticketPriceId: number;
    ticketTypeName: string;
    price: number;
    // Add other properties if your API returns them for this specific context
}

// Augment the main Performance type for what getPerformanceById returns
interface DetailedPerformance extends Omit<ApiPerformance, 'ticketPrices' | 'startTime' | 'endTime'> {
    ticketPrices?: PerformanceTicketPriceDetailFromApi[];
    startTime: string; // API returns string "HH:mm:ss"
    endTime: string;   // API returns string "HH:mm:ss"
}


export default function PerformanceDetails({ performanceId }: PerformanceDetailsProps) {
    const {
        data: performance,
        isLoading: isLoadingPerformance,
        isError: isErrorPerformance,
        error: performanceError
    } = useQuery<DetailedPerformance | null, Error>({ // Specify types
        queryKey: ['performance', performanceId],
        queryFn: async () => {
            if (!performanceId) return null;
            // The getPerformanceById service should ideally return the DetailedPerformance structure
            return getPerformanceById(performanceId) as unknown as DetailedPerformance;
        },
        enabled: !!performanceId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD MMM YYYY');
    };

    if (!performanceId) {
        return <Text c="dimmed">No performance selected.</Text>;
    }

    if (isLoadingPerformance) {
        return (
            <Stack gap="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Skeleton height={30} width="70%" mb="md" />
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                        <Skeleton height={50} /><Skeleton height={50} />
                    </SimpleGrid>
                    <Divider my="md" />
                    <Skeleton height={20} width="40%" mb="md" />
                    <Skeleton height={80} />
                    <Divider my="md" />
                    <Skeleton height={20} width="30%" mb="md" />
                    <Skeleton height={100} />
                </Card>
            </Stack>
        );
    }

    if (isErrorPerformance || !performance) {
        return (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Error Loading Details" color="red">
                {performanceError?.message || 'Could not load performance details. Please try again.'}
            </Alert>
        );
    }

    const typedTicketPrices = (performance.ticketPrices || []) as PerformanceTicketPriceDetailFromApi[];

    return (
        <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between" wrap="nowrap">
                        <Title order={3}>{performance.showName}</Title>
                        <Badge
                            color={
                                performance.cancel ? 'red' :
                                    performance.soldOut ? 'yellow' :
                                        performance.active ? 'green' : 'gray'
                            }
                            size="lg"
                            variant="filled"
                        >
                            {performance.cancel ? 'Cancelled' :
                                performance.soldOut ? 'Sold Out' :
                                    performance.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Group>
                </Card.Section>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    {/*<DetailItem*/}
                    {/*    icon={<IconBuilding size={20} />}*/}
                    {/*    label="Venue"*/}
                    {/*    value={performance.venueName || 'N/A'}*/}
                    {/*    */}
                    {/*/>*/}
                    <DetailItem
                        icon={<IconTicket size={20} />}
                        label="Seating Type"
                        value={performance.seatingType === SeatingType.NUMBER_0 ? 'General Admission' : 'Reserved Seating'}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconCalendarEvent size={20} />}
                        label="Performance Date"
                        value={formatDate(performance.performanceDate)}
                    />
                    <DetailItem
                        icon={<IconClock size={20} />}
                        label="Show Time"
                        value={formatTimeRange(performance.startTime, performance.endTime)}
                    />
                </SimpleGrid>

                <Divider my="md" />

                <Title order={5} mb="md">Status Information</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                    <StatusItem label="Active" value={performance.active} />
                    <StatusItem label="Sold Out" value={performance.soldOut} />
                    <StatusItem label="Cancelled" value={performance.cancel} />
                </SimpleGrid>

                <Divider my="md" />

                <Title order={5} mb="md">
                    <Group>
                        <IconCurrencyDollar size={20} />
                        <Text>Ticket Pricing</Text>
                    </Group>
                </Title>

                {typedTicketPrices.length > 0 ? (
                    <Table withTableBorder withColumnBorders striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Ticket Type</Table.Th>
                                <Table.Th>Price</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {typedTicketPrices.map((tp) => (
                                <Table.Tr key={tp.ticketPriceId}>
                                    <Table.Td>{tp.ticketTypeName || 'N/A'}</Table.Td>
                                    <Table.Td>${tp.price.toFixed(2)}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Text c="dimmed" fs="italic">No ticket prices have been set for this performance.</Text>
                )}

                <Divider my="md" />

                <Title order={5} mb="md">Metadata</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <DetailItem
                        icon={<IconCalendarEvent size={20} />}
                        label="Created At"
                        value={dayjs(performance.createdAt).format('DD MMM YYYY, HH:mm')}
                    />
                    {performance.updatedAt && (
                        <DetailItem
                            icon={<IconCalendarEvent size={20} />}
                            label="Last Updated"
                            value={dayjs(performance.updatedAt).format('DD MMM YYYY, HH:mm')}
                        />
                    )}
                </SimpleGrid>
            </Card>
        </Stack>
    );
}

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
    return (
        <Box>
            <Group align="center" mb={5}>
                {icon}
                <Text fw={600} size="sm" c="dimmed">{label}</Text>
            </Group>
            <Text>{value}</Text>
        </Box>
    );
}

interface StatusItemProps {
    label: string;
    value: boolean;
}

function StatusItem({ label, value }: StatusItemProps) {
    return (
        <Paper withBorder p="sm" radius="md">
            <Group align="center" justify="space-between">
                <Text fw={600} size="sm">{label}</Text>
                {value ? (
                    <Badge leftSection={<IconCheck size={14} />} color="green">Yes</Badge>
                ) : (
                    <Badge leftSection={<IconX size={14} />} color="red" variant="light">No</Badge>
                )}
            </Group>
        </Paper>
    );
}