'use client';

import React, { useState } from 'react';
import {
    Text,
    Paper,
    Group,
    Badge,
    Stack,
    Title,
    Divider,
    Image,
    Box,
    Card,
    SimpleGrid,
    Anchor,
    Alert, Accordion,
} from '@mantine/core';
import {
    IconBuilding,
    IconUsers,
    IconMapPin,
    IconMail,
    IconPhone,
    IconLink,
    IconCategory,
    IconPhoto,
    IconInfoCircle, IconArmchair,
} from '@tabler/icons-react';
import { Venue } from '@/types/api/venue';
import { getFileUrl } from "@/services/fileUploadService";
import {SeatingVisualizer} from "@/app/admin/portal/venue-management/components/VenueSeatingPlan";

interface VenueDetailsProps {
    venue: Venue | null;
}

export default function VenueDetails({ venue }: VenueDetailsProps) {


    // State to track image loading error
    const [imageError, setImageError] = useState(false);
    if (!venue) return null;
    // Check if venue has an image URL
    const hasImage = venue.imagesUrl && venue.imagesUrl.length > 0;

    // Generate proper image URL
    const imageUrl = hasImage ? getFileUrl(venue.imagesUrl) : '';


    return (
        <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between" wrap="nowrap">
                        <Title order={3}>{venue.venueName}</Title>
                        <Badge color={venue.active ? 'green' : 'red'} size="lg" variant="filled">
                            {venue.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Group>
                </Card.Section>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconMapPin size={20} />}
                        label="Location"
                        value={venue.locationName || 'N/A'}
                    />

                    <DetailItem
                        icon={<IconCategory size={20} />}
                        label="Venue Type"
                        value={venue.typeId?.toString() || 'N/A'}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconUsers size={20} />}
                        label="Maximum Capacity"
                        value={venue.maxCapacity?.toString() || 'N/A'}
                    />

                    <DetailItem
                        icon={<IconLink size={20} />}
                        label="Website"
                        value={venue.venueUrl || 'N/A'}
                        link={venue.venueUrl}
                    />
                </SimpleGrid>
                <Divider my="md" />
                <Paper withBorder p="md" radius="md">
                    <Title order={5} mb="md">Seating plan</Title>

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
                                    rows={Number(venue.rows)}
                                    seatsPerRow={Number(venue.seatsPerRow)}
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Paper>

                <Divider my="sm" />

                <DetailItemLarge
                    icon={<IconBuilding size={20} />}
                    label="Description"
                    value={venue.description || 'No description available.'}
                />

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    <DetailItem
                        icon={<IconMail size={20} />}
                        label="Contact Email"
                        value={venue.contactEmail || 'N/A'}
                        link={venue.contactEmail ? `mailto:${venue.contactEmail}` : undefined}
                    />

                    <DetailItem
                        icon={<IconPhone size={20} />}
                        label="Contact Phone"
                        value={venue.contactPhone || 'N/A'}
                        link={venue.contactPhone ? `tel:${venue.contactPhone}` : undefined}
                    />
                </SimpleGrid>

                {/* Venue Image Section */}
                <Card withBorder shadow="sm" p="md" mt="md" radius="md">
                    <Card.Section withBorder inheritPadding py="xs">
                        <Group align="center">
                            <IconPhoto size={20} />
                            <Text fw={600} size="sm" c="dimmed">Venue Images</Text>
                        </Group>
                    </Card.Section>

                    <Card.Section p="md">
                        {hasImage && !imageError ? (
                            <Box pos="relative">
                                <Image
                                    src={imageUrl}
                                    alt={venue.venueName}
                                    radius="md"
                                    fit="contain"
                                    h={300}
                                    onError={() => {
                                        console.error('Image failed to load:', imageUrl);
                                        setImageError(true);
                                    }}
                                    fallbackSrc="https://placehold.co/600x400?text=Loading..."
                                />
                            </Box>
                        ) : (
                            <Box>
                                <Alert
                                    icon={<IconInfoCircle size={16} />}
                                    title={imageError ? "Error Loading Image" : "No Image Available"}
                                    color={imageError ? "red" : "gray"}
                                    variant="light"
                                >
                                    {imageError ? (
                                        <>
                                            The image could not be loaded. The file may be missing on the server.
                                            <Text size="xs" mt="xs">
                                                Image path: {venue.imagesUrl}
                                            </Text>
                                        </>
                                    ) : (
                                        "No image has been uploaded for this venue."
                                    )}
                                </Alert>

                                <Box
                                    h={200}
                                    bg="gray.1"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        marginTop: '10px'
                                    }}
                                >
                                    <IconPhoto size={48} stroke={1.5} color="#ced4da" />
                                </Box>
                            </Box>
                        )}
                    </Card.Section>
                </Card>
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
                <Anchor href={link} target={link.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer">
                    {value}
                </Anchor>
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
}

function DetailItemLarge({ icon, label, value }: DetailItemLargeProps) {
    return (
        <Paper
            p="md"
            withBorder
            mt="md"
        >
            <Group align="center" mb={5}>
                {icon}
                <Text fw={600} size="sm" c="dimmed">{label}</Text>
            </Group>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
        </Paper>
    );
}