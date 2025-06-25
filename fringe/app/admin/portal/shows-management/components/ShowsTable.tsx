// app/admin/portal/shows-management/components/ShowsTable.tsx
'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Group,
    Text,
    Badge,
    ActionIcon,
    Tooltip,
    Flex,
    Alert,
    Modal,
    Box,
    Title,
    Skeleton,
    Pagination,
    TextInput,
    Card,
    Stack,
    Grid,
    Menu,
    Tabs
} from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    IconEdit,
    IconTrash,
    IconPlus,
    IconSearch,
    IconAlertCircle,
    IconEye,
    IconFilter,
    IconCalendarStats,
    IconTicket,
    IconChevronDown
} from '@tabler/icons-react';
import { Show } from '@/types/api/show';
import { getShows, deleteShow } from '@/services/showsService';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import ShowForm from './ShowForm';
import ShowDetails from './ShowDetails';
import dayjs from 'dayjs';

export default function ShowsTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>('all');
    const [sortField, setSortField] = useState('startDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const itemsPerPage = 10;

    // State for modals
    const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

    const [selectedShow, setSelectedShow] = useState<Show | null>(null);

    const queryClient = useQueryClient();

    // Fetch shows data with improved error handling
    const {
        data: shows = [],
        isLoading,
        error,
        isError
    } = useQuery({
        queryKey: ['shows'],
        queryFn: getShows,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });

    // Delete show mutation with success/error notifications
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteShow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
            notifications.show({
                title: 'Success',
                message: 'Show deleted successfully',
                color: 'green'
            });
            closeDeleteModal();
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete show',
                color: 'red'
            });
        }
    });

    // Handle show edit
    const handleEdit = (show: Show) => {
        setSelectedShow(show);
        openEditModal();
    };

    // Handle show details view
    const handleViewDetails = (show: Show) => {
        setSelectedShow(show);
        openDetailsModal();
    };

    // Handle show delete
    const handleDelete = (show: Show) => {
        setSelectedShow(show);
        openDeleteModal();
    };

    // Handle delete confirmation
    const confirmDelete = () => {
        if (selectedShow) {
            deleteMutation.mutate(selectedShow.showId);
        }
    };

    // Sort shows
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Helper function to sort shows by field
    const sortShows = (a: Show, b: Show) => {
        let fieldA, fieldB;

        switch (sortField) {
            case 'showName':
                fieldA = a.showName?.toLowerCase() || '';
                fieldB = b.showName?.toLowerCase() || '';
                break;
            case 'venueName':
                fieldA = a.venueName?.toLowerCase() || '';
                fieldB = b.venueName?.toLowerCase() || '';
                break;
            case 'startDate':
                fieldA = new Date(a.startDate).getTime();
                fieldB = new Date(b.startDate).getTime();
                break;
            case 'endDate':
                fieldA = new Date(a.endDate).getTime();
                fieldB = new Date(b.endDate).getTime();
                break;
            default:
                fieldA = a.showName?.toLowerCase() || '';
                fieldB = b.showName?.toLowerCase() || '';
        }

        if (sortDirection === 'asc') {
            return fieldA > fieldB ? 1 : -1;
        } else {
            return fieldA < fieldB ? 1 : -1;
        }
    };

    // Filter shows based on search term and status
    const filteredShows = shows.filter(show => {
        // Handle possible null/undefined values
        const showName = show.showName || '';
        const venueName = show.venueName || '';
        const showType = show.showType || '';

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        const matchesSearch =
            showName.toLowerCase().includes(lowerSearchTerm) ||
            venueName.toLowerCase().includes(lowerSearchTerm) ||
            showType.toLowerCase().includes(lowerSearchTerm);

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'active') return matchesSearch && show.active;
        if (statusFilter === 'inactive') return matchesSearch && !show.active;

        return matchesSearch;
    }).sort(sortShows);

    // Paginate shows
    const paginatedShows = filteredShows.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Get status badge color
    const getStatusBadgeColor = (active: boolean) => {
        return active ? 'green' : 'red';
    };
    //
    // // Create table pagination controls
    // const handlePageChange = (page: number) => {
    //     setCurrentPage(page);
    // };

    // Render loading state
    if (isLoading) {
        return (
            <Card shadow="md" padding="lg" radius="md" withBorder>
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

    // Render error state
    if (isError && error) {
        return (
            <Card shadow="md" padding="lg" radius="md" withBorder>
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                >
                    {(error as Error).message || 'An error occurred while loading shows'}
                </Alert>
            </Card>
        );
    }

    // Render the shows table
    return (
        <>
            <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                    <Flex justify="space-between" align="center">
                        <Title order={3}>Shows Management</Title>
                        <Button
                            leftSection={<IconPlus size="1rem" />}
                            onClick={openCreateModal}
                            color="pink.8"
                            radius="md"
                        >
                            Add New Show
                        </Button>
                    </Flex>
                </Card.Section>

                <Tabs defaultValue="all" mb="md">
                    <Tabs.List>
                        <Tabs.Tab
                            value="all"
                            onClick={() => setStatusFilter('all')}
                            leftSection={<IconFilter size="0.8rem" />}
                        >
                            All Shows ({shows.length})
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="active"
                            onClick={() => setStatusFilter('active')}
                            leftSection={<IconCalendarStats size="0.8rem" />}
                        >
                            Active ({shows.filter(s => s.active).length})
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="inactive"
                            onClick={() => setStatusFilter('inactive')}
                            leftSection={<IconTicket size="0.8rem" />}
                        >
                            Inactive ({shows.filter(s => !s.active).length})
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                <Grid mb="md" align="center">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            placeholder="Search shows by name, venue or type..."
                            leftSection={<IconSearch size="1rem" />}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.currentTarget.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }} className="text-right">
                        <Group justify="flex-end">
                            <Menu shadow="md" position="bottom-end">
                                <Menu.Target>
                                    <Button color="pink.8" rightSection={<IconChevronDown size="1rem" />}>
                                        Sort by {sortField.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Sort by</Menu.Label>
                                    <Menu.Item onClick={() => handleSort('showName')}>
                                        Show Name {sortField === 'showName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => handleSort('venueName')}>
                                        Venue {sortField === 'venueName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => handleSort('startDate')}>
                                        Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => handleSort('endDate')}>
                                        End Date {sortField === 'endDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Grid.Col>
                </Grid>

                <Box style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Show Name</Table.Th>
                                <Table.Th>Venue</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Age Restriction</Table.Th>
                                <Table.Th>Date Range</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {paginatedShows.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7}>
                                        <Text ta="center" fz="sm" py="lg" c="dimmed">
                                            No shows found. Try adjusting your search or add a new show.
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                paginatedShows.map((show) => (
                                    <Table.Tr key={show.showId}>
                                        <Table.Td fw={500}>{show.showName}</Table.Td>
                                        <Table.Td>{show.venueName || 'N/A'}</Table.Td>
                                        <Table.Td>{show.showType || 'N/A'}</Table.Td>
                                        <Table.Td>{show.ageRestrictionCode || 'N/A'}</Table.Td>
                                        <Table.Td>
                                            {dayjs(show.startDate).format('DD/MM/YYYY')} - {dayjs(show.endDate).format('DD/MM/YYYY')}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={getStatusBadgeColor(show.active)} variant="light" size="sm">
                                                {show.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Tooltip label="View Details">
                                                    <ActionIcon variant="light" color="blue" onClick={() => handleViewDetails(show)}>
                                                        <IconEye size="1rem" />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Edit">
                                                    <ActionIcon variant="light" color="green" onClick={() => handleEdit(show)}>
                                                        <IconEdit size="1rem" />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Delete">
                                                    <ActionIcon variant="light" color="red" onClick={() => handleDelete(show)}>
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

                {filteredShows.length > itemsPerPage && (
                    <Flex justify="center" mt="xl">
                        <Pagination
                            total={Math.ceil(filteredShows.length / itemsPerPage)}
                            value={currentPage}
                            onChange={setCurrentPage}
                            color="purple"
                            radius="md"
                            withEdges
                        />
                    </Flex>
                )}

                {filteredShows.length > 0 && (
                    <Text size="sm" c="dimmed" ta="center" mt="md">
                        Showing {paginatedShows.length} of {filteredShows.length} shows
                    </Text>
                )}
            </Card>

            {/* Create Show Modal */}
            <Modal
                opened={createModalOpened}
                onClose={closeCreateModal}
                title="Add New Show"
                size="lg"
                centered
                overlayProps={{
                    blur: 3
                }}
            >
                <ShowForm
                    onClose={closeCreateModal}
                    isCreate={true}
                />
            </Modal>

            {/* Edit Show Modal */}
            <Modal
                opened={editModalOpened}
                onClose={closeEditModal}
                title="Edit Show"
                size="lg"
                centered
                overlayProps={{
                    blur: 3
                }}
            >
                <ShowForm
                    show={selectedShow}
                    onClose={closeEditModal}
                    isCreate={false}
                />
            </Modal>

            {/* View Show Details Modal */}
            <Modal
                opened={detailsModalOpened}
                onClose={closeDetailsModal}
                title="Show Details"
                size="lg"
                centered
                overlayProps={{
                    blur: 3
                }}
            >
                <ShowDetails show={selectedShow} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                title="Confirm Deletion"
                centered
                size="sm"
                overlayProps={{
                    blur: 3
                }}
            >
                <Stack>
                    <Text>
                        Are you sure you want to delete the show <strong>{selectedShow?.showName}</strong>? This action cannot be undone.
                    </Text>
                    <Group justify="flex-end" mt="lg">
                        <Button variant="outline" onClick={closeDeleteModal}>Cancel</Button>
                        <Button
                            color="red"
                            onClick={confirmDelete}
                            loading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}