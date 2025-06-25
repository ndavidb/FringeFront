'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Group,
    Badge,
    TextInput,
    Grid,
    Tabs,
    Menu,
    Text,
    Pagination,
    Card,
    Flex,
    Title,
    ActionIcon,
    Tooltip
} from '@mantine/core';
import {
    IconEdit,
    IconTrash,
    IconSearch,
    IconChevronDown,
    IconPlus,
    IconEye,
    IconSortAscending2,
    IconFilter,
    IconCalendarEvent,
    IconTicket
} from '@tabler/icons-react';
import { LocationDto } from '@/types/api/locationDto';

interface LocationsTableProps {
    locations: LocationDto[];
    onEdit: (location: LocationDto) => void;
    onDelete: (locationId: number) => void;
    onView?: (location: LocationDto) => void;
    onAddLocationClick?: () => void;
    showTabs?: boolean;
    enableSorting?: boolean;
    paginate?: boolean;
}

export function LocationsTable({
    locations,
    onEdit,
    onDelete,
    onView,
    onAddLocationClick,
    showTabs = false,
    enableSorting = false,
    paginate = false
}: LocationsTableProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortField, setSortField] = useState<'locationName' | 'suburb' | 'state'>('locationName');
    const [sortDir] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const filtered = locations
        .filter(loc => {
            const match =
                loc.locationName?.toLowerCase().includes(search.toLowerCase()) ||
                loc.suburb?.toLowerCase().includes(search.toLowerCase()) ||
                loc.state?.toLowerCase().includes(search.toLowerCase());
            if (statusFilter === 'active') return loc.active && match;
            if (statusFilter === 'inactive') return !loc.active && match;
            return match;
        })
        .sort((a, b) => {
            const aValue = a[sortField]?.toLowerCase?.() ?? '';
            const bValue = b[sortField]?.toLowerCase?.() ?? '';
            return sortDir === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });

    const paginated = paginate
        ? filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        : filtered;

    return (
        <Card shadow="sm" padding="md" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Flex justify="space-between" align="center">
                    <Title order={3}>Location Management</Title>
                    <Button
                        leftSection={<IconPlus size="1rem" />}
                        radius="md"
                        onClick={onAddLocationClick}
                        color="pink.8"
                    >
                        Add Location
                    </Button>
                </Flex>
            </Card.Section>

            {showTabs && (
                <Tabs value={statusFilter} onChange={(value) => setStatusFilter(value as never)} mb="md">
                    <Tabs.List>
                        <Tabs.Tab
                            value="all"
                            leftSection={<IconFilter size="1rem" />}
                        >
                            All ({locations.length})
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="active"
                            leftSection={<IconCalendarEvent size="1rem" />}
                        >
                            Active ({locations.filter((l) => l.active).length})
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="inactive"
                            leftSection={<IconTicket size="1rem" />}
                        >
                            Inactive ({locations.filter((l) => !l.active).length})
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            )}

            <Grid mb="md" align="center">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        placeholder="Search by name, suburb or state..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.currentTarget.value);
                            setPage(1);
                        }}
                        leftSection={<IconSearch size={16} />}
                    />
                </Grid.Col>

                {enableSorting && (
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group justify="flex-end">
                            <Menu shadow="md" position="bottom-end">
                                <Menu.Target>
                                    <Button
                                        leftSection={<IconSortAscending2 size="1rem" />}
                                        rightSection={<IconChevronDown size="1rem" />}
                                        radius="md"
                                        color="pink.8"
                                    >
                                        Sort by {sortField}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Sort by</Menu.Label>
                                    <Menu.Item onClick={() => setSortField('locationName')}>Name</Menu.Item>
                                    <Menu.Item onClick={() => setSortField('suburb')}>Suburb</Menu.Item>
                                    <Menu.Item onClick={() => setSortField('state')}>State</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Grid.Col>
                )}
            </Grid>

            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Address</Table.Th>
                        <Table.Th>City/Suburb</Table.Th>
                        <Table.Th>State</Table.Th>
                        <Table.Th>Country</Table.Th>
                        <Table.Th>Parking</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {paginated.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={8}>
                                <Text ta="center" fz="sm" py="lg" c="dimmed">
                                    No locations found. Try adjusting your search or add a new location.
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        paginated.map((location) => (
                            <Table.Tr key={location.id}>
                                <Table.Td>{location.locationName}</Table.Td>
                                <Table.Td>{location.address}</Table.Td>
                                <Table.Td>{location.suburb}</Table.Td>
                                <Table.Td>{location.state}</Table.Td>
                                <Table.Td>{location.country}</Table.Td>
                                <Table.Td>
                                    <Badge color={location.parkingAvailable ? 'green' : 'red'} variant="light">
                                        {location.parkingAvailable ? 'Yes' : 'No'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color={location.active ? 'green' : 'red'} variant="light">
                                        {location.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        {onView && (
                                            <Tooltip label="View Details">
                                                <ActionIcon variant="light" color="blue" onClick={() => onView(location)}>
                                                    <IconEye size="1rem" />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                        <Tooltip label="Edit">
                                            <ActionIcon variant="light" color="green" onClick={() => onEdit(location)}>
                                                <IconEdit size="1rem" />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Delete">
                                            <ActionIcon variant="light" color="red" onClick={() => onDelete(Number(location.id))}>
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

            {paginate && filtered.length > itemsPerPage && (
                <Flex justify="center" mt="xl">
                    <Pagination
                        total={Math.ceil(filtered.length / itemsPerPage)}
                        value={page}
                        onChange={setPage}
                        color="purple"
                        radius="md"
                        withEdges
                    />
                </Flex>
            )}

            {filtered.length > 0 && (
                <Text size="sm" c="dimmed" ta="center" mt="md">
                    Showing {paginated.length} of {filtered.length} locations
                </Text>
            )}
        </Card>
    );
}
