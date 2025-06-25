'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Group,
  Title,
  LoadingOverlay,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGroupedTickets,
  bulkDeleteTicketsByBookingRef,
  bulkUpdateTicketsByBookingRef,
  getTicketsByBookingRef,
  Ticket
} from '@/services/ticketService';
import GroupedTicketsTable from './components/GroupedTicketsTable';
import TicketDetailsModal from './components/TicketsDetailModal';
import TicketStatusEditModal from './components/TicketStatusEditModal';
import { notifications } from '@mantine/notifications';

export default function TicketManagementPage() {
  const queryClient = useQueryClient();

  const [viewBookingRef, setViewBookingRef] = useState<string | null>(null);
  const [editBookingRef, setEditBookingRef] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    data: groupedData = [],
    refetch,
  } = useQuery({
    queryKey: ['groupedTickets'],
    queryFn: getGroupedTickets,
  });

  const {
    mutate: deleteBooking,
    isPending: isDeleting
  } = useMutation({
    mutationFn: (bookingRef: string) => bulkDeleteTicketsByBookingRef(bookingRef),
    onSuccess: () => {
      notifications.show({
        title: 'Deleted',
        message: 'Tickets deleted successfully.',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['groupedTickets'] });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete tickets.',
        color: 'red',
      });
    },
  });

  const {
    mutate: updateTickets,
    isPending: isUpdating
  } = useMutation({
    mutationFn: (data: { bookingRef: string, update: { isCheckedIn: boolean, cancelled: boolean } }) =>
      bulkUpdateTicketsByBookingRef(data.bookingRef, data.update),
    onSuccess: () => {
      notifications.show({
        title: 'Updated',
        message: 'Ticket status updated successfully.',
        color: 'blue',
      });
      setEditBookingRef(null);
      queryClient.invalidateQueries({ queryKey: ['groupedTickets'] });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to update ticket status.',
        color: 'red',
      });
    },
  });

  const handleView = async (bookingRef: string) => {
    setLoading(true);
    try {
      const tickets = await getTicketsByBookingRef(bookingRef);
      setSelectedTickets(tickets);
      setViewBookingRef(bookingRef);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Unable to fetch ticket details.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (bookingRef: string) => {
    setLoading(true);
    try {
      const tickets = await getTicketsByBookingRef(bookingRef);
      setSelectedTickets(tickets);
      setEditBookingRef(bookingRef);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Unable to fetch tickets for editing.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (bookingRef: string) => {
    deleteBooking(bookingRef);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Box p="md">
      <LoadingOverlay visible={loading || isDeleting || isUpdating} zIndex={1000} />
      <Group justify="space-between" mb="md">
        <Title order={2}>Ticket Management</Title>
        <Button
          leftSection={<IconRefresh size="1rem" />}
          variant="outline"
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Group>

      <GroupedTicketsTable
        groupedData={groupedData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TicketDetailsModal
        opened={!!viewBookingRef}
        onClose={() => setViewBookingRef(null)}
        bookingRef={viewBookingRef || ''}
        tickets={selectedTickets}
      />

      <TicketStatusEditModal
        opened={!!editBookingRef}
        onClose={() => setEditBookingRef(null)}
        bookingRef={editBookingRef || ''}
        currentIsCheckedIn={selectedTickets.some(t => t.isCheckedIn)}
        currentCancelled={selectedTickets.some(t => t.cancelled)}
        onSubmit={(data) => {
          if (!editBookingRef) return;
          updateTickets({ bookingRef: editBookingRef, update: data });
        }}
      />
    </Box>
  );
}
