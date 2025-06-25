'use client';

import {
  Box,
  Title,
  Paper,
  Group,
  Button,
  SimpleGrid,
  Skeleton,
  Center,
  Text,
  Alert,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconTicket,
  IconListDetails,
  IconPlus,
  IconRefresh,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from '@/services/ticketTypeService';
import { TicketType } from '@/types/api/TicketType';
import TicketTypesTable from './components/TicketTypesTable';
import TicketTypeForm from './components/TicketTypeForm';
import DeleteModal from './components/DeleteModal';
import { notifications } from '@mantine/notifications';

export default function Page() {
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editData, setEditData] = useState<TicketType | null>(null);
  const [deleteData, setDeleteData] = useState<TicketType | null>(null);
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['ticketTypes'],
    queryFn: fetchTicketTypes,
  });

  const mutationSave = useMutation({
    mutationFn: (form: { values: Omit<TicketType, 'ticketTypeId'>; id?: number }) =>
      form.id !== undefined
        ? updateTicketType(form.id, form.values)
        : createTicketType(form.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketTypes'] });
      closeForm();
      notifications.show({
        title: 'Success',
        message: editData
          ? 'Ticket Type updated successfully'
          : 'Ticket Type created successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: editData ? 'Update Failed' : 'Create Failed',
        message: error.message || `Failed to ${editData ? 'update' : 'create'} ticket type`,
        color: 'red',
      });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteTicketType(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['ticketTypes'] });
      const previousTicketTypes = queryClient.getQueryData(['ticketTypes']);
      queryClient.setQueryData(['ticketTypes'], (old: TicketType[] = []) =>
        old.filter((item) => item.ticketTypeId !== deletedId)
      );
      closeDelete();
      setDeleteData(null);
      return { previousTicketTypes };
    },
    onError: (error, _, context) => {
      if (context?.previousTicketTypes) {
        queryClient.setQueryData(['ticketTypes'], context.previousTicketTypes);
      }
      notifications.show({
        title: 'Delete Failed',
        message: error.message || 'Failed to delete ticket type',
        color: 'red',
      });
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Ticket type deleted successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['ticketTypes'] });
    },
  });

  const handleDeleteClick = (item: TicketType) => {
    setDeleteData(item);
    openDelete();
  };

  const handleDeleteConfirm = () => {
    if (deleteData) {
      mutationDelete.mutate(deleteData.ticketTypeId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteData(null);
    closeDelete();
  };

  const total = data.length;
  const withDescription = data.filter((t) => t.description).length;

  const handleRefresh = () => queryClient.invalidateQueries({ queryKey: ['ticketTypes'] });

  const handleAddClick = () => {
    setEditData(null);
    openForm();
  };

  const handleEditClick = (item: TicketType) => {
    setEditData(item);
    openForm();
  };

  return (
    <Box p="xs">
      <Paper withBorder p="md" radius="md" mb="md">
        <Group justify="space-between" mb="md">
          <Title order={2}>Ticket Type Dashboard</Title>
          <Group>
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={handleRefresh}
              variant="subtle"
            >
              Refresh
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={handleAddClick}>
              Add Ticket Type
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <Skeleton key={i} height={100} radius="md" />)
          ) : (
            <>
              <StatCard
                icon={<IconTicket size={28} />}
                title="Total Types"
                value={total.toString()}
                color="blue"
              />
              <StatCard
                icon={<IconListDetails size={28} />}
                title="With Descriptions"
                value={withDescription.toString()}
                color="green"
              />
              <StatCard
                icon={<IconAlertCircle size={28} />}
                title="No Descriptions"
                value={(total - withDescription).toString()}
                color="orange"
              />
            </>
          )}
        </SimpleGrid>
      </Paper>

      {error && (
        <Alert color="red" icon={<IconAlertCircle />}>
          {(error as Error).message || 'Failed to load ticket types'}
        </Alert>
      )}

      <TicketTypesTable data={data} onEdit={handleEditClick} onDelete={handleDeleteClick} />

      <TicketTypeForm
        opened={formOpened}
        onClose={closeForm}
        initialValues={
          editData
            ? {
                typeName: editData.typeName,
                description: editData.description || '',
              }
            : undefined
        }
        onSubmit={(values) =>
          mutationSave.mutate({
            values,
            id: editData?.ticketTypeId,
          })
        }
      />

      <DeleteModal
        opened={deleteOpened}
        onClose={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        title="Delete Ticket Type"
        itemName={deleteData?.typeName || ''}
        isDeleting={mutationDelete.isPending}
      />
    </Box>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group>
        <Center p="sm" style={{ color }}>{icon}</Center>
        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
}
