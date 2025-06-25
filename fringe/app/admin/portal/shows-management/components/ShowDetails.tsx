// app/admin/portal/shows-management/components/ShowDetails.tsx
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
} from '@mantine/core';
import {
    IconCalendarEvent,
    IconBuilding,
    IconCategory,
    IconTicket,
    IconAlertTriangle,
    IconPhoto,
    IconVideo,
    IconUserCheck,
    IconInfoCircle
} from '@tabler/icons-react';
import { Show } from '@/types/api/show';
import dayjs from 'dayjs';

interface ShowDetailsProps {
    show: Show | null;
}

export default function ShowDetails({ show }: ShowDetailsProps) {
    if (!show) return null;

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD MMM YYYY, HH:mm');
    };

    return (
        <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between" wrap="nowrap">
                        <Title order={3}>{show.showName}</Title>
                        <Badge color={show.active ? 'green' : 'red'} size="lg" variant="filled">
                            {show.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Group>
                </Card.Section>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconBuilding size={20} />}
                        label="Venue"
                        value={show.venueName || 'N/A'}
                    />

                    <DetailItem
                        icon={<IconCategory size={20} />}
                        label="Show Type"
                        value={show.showType || 'N/A'}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconUserCheck size={20} />}
                        label="Age Restriction"
                        value={show.ageRestrictionCode || 'N/A'}
                    />

                    <DetailItem
                        icon={<IconTicket size={20} />}
                        label="Ticket Type"
                        value={show.ticketTypeName || 'N/A'}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconCalendarEvent size={20} />}
                        label="Start Date"
                        value={formatDate(show.startDate)}
                    />

                    <DetailItem
                        icon={<IconCalendarEvent size={20} />}
                        label="End Date"
                        value={formatDate(show.endDate)}
                    />
                </SimpleGrid>

                <Divider my="md" />

                <DetailItemLarge
                    icon={<IconInfoCircle size={20} />}
                    label="Description"
                    value={show.description || 'No description available.'}
                />

                {show.warningDescription && (
                    <DetailItemLarge
                        icon={<IconAlertTriangle size={20} color="orange" />}
                        label="Warning/Advisory"
                        value={show.warningDescription}
                        alertStyle
                    />
                )}

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconPhoto size={20} />}
                        label="Images URL"
                        value={show.imagesUrl || 'None'}
                        link={show.imagesUrl}
                    />

                    <DetailItem
                        icon={<IconVideo size={20} />}
                        label="Videos URL"
                        value={show.videosUrl || 'None'}
                        link={show.videosUrl}
                    />
                </SimpleGrid>
            </Card>
        </Stack>
    );
}

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    link?: string;
}

function DetailItem({ icon, label, value, link }: DetailItemProps) {
    return (
        <Box>
            <Group align="center" mb={5}>
                {icon}
                <Text fw={600} size="sm" c="dimmed">{label}</Text>
            </Group>
            {link ? (
                <Text component="a" href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                    {value}
                </Text>
            ) : (
                <Text>{value}</Text>
            )}
        </Box>
    );
}

interface DetailItemLargeProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    alertStyle?: boolean;
}

function DetailItemLarge({ icon, label, value, alertStyle }: DetailItemLargeProps) {
    return (
        <Paper
            p="md"
            withBorder
            mt="md"
            bg={alertStyle ? 'orange.0' : undefined}
            c={alertStyle ? 'orange.9' : undefined}
        >
            <Group align="center" mb={5}>
                {icon}
                <Text fw={600} size="sm" c={alertStyle ? 'orange.8' : 'dimmed'}>{label}</Text>
            </Group>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
        </Paper>
    );
}