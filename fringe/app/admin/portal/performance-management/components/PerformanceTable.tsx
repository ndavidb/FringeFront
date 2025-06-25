
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
    Menu, Grid, Space
} from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    IconEdit,
    IconCancel,
    IconPlus,
    IconSearch,
    IconAlertCircle,
    IconEye,
    IconChevronDown
} from '@tabler/icons-react';
import { Performance } from '@/types/api/performance';
import { getPerformances, deletePerformance, getPerformancesByShowId } from '@/services/performanceService';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import PerformanceForm from './PerformanceForm';
import PerformanceDetails from './PerformanceDetails';
import dayjs from 'dayjs';
import {SeatingType} from "@/types/api/seatingType";
import {formatTimeRange} from "@/utils/timeUtils";

interface PerformancesTableProps {
    showId?: number;
}

export default function PerformancesTable({ showId }: PerformancesTableProps = {}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>('all'); // 'all', 'active', 'soldOut', 'cancelled', 'inactive'
    const [sortField, setSortField] = useState('performanceDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const itemsPerPage = 10;

    const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

    const [selectedPerformanceForEdit, setSelectedPerformanceForEdit] = useState<Performance | null>(null);
    const [selectedPerformanceIdForDetails, setSelectedPerformanceIdForDetails] = useState<number | null>(null);
    const [performanceToDelete, setPerformanceToDelete] = useState<Performance | null>(null);

    const queryClient = useQueryClient();

    const queryKey = showId ? ['performances', 'show', showId] : ['performances'];
    const queryFn = showId ? () => getPerformancesByShowId(showId) : getPerformances;

    const {
        data: performances = [],
        isLoading,
        error,
        isError
    } = useQuery<Performance[], Error>({
        queryKey: queryKey,
        queryFn: queryFn,
        staleTime: 60 * 1000,
        retry: 1,
    });

    const deleteMutation = useMutation<void, Error, number>({
        mutationFn: (id: number) => deletePerformance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
            // Also invalidate general performances if a specific show's performance is deleted
            if (showId) {
                queryClient.invalidateQueries({ queryKey: ['performances'] });
            }
            notifications.show({
                title: 'Success',
                message: 'Performance deleted successfully',
                color: 'green'
            });
            closeDeleteModal();
            setPerformanceToDelete(null);
        },
        onError: (err: Error) => {
            notifications.show({
                title: 'Deletion Failed',
                message: err.message || 'Failed to delete performance.',
                color: 'red'
            });
        }
    });

    const handleEdit = (p: Performance) => {
        setSelectedPerformanceForEdit(p);
        openEditModal();
    };

    const handleViewDetails = (p: Performance) => {
        setSelectedPerformanceIdForDetails(p.performanceId);
        openDetailsModal();
    };

    const handleDelete = (p: Performance) => {
        setPerformanceToDelete(p);
        openDeleteModal();
    };

    const confirmDelete = () => {
        if (performanceToDelete) {
            deleteMutation.mutate(performanceToDelete.performanceId);
        }
    };

    const handleSort = (field: string) => {
        const newDirection = (sortField === field && sortDirection === 'asc') ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
    };

    const sortPerformancesInternal = (a: Performance, b: Performance) => {
        let valA: any = a[sortField as keyof Performance];
        let valB: any = b[sortField as keyof Performance];

        if (sortField === 'performanceDate') {
            valA = new Date(a.performanceDate).getTime();
            valB = new Date(b.performanceDate).getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    };

    const filteredPerformances = performances
        .filter(p => {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            const matchesSearch = lowerSearchTerm === '' ||
                (p.showName || '').toLowerCase().includes(lowerSearchTerm) ||
                (p.venueName || '').toLowerCase().includes(lowerSearchTerm) ||
                dayjs(p.performanceDate).format('DD MMM YYYY').toLowerCase().includes(lowerSearchTerm) ||
                dayjs(p.performanceDate).format('DD/MM/YYYY').includes(lowerSearchTerm);

            if (!matchesSearch) return false;

            switch (statusFilter) {
                case 'active': return p.active && !p.cancel;
                case 'soldOut': return p.soldOut && p.active && !p.cancel;
                case 'cancelled': return p.cancel;
                case 'inactive': return !p.active && !p.cancel; // Inactive generally means not active and not cancelled
                case 'all':
                default: return true;
            }
        })
        .sort(sortPerformancesInternal);

    const paginatedPerformances = filteredPerformances.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (p: Performance) => {
        if (p.cancel) return { color: 'red', text: 'Cancelled' };
        if (p.soldOut) return { color: 'yellow', text: 'Sold Out' };
        return p.active ? { color: 'green', text: 'Active' } : { color: 'gray', text: 'Inactive' };
    };


    if (isLoading) {
        return (
            <Card shadow="md" padding="lg" radius="md" withBorder>
                <Flex justify="space-between" align="center" mb="md">
                    <Skeleton height={30} width="30%" />
                    <Skeleton height={36} width="200px" />
                </Flex>
                <Group mb="md">
                    <Skeleton height={36} style={{flexGrow: 1}} />
                    <Skeleton height={36} width="150px" />
                </Group>
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} height={40} mt="sm" radius="sm" />)}
            </Card>
        );
    }

    if (isError) {
        return (
            <Card shadow="md" padding="lg" radius="md" withBorder>
                <Alert icon={<IconAlertCircle size={16} />} title="Error Loading Performances" color="red">
                    {error?.message || 'An unexpected error occurred while fetching performances.'}
                </Alert>
            </Card>
        );
    }

    const statusFilterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Sold Out', value: 'soldOut' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Inactive', value: 'inactive' },
    ];


    return (
        <>
            <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                    <Flex justify="space-between" align="center" wrap="wrap" gap="md">
                        <Title order={3}>Performances Management</Title>
                        <Button leftSection={<IconPlus size="1rem" />} onClick={openCreateModal} color="pink.8" radius="md">
                            Add New Performance
                        </Button>
                    </Flex>
                </Card.Section>

                <Grid mb="md" align="center">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            placeholder="Search by show, venue, or date..."
                            leftSection={<IconSearch size="1rem" />}
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.currentTarget.value); setCurrentPage(1); }}
                            style={{ flex: 2 }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }} className="text-right">
                        <Group justify="flex-end">
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Button variant="outline" color="pink.8" rightSection={<IconChevronDown size="1rem" />} style={{ flex: 1, maxWidth: '200px' }}>
                                        Filter: {statusFilterOptions.find(opt => opt.value === statusFilter)?.label || 'All'}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Filter by status</Menu.Label>
                                    {statusFilterOptions.map(opt => (
                                        <Menu.Item key={opt.value} onClick={() => { setStatusFilter(opt.value); setCurrentPage(1); }}>
                                            {opt.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                        </Group>

                    </Grid.Col>
                </Grid>

                <Box style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover withTableBorder verticalSpacing="sm" miw={800}>
                        <Table.Thead>
                            <Table.Tr>
                                {!showId && <Table.Th onClick={() => handleSort('showName')} style={{ cursor: 'pointer' }}>Show {sortField === 'showName' && (sortDirection === 'asc' ? '↑' : '↓')}</Table.Th>}
                                <Table.Th onClick={() => handleSort('performanceDate')} style={{ cursor: 'pointer' }}>Date {sortField === 'performanceDate' && (sortDirection === 'asc' ? '↑' : '↓')}</Table.Th>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Seating</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {paginatedPerformances.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={showId ? 6 : 7}><Text ta="center" c="dimmed" py="lg">No performances match your criteria.</Text></Table.Td>
                                </Table.Tr>
                            ) : (
                                paginatedPerformances.map((p) => {
                                    const status = getStatusBadge(p);
                                    return (
                                        <Table.Tr key={p.performanceId}>
                                            {!showId && <Table.Td fw={500}>{p.showName || 'N/A'}</Table.Td>}
                                            <Table.Td>{dayjs(p.performanceDate).format('DD MMM YYYY')}</Table.Td>
                                            <Table.Td>{formatTimeRange(p.startTime, p.endTime)}</Table.Td>
                                            <Table.Td>{p.seatingType === SeatingType.NUMBER_0 ? 'General Admission' : 'Reserved Seating'}</Table.Td>
                                            <Table.Td><Badge color={status.color} variant="light" size="sm">{status.text}</Badge></Table.Td>
                                            <Table.Td>
                                                <Group gap="xs" wrap="nowrap">
                                                    <Tooltip label="View Details"><ActionIcon variant="subtle" color="blue" onClick={() => handleViewDetails(p)}><IconEye size="1.1rem" /></ActionIcon></Tooltip>
                                                    <Tooltip label="Edit"><ActionIcon variant="subtle" color="green" onClick={() => handleEdit(p)}><IconEdit size="1.1rem" /></ActionIcon></Tooltip>
                                                    <Tooltip label="Cancel"><ActionIcon variant="subtle" color="red" onClick={() => handleDelete(p)}><IconCancel size="1.1rem" /></ActionIcon></Tooltip>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                }))}
                        </Table.Tbody>
                    </Table>
                </Box>

                {filteredPerformances.length > itemsPerPage && (
                    <Flex justify="center" mt="xl">
                        <Pagination total={Math.ceil(filteredPerformances.length / itemsPerPage)} value={currentPage} onChange={setCurrentPage} color="pink.8" radius="md" withEdges />
                    </Flex>
                )}
                {filteredPerformances.length > 0 && (
                    <Text size="sm" c="dimmed" ta="center" mt="md">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPerformances.length)} of {filteredPerformances.length} performances
                    </Text>
                )}
            </Card>

            <Modal opened={createModalOpened} onClose={closeCreateModal} title="Add New Performance" size="xl" centered overlayProps={{ blur: 3 }}>
                <PerformanceForm onClose={closeCreateModal} isCreate={true} showId={showId} />
            </Modal>
            <Modal opened={editModalOpened} onClose={closeEditModal} title="Edit Performance" size="xl" centered overlayProps={{ blur: 3 }}>
                <PerformanceForm performance={selectedPerformanceForEdit} onClose={closeEditModal} isCreate={false} showId={showId || selectedPerformanceForEdit?.showId} />
            </Modal>
            <Modal opened={detailsModalOpened} onClose={closeDetailsModal} title="Performance Details" size="lg" centered overlayProps={{ blur: 3 }}>
                <PerformanceDetails performanceId={selectedPerformanceIdForDetails} />
            </Modal>
            <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirm Performance Cancellation" centered size="sm" overlayProps={{blur: 3}}>
                <Stack>
                    <Text>
                        Are you sure you want to cancel the performance
                        {performanceToDelete?.showName && ` for "${performanceToDelete.showName}"`}
                        {performanceToDelete?.performanceDate && ` on ${dayjs(performanceToDelete.performanceDate).format('DD MMM YYYY')}`}?
                        <Space h="sm" />
                        Cancelling a performance, cancels all the tickets associated to it.
                        <Space h="sm" />
                        <Text fw={700}>Note:</Text> If the performance does not have an existing ticket sale, it will be deleted.
                    </Text>
                    <Group justify="flex-end" mt="lg">
                        <Button variant="default" onClick={closeDeleteModal} disabled={deleteMutation.isPending}>Cancel</Button>
                        <Button color="red" onClick={confirmDelete} loading={deleteMutation.isPending}>Delete</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}