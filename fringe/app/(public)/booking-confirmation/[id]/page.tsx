"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Box,
  Button,
  Paper,
  Grid,
  Stack,
  Group,
  Divider,
  Badge,
  useMantineTheme,
  Loader,
  Alert,
  ThemeIcon,
  Image
} from "@mantine/core";
import { 
  IconCalendar, 
  IconClock, 
  IconTicket, 
  IconMail,
  IconHome,
  IconCheck,
  IconMapPin,
  IconDownload,
  IconPrinter,
  IconQrcode,
} from '@tabler/icons-react';

import HeaderSection from "@/app/(public)/(home)/components/HeaderSection";

// Updated types to match your API response
type ReservedSeat = {
  reservedSeatId: number;
  rowNumber: number;
  seatNumber: number;
  ticketId: number;
  seatingPlanId: number;
};

type TicketDetails = {
  ticketId: number;
  performanceId: number;
  showName: string;
  venueName: string;
  userId: string;
  userEmail: string;
  userName: string;
  qrImageUrl: string;
  qrInCode: string;
  startTime: string;
  endTime: string;
  performanceDate: string;
  isCheckedIn: boolean;
  cancelled: boolean;
  createdAt: string;
  updatedAt: string | null;
  reservedSeats: ReservedSeat[];
  price: number;
  ticketTypeName: string;
};

type BookingResponse = {
  bookingReference: string;
  tickets: TicketDetails[];
};

export default function BookingConfirmationPage() {
  const theme = useMantineTheme();
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Booking/confirmation/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking:", error);
      // Redirect to home if booking not found
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Updated download function for all tickets with single QR code
  const downloadAllTickets = () => {
    if (!booking) return;

    // Create a new window for printing/downloading
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const ticketsHtml = booking.tickets.map((ticket, index) => `
      <div class="ticket" style="page-break-after: ${index < booking.tickets.length - 1 ? 'always' : 'auto'};">
        <div class="ticket-header">
          <h2>${ticket.showName}</h2>
          <div class="ticket-badge">Ticket ${index + 1}</div>
        </div>
        
        <div class="ticket-details">
          <div class="detail-row">
            <div class="detail-item">
              <strong>Date:</strong> ${formatDate(ticket.performanceDate)}
            </div>
            <div class="detail-item">
              <strong>Time:</strong> ${formatTime(ticket.startTime)} - ${formatTime(ticket.endTime)}
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-item">
              <strong>Venue:</strong> ${ticket.venueName}
            </div>
            <div class="detail-item">
              <strong>Seat:</strong> ${ticket.reservedSeats.length > 0 
                ? `Row ${ticket.reservedSeats[0].rowNumber}, Seat ${ticket.reservedSeats[0].seatNumber}`
                : 'General Admission'
              }
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-item">
              <strong>Ticket ID:</strong> #${ticket.ticketId}
            </div>
            ${ticket.ticketTypeName ? `
              <div class="detail-item">
                <strong>Type:</strong> ${ticket.ticketTypeName}
              </div>
            ` : ''}
            ${ticket.price > 0 ? `
              <div class="detail-item">
                <strong>Price:</strong> $${ticket.price.toFixed(2)}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tickets - ${booking.bookingReference}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 20px;
            }
            
            .booking-header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              border: 2px solid #7c3aed;
              border-radius: 8px;
            }
            
            .qr-container { 
              text-align: center; 
              margin: 20px 0;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            
            .qr-code { 
              max-width: 200px; 
              border: 1px solid #ddd;
            }
            
            .booking-ref {
              font-size: 24px;
              font-weight: bold;
              color: #7c3aed;
              margin-bottom: 10px;
            }
            
            .ticket { 
              border: 2px solid #000; 
              padding: 20px; 
              margin: 20px 0;
              border-radius: 8px;
            }
            
            .ticket-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            
            .ticket-badge {
              background: #7c3aed;
              color: white;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
            }
            
            .ticket-details {
              margin-top: 15px;
            }
            
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            
            .detail-item {
              flex: 1;
              margin-right: 15px;
            }
            
            .detail-item:last-child {
              margin-right: 0;
            }
            
            @media print {
              body { margin: 0; }
              .booking-header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="booking-header">
            <div class="booking-ref">Booking Reference: ${booking.bookingReference}</div>
            <div>Customer: ${firstTicket.userName || 'N/A'}</div>
            <div>Total: $${totalAmount.toFixed(2)} (${booking.tickets.length} ticket${booking.tickets.length !== 1 ? 's' : ''})</div>
            
            <div class="qr-container">
              <h3>Booking QR Code</h3>
              <p>Show this code at the venue</p>
              <img src="${firstTicket.qrImageUrl}" alt="Booking QR Code" class="qr-code" />
              <p><strong>${firstTicket.qrInCode}</strong></p>
            </div>
          </div>
          
          ${ticketsHtml}
          
          <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <h4>Important Information:</h4>
            <ul>
              <li>Please bring your printed tickets or show the QR code on your mobile device at the venue</li>
              <li>One QR code is valid for all tickets in this booking</li>
              <li>Arrive at least 30 minutes before the show starts</li>
              <li>These tickets are non-transferable and valid only for the specified date and time</li>
            </ul>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const printAllTickets = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <HeaderSection />
        <Container>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "100px 0",
            }}
          >
            <Loader color="pink" size="xl" />
          </Box>
        </Container>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <HeaderSection />
        <Container>
          <Title order={2}>Booking not found</Title>
          <Button component={Link} href="/" mt="md">
            Back to Home
          </Button>
        </Container>
      </>
    );
  }

  // Get first ticket for customer info (all tickets have same user)
  const firstTicket = booking.tickets[0];

  // Calculate total amount from all tickets
  const totalAmount = booking.tickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0);

  return (
    <Box bg="white">
      <HeaderSection />

      <Container size="lg" pt="xl" pb="xl">
        {/* Success Alert */}
        <Alert
          icon={<IconCheck size={16} />}
          title="Booking Confirmed!"
          color="green"
          mb="xl"
          styles={{
            root: { backgroundColor: theme.colors.green[0] },
            title: { fontWeight: 700 }
          }}
        >
          Your booking has been successfully confirmed. {firstTicket.userEmail && `A confirmation email has been sent to ${firstTicket.userEmail}`}
        </Alert>

        {/* Booking Header with QR Code */}
        <Paper p="lg" radius="md" withBorder mb="xl">
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group justify="space-between" mb="md">
                <Box>
                  <Text size="sm" c="dimmed">Booking Reference</Text>
                  <Title order={2}>{booking.bookingReference}</Title>
                </Box>
                <Box ta="right">
                  <Text size="sm" c="dimmed">Booking Status</Text>
                  <Badge color="green" size="lg">Confirmed</Badge>
                </Box>
              </Group>

              <Group justify="space-between">
                <Box>
                  <Text size="sm" c="dimmed">Customer</Text>
                  <Text fw={500}>{firstTicket.userName || 'N/A'}</Text>
                  <Text size="sm" c="dimmed">{firstTicket.userEmail || 'N/A'}</Text>
                </Box>
                <Box ta="right">
                  <Text size="sm" c="dimmed">Total Amount</Text>
                  <Text size="xl" fw={700} c="purple">${totalAmount.toFixed(2)}</Text>
                  <Text size="sm" c="dimmed">{booking.tickets.length} ticket{booking.tickets.length !== 1 ? 's' : ''}</Text>
                </Box>
              </Group>
            </Grid.Col>

            {/* Single QR Code for all tickets */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Box 
                p="md" 
                style={{ 
                  backgroundColor: theme.colors.gray[0],
                  borderRadius: theme.radius.md,
                  textAlign: 'center',
                  height: 'fit-content'
                }}
              >
                <Text size="lg" fw={600} mb="sm" c="purple">Booking QR Code</Text>
                <Text size="xs" c="dimmed" mb="sm">Show this code at the venue</Text>
                <Box 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: theme.radius.sm,
                    marginBottom: '0.5rem'
                  }}
                >
                  <Image 
                    src={firstTicket.qrImageUrl}
                    alt="Booking QR Code"
                    width={180}
                    height={180}
                  />
                </Box>
                <Text size="xs" c="dimmed" fw={500}>{firstTicket.qrInCode}</Text>
              </Box>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Tickets List - Updated without individual QR codes */}
        <Title order={3} mb="md">Your Tickets ({booking.tickets.length})</Title>
        
        <Stack gap="lg">
          {booking.tickets.map((ticket, index) => (
            <Paper key={ticket.ticketId} p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="sm">
                <Badge size="lg" color="purple">Ticket {index + 1}</Badge>
                <Group>
                  {ticket.cancelled ? (
                    <Badge color="red">Cancelled</Badge>
                  ) : (
                    <Badge color="green">Active</Badge>
                  )}
                  {ticket.isCheckedIn && (
                    <Badge color="blue">Checked In</Badge>
                  )}
                </Group>
              </Group>

              <Title order={4} mb="md">{ticket.showName}</Title>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Group gap="xs">
                    <ThemeIcon size="sm" color="gray" variant="light">
                      <IconCalendar size={14} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" c="dimmed">Date</Text>
                      <Text size="sm" fw={500}>{formatDate(ticket.performanceDate)}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Group gap="xs">
                    <ThemeIcon size="sm" color="gray" variant="light">
                      <IconClock size={14} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" c="dimmed">Time</Text>
                      <Text size="sm" fw={500}>
                        {formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}
                      </Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Group gap="xs">
                    <ThemeIcon size="sm" color="gray" variant="light">
                      <IconMapPin size={14} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" c="dimmed">Venue</Text>
                      <Text size="sm" fw={500}>{ticket.venueName}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Group gap="xs">
                    <ThemeIcon size="sm" color="gray" variant="light">
                      <IconTicket size={14} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" c="dimmed">Seat</Text>
                      <Text size="sm" fw={500}>
                        {ticket.reservedSeats.length > 0 
                          ? `Row ${ticket.reservedSeats[0].rowNumber}, Seat ${ticket.reservedSeats[0].seatNumber}`
                          : 'General Admission'
                        }
                      </Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>

              <Divider my="md" />

              <Grid>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="xs" c="dimmed">Ticket ID</Text>
                  <Text fw={500}>#{ticket.ticketId}</Text>
                </Grid.Col>
                {ticket.ticketTypeName && (
                  <Grid.Col span={{ base: 6, sm: 4 }}>
                    <Text size="xs" c="dimmed">Ticket Type</Text>
                    <Text fw={500}>{ticket.ticketTypeName}</Text>
                  </Grid.Col>
                )}
                {ticket.price > 0 && (
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Text size="xs" c="dimmed">Price</Text>
                    <Text fw={500}>${ticket.price.toFixed(2)}</Text>
                  </Grid.Col>
                )}
              </Grid>
            </Paper>
          ))}
        </Stack>

        {/* Updated Action Buttons */}
        <Paper p="lg" radius="md" withBorder mt="xl">
          <Group justify="center" gap="md">
            <Button
              leftSection={<IconPrinter size={20} />}
              onClick={printAllTickets}
              variant="outline"
            >
              Print All Tickets
            </Button>
            <Button
              leftSection={<IconDownload size={20} />}
              onClick={() => downloadAllTickets()}
              variant="outline"
            >
              Download All Tickets
            </Button>
            <Button
              leftSection={<IconMail size={20} />}
              variant="outline"
            >
              Email Tickets
            </Button>
            <Button
              component={Link}
              href="/"
              leftSection={<IconHome size={20} />}
              color="purple"
            >
              Back to Home
            </Button>
          </Group>
        </Paper>

        {/* Updated Important Information */}
        <Alert
          icon={<IconQrcode size={16} />}
          title="Important Information"
          color="blue"
          mt="xl"
        >
          <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
            <li>Please bring your printed tickets or show the QR code on your mobile device at the venue</li>
            <li>One QR code is valid for all tickets in this booking</li>
            <li>Arrive at least 30 minutes before the show starts</li>
            <li>These tickets are non-transferable and valid only for the specified date and time</li>
            {firstTicket.userEmail && <li>For any queries, contact support</li>}
          </ul>
        </Alert>
      </Container>

      {/* Updated Print Styles */}
      <style jsx global>{`
        @media print {
          .mantine-AppShell-header,
          .mantine-AppShell-footer,
          .mantine-Button-root {
            display: none !important;
          }
          
          .mantine-Paper-root {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          
          /* Ensure QR code prints clearly */
          .qr-code-container {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </Box>
  );
}