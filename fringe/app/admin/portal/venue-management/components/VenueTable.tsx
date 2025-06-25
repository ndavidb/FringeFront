'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Group,
    Badge,
    ActionIcon,
    Tooltip,
    TextInput,
    Grid,
    Tabs,
    Menu,
    Text,
    Pagination,
    Card,
    Flex,
    Title,
    Skeleton,
    Box,
    Center
} from '@mantine/core';
import {
    IconEdit,
    IconTrash,
    IconSearch,
    IconChevronDown,
    IconPlus,
    IconEye,
    IconFilter,
    IconBuilding,
    IconUsers,
    IconDatabaseOff
} from '@tabler/icons-react';
import { Venue } from '@/types/api/venue';

interface VenueTableProps {
    venues?: Venue[];
    onEdit?: (venue: Venue) => void;
    onDelete?: (venue: Venue) => void;
    onViewDetails?: (venue: Venue) => void;
    onConfigureSeating?: (venue: Venue) => void;
    onAddVenueClick?: () => void;
    showTabs?: boolean;
    enableSorting?: boolean;
    paginate?: boolean;
    isLoading?: boolean;
}

export default function VenueTable({
                                       venues = [],
                                       onEdit = () => {},
                                       onDelete = () => {},
                                       onViewDetails = () => {},
                                       onAddVenueClick = () => {},
                                       showTabs = false,
                                       enableSorting = false,
                                       paginate = false,
                                       isLoading = false
                                   }: VenueTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>('all');
    const [sortField, setSortField] = useState('venueName');
    const [sortDirection, setSortDirection] = useState('desc');
    const itemsPerPage = 10;

    // Handle sorting
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort venues
    const sortVenues = (a: Venue, b: Venue) => {
        let fieldA, fieldB;

        switch (sortField) {
            case 'venueName':
                fieldA = a.venueName?.toLowerCase() || '';
                fieldB = b.venueName?.toLowerCase() || '';
                break;
            case 'maxCapacity':
                fieldA = a.maxCapacity || 0;
                fieldB = b.maxCapacity || 0;
                break;
            case 'locationName':
                fieldA = a.locationName?.toLowerCase() || '';
                fieldB = b.locationName?.toLowerCase() || '';
                break;
            default:
                fieldA = a.venueName?.toLowerCase() || '';
                fieldB = b.venueName?.toLowerCase() || '';
        }

        if (sortDirection === 'asc') {
            return fieldA > fieldB ? 1 : -1;
        } else {
            return fieldA < fieldB ? 1 : -1;
        }
    };

    // Filter venues based on search term and status
    const filtered = venues.filter(venue => {
        const match =
            venue.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.locationName?.toLowerCase().includes(searchTerm.toLowerCase())||
            venue.description?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'active') return venue.active && match;
        if (statusFilter === 'inactive') return !venue.active && match;
        return match;
    }).sort(sortVenues);

    // Paginate venues
    const paginated = paginate
        ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : filtered;

    // Get status badge color
    const getStatusBadgeColor = (active: boolean) => {
        return active ? 'green' : 'red';
    };

    // Render loading state
    if (isLoading) {
        return (
            <Card withBorder p="md" radius="md">
                <Skeleton height={40} mb="md" width="100%" />
                <Grid mb="md">
                    <Grid.Col span={8}><Skeleton height={40} /></Grid.Col>
                    <Grid.Col span={4}><Skeleton height={40} /></Grid.Col>
                </Grid>
                {Array(5).fill(0).map((_, i) => (
                    <Box key={i} mb="sm">
                        <Skeleton height={50} width="100%" />
                    </Box>
                ))}
            </Card>
        );
    }

    // Render empty state when no venues and not loading
    if (venues.length === 0) {
        return (
            <Card withBorder p="md" radius="md">
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                    <Flex justify="space-between" align="center">
                        <Title order={3}>Venue Management</Title>
                        <Button
                            leftSection={<IconPlus size="1rem" />}
                            onClick={onAddVenueClick}
                            color="pink.8"
                            radius="md"
                        >
                            Add New Venue
                        </Button>
                    </Flex>
                </Card.Section>

                <Center py={50}>
                    <Flex direction="column" align="center" gap="md">
                        <IconDatabaseOff size={40} color="gray" />
                        <Text fz="lg" fw={500} c="dimmed">No venues found</Text>
                        <Text c="dimmed" ta="center" maw={400}>
                            There are no venues available in the system. Use the &apos;Add New Venue&apos; button to create your first venue.
                        </Text>
                    </Flex>
                </Center>
            </Card>
        );
    }

    return (
        <Card withBorder p="md" radius="md">
            <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Flex justify="space-between" align="center">
                    <Title order={3}>Venue Management</Title>
                    <Button
                        leftSection={<IconPlus size="1rem" />}
                        onClick={onAddVenueClick}
                        color="pink.8"
                        radius="md"
                    >
                        Add New Venue
                    </Button>
                </Flex>
            </Card.Section>

            {showTabs && (
                <Tabs value={statusFilter} onChange={(value) => setStatusFilter(value as string)} mb="md">
                    <Tabs.List>
                        <Tabs.Tab
                            value="all"
                            leftSection={<IconFilter size="0.8rem" />}
                        >
                            All Venues ({venues.length})
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="active"
                            leftSection={<IconBuilding size="0.8rem" />}
                        >
                            Active ({venues.filter(v => v.active).length})
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="inactive"
                            leftSection={<IconUsers size="0.8rem" />}
                        >
                            Inactive ({venues.filter(v => !v.active).length})
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            )}

            <Grid mb="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        placeholder="Search by name, location or description..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.currentTarget.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        leftSection={<IconSearch size={16} />}
                    />
                </Grid.Col>
                {enableSorting && (
                    <Grid.Col span={{ base: 12, md: 6 }} className="text-right">
                        <Group justify="flex-end">
                            <Menu shadow="md" position="bottom-end">
                                <Menu.Target>
                                    <Button rightSection={<IconChevronDown size={16} />} bg="pink.8">
                                        Sort by {sortField.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Sort by</Menu.Label>
                                    <Menu.Item onClick={() => handleSort('venueName')}>
                                        Venue Name {sortField === 'venueName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => handleSort('maxCapacity')}>
                                        Capacity {sortField === 'maxCapacity' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => handleSort('locationName')}>
                                        Location {sortField === 'locationName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Grid.Col>
                )}
            </Grid>

            <Box style={{ overflowX: 'auto' }}>
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Venue Name</Table.Th>
                            <Table.Th>Location</Table.Th>
                            <Table.Th>Max Capacity</Table.Th>
                            <Table.Th>Contact</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginated.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={6}>
                                    <Text ta="center" fz="sm" py="lg" c="dimmed">
                                        No venues found. Try adjusting your search or add a new venue.
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            paginated.map((venue) => (
                                <Table.Tr key={venue.venueId}>
                                    <Table.Td fw={500}>{venue.venueName}</Table.Td>
                                    <Table.Td>{venue.locationName || 'N/A'}</Table.Td>
                                    <Table.Td>{venue.maxCapacity}</Table.Td>
                                    <Table.Td>{venue.contactEmail || 'N/A'}</Table.Td>
                                    <Table.Td>
                                        <Badge color={getStatusBadgeColor(venue.active)} variant="light" size="sm">
                                            {venue.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Tooltip label="View Details">
                                                <ActionIcon variant="light" color="blue" onClick={() => onViewDetails(venue)}>
                                                    <IconEye size="1rem" />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Edit">
                                                <ActionIcon variant="light" color="green" onClick={() => onEdit(venue)}>
                                                    <IconEdit size="1rem" />
                                                </ActionIcon>
                                            </Tooltip>

                                            <Tooltip label="Delete">
                                                <ActionIcon variant="light" color="red" onClick={() => onDelete(venue)}>
                                                    <IconTrash size="1rem" />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Box>

            {paginate && filtered.length > itemsPerPage && (
                <Flex justify="center" mt="xl">
                    <Pagination
                        total={Math.ceil(filtered.length / itemsPerPage)}
                        value={currentPage}
                        onChange={setCurrentPage}
                        color="purple"
                        radius="md"
                        withEdges
                    />
                </Flex>
            )}

            {filtered.length > 0 && (
                <Text size="sm" c="dimmed" ta="center" mt="md">
                    Showing {paginated.length} of {filtered.length} venues
                </Text>
            )}
        </Card>
    );
}
