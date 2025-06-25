'use client';

import {
  Table, Card, Group, Text, Badge, ScrollArea, Tooltip,
  ActionIcon, TextInput, Box, Flex, Pagination, Paper, Center, RingProgress, SimpleGrid,
} from '@mantine/core';
import {
  IconEdit, IconEye, IconTrash, IconSearch, IconCheck, IconX, IconTicket,
} from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { Ticket } from '@/services/ticketService';

interface Props {
  groupedData: Ticket[];
  onView: (bookingRef: string) => void;
  onEdit: (bookingRef: string) => void;
  onDelete: (bookingRef: string) => void;
}

export default function GroupedTicketsTable({
  groupedData,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase();
    return groupedData.filter((ticket) =>
      ticket.qrInCode?.toLowerCase().includes(searchText) ||
      ticket.showName?.toLowerCase().includes(searchText) ||
      ticket.venueName?.toLowerCase().includes(searchText) ||
      ticket.userName?.toLowerCase().includes(searchText)
    );
  }, [search, groupedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalTickets = groupedData.length;
  const checkedIn = groupedData.filter(t => t.isCheckedIn).length;
  const cancelled = groupedData.filter(t => t.cancelled).length;
  const checkedInPercent = totalTickets ? Math.round((checkedIn / totalTickets) * 100) : 0;

  const StatCard = ({ title, value, color, icon, percent }: {
    title: string;
    value: string;
    color: string;
    icon: React.ReactNode;
    percent?: number;
  }) => (
    <Paper withBorder p="md" radius="md">
      <Group>
        <Center>
          {percent !== undefined ? (
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[{ value: percent, color }]}
              label={<Center>{icon}</Center>}
            />
          ) : (
            <Box style={{ color }} p="md">{icon}</Box>
          )}
        </Center>
        <Box>
          <Text c="dimmed" size="xs" fw={700}>{title}</Text>
          <Text fw={700} size="xl">{value}</Text>
          {percent !== undefined && (
            <Text size="xs" c="dimmed">{percent}% of total</Text>
          )}
        </Box>
      </Group>
    </Paper>
  );

  const rows = paginatedData.map((ticket) => (
    <Table.Tr key={ticket.qrInCode}>
      <Table.Td>{ticket.qrInCode}</Table.Td>
      <Table.Td>{ticket.showName}</Table.Td>
      <Table.Td>{ticket.venueName}</Table.Td>
      <Table.Td>{ticket.userName}</Table.Td>
      <Table.Td>
        <Badge color={ticket.cancelled ? 'red' : ticket.isCheckedIn ? 'green' : 'yellow'}>
          {ticket.cancelled ? 'Cancelled' : ticket.isCheckedIn ? 'Checked-In' : 'Pending'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip label="View Tickets">
            <ActionIcon onClick={() => onView(ticket.qrInCode)} variant="default">
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Status">
            <ActionIcon onClick={() => onEdit(ticket.qrInCode)} variant="light" color="blue">
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Booking">
            <ActionIcon onClick={() => onDelete(ticket.qrInCode)} variant="light" color="red">
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card withBorder shadow="sm" radius="md" mt="md">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
        <StatCard title="Total Tickets" value={totalTickets.toString()} color="blue" icon={<IconTicket size={28} />} />
        <StatCard title="Checked-In Tickets" value={checkedIn.toString()} color="green" icon={<IconCheck size={28} />} percent={checkedInPercent} />
        <StatCard title="Cancelled Tickets" value={cancelled.toString()} color="red" icon={<IconX size={28} />} />
      </SimpleGrid>

      <TextInput
        placeholder="Search by booking reference, show, venue or user"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value);
          setCurrentPage(1);
        }}
        mb="sm"
      />
      <ScrollArea>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Booking Ref</Table.Th>
              <Table.Th>Show</Table.Th>
              <Table.Th>Venue</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed">No tickets found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {filteredData.length > itemsPerPage && (
        <Flex justify="center" mt="lg">
          <Pagination
            total={Math.ceil(filteredData.length / itemsPerPage)}
            value={currentPage}
            onChange={setCurrentPage}
            color="pink.8"
            radius="md"
            withEdges
          />
        </Flex>
      )}
      {filteredData.length > 0 && (
        <Text size="sm" c="dimmed" ta="center" mt="md">
          Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} tickets
        </Text>
      )}
    </Card>
  );
}
