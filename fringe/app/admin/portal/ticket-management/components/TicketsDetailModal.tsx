'use client';

import {
  Modal,
  Paper,
  Stack,
  Title,
  SimpleGrid,
  Text,
  Badge,
  Image,
  Divider,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Ticket } from '@/services/ticketService';

interface Props {
  opened: boolean;
  onClose: () => void;
  bookingRef: string;
  tickets: Ticket[];
}

const formatTime = (time: any): string => {
  if (!time) return 'N/A';
  if (typeof time === 'string') {
    return time.length === 8 ? time : '00:00:00';
  }
  const { hours = 0, minutes = 0, seconds = 0 } = time;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatPrice = (price: number | undefined): string => {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
};

export default function TicketDetailsModal({
  opened,
  onClose,
  bookingRef,
  tickets,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Tickets for Booking Ref: ${bookingRef}`}
      size="xl"
      centered
      overlayProps={{ blur: 3 }}
    >
      <Stack>
        {tickets.length === 0 ? (
          <Text>No tickets found for this booking reference.</Text>
        ) : (
          tickets.map((ticket) => (
            <Paper key={ticket.ticketId} p="md" withBorder radius="md" shadow="sm">
              <Title order={5} mb="xs">
                Ticket #{ticket.ticketId}
              </Title>

              <SimpleGrid cols={2} spacing="sm">
                <Text><strong>Show:</strong> {ticket.showName}</Text>
                <Text><strong>Venue:</strong> {ticket.venueName}</Text>
                <Text><strong>User:</strong> {ticket.userName}</Text>
                <Text><strong>Email:</strong> {ticket.userEmail}</Text>
                <Text><strong>Price:</strong> {formatPrice(ticket.price)}</Text>
                <Text>
                  <strong>Date:</strong> {new Date(ticket.performanceDate).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Time:</strong> {formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}
                </Text>
                <Text><strong>QR Code:</strong> {ticket.qrInCode}</Text>
                <Text>
                  <strong>Status:</strong>{' '}
                  {ticket.cancelled ? (
                    <Badge color="red" leftSection={<IconX size={12} />}>Cancelled</Badge>
                  ) : ticket.isCheckedIn ? (
                    <Badge color="green" leftSection={<IconCheck size={12} />}>Checked-In</Badge>
                  ) : (
                    <Badge color="gray">Pending</Badge>
                  )}
                </Text>
              </SimpleGrid>

              {/* Reserved Seats Display */}
              <Text mt="md">
                <strong>Reserved Seats:</strong>{' '}
                {ticket.reservedSeats && ticket.reservedSeats.length > 0
                  ? ticket.reservedSeats.map(
                      (seat) => `Row ${seat.rowNumber}, Seat ${seat.seatNumber}`
                    ).join(' | ')
                  : 'None'}
              </Text>

              {ticket.qrImageUrl && (
                <Image
                  src={ticket.qrImageUrl}
                  alt={`QR for Ticket ${ticket.ticketId}`}
                  width={100}
                  mt="sm"
                />
              )}

              <Divider my="md" />
            </Paper>
          ))
        )}
      </Stack>
    </Modal>
  );
}
