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
  Loader,
  Image,
  Paper,
  Badge,
  Divider,
  Group,
  Grid,
  useMantineTheme,
  Modal,
  Card,
  Stack,
  SimpleGrid,
  ActionIcon,
  NumberInput,
  ScrollArea,
  Flex,
} from "@mantine/core";
import { 
  IconCalendar, 
  IconClock, 
  IconUser, 
  IconMapPin, 
  IconArrowLeft,
  IconTicket,
  IconMinus,
  IconPlus,
  IconArmchair,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import HeaderSection from "@/app/(public)/(home)/components/HeaderSection";
import NewsletterSection from "@/app/(public)/(home)/components/NewsletterSection";
import AboutSection from "@/app/(public)/(home)/components/AboutSection";
import ContactSection from "@/app/(public)/(home)/components/ContactSection";

// Type matching your ShowDto
type Show = {
  showId: number;
  showName: string;
  venueId: number;
  venueName: string;
  showTypeId: number;
  showType: string;
  description: string;
  ageRestrictionId: number;
  ageRestrictionCode: string;
  warningDescription: string;
  startDate: string;
  endDate: string;
  ticketTypeId: number | null;
  ticketTypeName: string;
  imagesUrl: string;
  videosUrl: string;
  active: boolean;
};

// Type for Performance
type Performance = {
  performanceId: number;
  showId: number;
  showName: string;
  performanceDate: string;
  startTime: string;
  endTime: string;
  soldOut: boolean;
  cancel: boolean;
  active: boolean;
  seatingType: number;
  seatingPlan: {
    seatingPlanId: number;
    venueId: number;
    rows: number;
    seatsPerRow: number;
  };
  remainingSeats: number;
  reservedSeats: ReservedSeat[];
  ticketPrices: TicketPrice[];
};

type ReservedSeat = {
  reservedSeatId: number;
  rowNumber: number;
  seatNumber: number;
};

type TicketPrice = {
  ticketPriceId: number;
  ticketTypeName: string;
  price: number;
};

type SelectedTickets = {
  [ticketTypeId: number]: {
    ticketTypeName: string;
    price: number;
    quantity: number;
  };
};

type SelectedSeats = {
  rowNumber: number;
  seatNumber: number;
}[];

// Enum for SeatingType
enum SeatingType {
  GeneralAdmission = 0,
  CustomisedSeating = 1,
}

export default function ShowPage() {
  const theme = useMantineTheme();
  const params = useParams();
  const router = useRouter();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loadingPerformances, setLoadingPerformances] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({});
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeats>([]);
  const [bookingModalOpened, { open: openBookingModal, close: closeBookingModal }] = useDisclosure(false);
  const [ticketModalOpened, { open: openTicketModal, close: closeTicketModal }] = useDisclosure(false);
  const [seatModalOpened, { open: openSeatModal, close: closeSeatModal }] = useDisclosure(false);
  
  const eventImages = [
    "/images/home/im.jpeg",
    "/images/home/imm.jpeg",
    "/images/home/immm.jpg",
    "/images/home/immmm.jpeg",
  ];

  useEffect(() => {
    if (params.id) {
      // Fetch the show data
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Shows/${params.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch show details");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Show data:", data);
          setShow(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const fetchPerformances = async () => {
    setLoadingPerformances(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Performances/show/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch performances");
      }
      const data = await response.json();
      setPerformances(data);
    } catch (error) {
      console.error("Error fetching performances:", error);
    } finally {
      setLoadingPerformances(false);
    }
  };

  const handleBookTickets = () => {
    openBookingModal();
    fetchPerformances();
  };

  const handleSelectPerformance = (performance: Performance) => {
    setSelectedPerformance(performance);
    closeBookingModal();
    openTicketModal();
  };

  const updateTicketQuantity = (ticketPriceId: number, ticketTypeName: string, price: number, quantity: number) => {
    if (quantity === 0) {
      const newTickets = { ...selectedTickets };
      delete newTickets[ticketPriceId];
      setSelectedTickets(newTickets);
    } else {
      setSelectedTickets({
        ...selectedTickets,
        [ticketPriceId]: {
          ticketTypeName,
          price,
          quantity
        }
      });
    }
  };

  const getTotalAmount = () => {
    return Object.values(selectedTickets).reduce((total, ticket) => {
      return total + (ticket.price * ticket.quantity);
    }, 0).toFixed(2);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, ticket) => {
      return total + ticket.quantity;
    }, 0);
  };

  const handleProceedFromTickets = () => {
    if (!selectedPerformance || getTotalTickets() === 0) return;

    // If it's general admission, go directly to checkout
    if (selectedPerformance.seatingType === SeatingType.GeneralAdmission) {
      const bookingData = {
        performanceId: selectedPerformance.performanceId,
        showId: selectedPerformance.showId,
        showName: selectedPerformance.showName,
        performanceDate: selectedPerformance.performanceDate,
        startTime: selectedPerformance.startTime,
        tickets: selectedTickets,
        totalAmount: getTotalAmount(),
        totalTickets: getTotalTickets(),
        seatingType: selectedPerformance.seatingType,
        selectedSeats: null // No seats for general admission
      };
      
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      router.push(`/checkout/${selectedPerformance.performanceId}`);
    } else {
      // If it's customized seating, show seat selection
      closeTicketModal();
      openSeatModal();
    }
  };

  const isSelectedSeat = (row: number, seat: number) => {
    return selectedSeats.some(s => s.rowNumber === row && s.seatNumber === seat);
  };

  const isReservedSeat = (row: number, seat: number) => {
    if (!selectedPerformance) return false;
    return selectedPerformance.reservedSeats.some(s => s.rowNumber === row && s.seatNumber === seat);
  };

  const toggleSeat = (row: number, seat: number) => {
    if (isReservedSeat(row, seat)) return;

    const existingSeatIndex = selectedSeats.findIndex(s => s.rowNumber === row && s.seatNumber === seat);
    
    if (existingSeatIndex > -1) {
      // Unselect the seat
      const newSeats = [...selectedSeats];
      newSeats.splice(existingSeatIndex, 1);
      setSelectedSeats(newSeats);
    } else {
      // Check if we've reached the total ticket count
      if (selectedSeats.length < getTotalTickets()) {
        setSelectedSeats([...selectedSeats, { rowNumber: row, seatNumber: seat }]);
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedPerformance || !selectedSeats.length) return;

    const bookingData = {
      performanceId: selectedPerformance.performanceId,
      showId: selectedPerformance.showId,
      showName: selectedPerformance.showName,
      performanceDate: selectedPerformance.performanceDate,
      startTime: selectedPerformance.startTime,
      tickets: selectedTickets,
      totalAmount: getTotalAmount(),
      totalTickets: getTotalTickets(),
      seatingType: selectedPerformance.seatingType,
      selectedSeats: selectedSeats
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push(`/checkout/${selectedPerformance.performanceId}`);
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate total duration in minutes
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.round((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const formatPerformanceDate = (dateString: string) => {
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

  const getSeatingTypeLabel = (seatingType: number) => {
    return seatingType === SeatingType.GeneralAdmission 
      ? 'General Admission' 
      : 'Reserved Seating';
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

  if (!show) {
    return (
      <>
        <HeaderSection />
        <Container>
          <Title order={2}>Show not found</Title>
          <Button component={Link} href="/" mt="md">
            Back to Home
          </Button>
        </Container>
      </>
    );
  }

  // Format dates for display
  const startDate = new Date(show.startDate);
  const endDate = new Date(show.endDate);
  const formattedStartDate = startDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedEndDate = endDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  
  return (
    <Box bg="white">
      <HeaderSection />

      {/* Performance Selection Modal */}
      <Modal
          opened={bookingModalOpened}
          onClose={closeBookingModal}
          title={
            <div>
              <Title order={3}>{show.showName} - Select Performance</Title>
            </div>
          }
          size="xl"
          centered
        >
        {loadingPerformances ? (
          <Box style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Loader color="pink" />
          </Box>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {performances.map((performance) => (
              <Card 
                key={performance.performanceId} 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder
                style={{ 
                  cursor: performance.soldOut || performance.cancel ? 'not-allowed' : 'pointer',
                  opacity: performance.soldOut || performance.cancel ? 0.6 : 1,
                }}
                onClick={() => !performance.soldOut && !performance.cancel && handleSelectPerformance(performance)}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="lg" fw={700}>
                      {formatPerformanceDate(performance.performanceDate)}
                    </Text>
                    {performance.soldOut && (
                      <Badge color="red">Sold Out</Badge>
                    )}
                    {performance.cancel && (
                      <Badge color="gray">Cancelled</Badge>
                    )}
                  </Group>
                  
                  <Group>
                    <IconClock size={16} />
                    <Text size="sm">
                      {formatTime(performance.startTime)} - {formatTime(performance.endTime)}
                    </Text>
                  </Group>
                  
                  <Group>
                    <IconArmchair size={16} />
                    <Text size="sm">
                      {getSeatingTypeLabel(performance.seatingType)}
                    </Text>
                  </Group>
                  
                  <Group>
                    <IconTicket size={16} />
                    <Text size="sm">
                      {performance.remainingSeats} seats available
                    </Text>
                  </Group>
                  
                  <Divider my="xs" />
                  
                  <Text size="sm" fw={500}>Ticket Prices:</Text>
                  <Group>
                    {performance.ticketPrices.slice(0, 3).map((price, index) => (
                      <Badge key={index} variant="light" color="blue">
                        {price.ticketTypeName}: ${price.price}
                      </Badge>
                    ))}
                    {performance.ticketPrices.length > 3 && (
                      <Text size="xs" c="dimmed">+{performance.ticketPrices.length - 3} more</Text>
                    )}
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Modal>

      {/* Ticket Selection Modal */}
      <Modal
        opened={ticketModalOpened}
        onClose={closeTicketModal}
        title={
          <Box>
            <Title order={3}>{selectedPerformance?.showName}</Title>
            <Text size="sm" c="dimmed">
              {selectedPerformance && formatPerformanceDate(selectedPerformance.performanceDate)} • 
              {selectedPerformance && formatTime(selectedPerformance.startTime)}
            </Text>
            <Badge color="purple" mt="xs">
              {selectedPerformance && getSeatingTypeLabel(selectedPerformance.seatingType)}
            </Badge>
          </Box>
        }
        size="lg"
        centered
      >
        {selectedPerformance && (
          <Box>
            <Text fw={500} mb="md">Select Tickets</Text>
            <Stack gap="md">
              {selectedPerformance.ticketPrices.map((price) => {
                const currentQuantity = selectedTickets[price.ticketPriceId]?.quantity || 0;
                
                return (
                  <Paper key={price.ticketPriceId} p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>{price.ticketTypeName}</Text>
                        <Text size="lg" fw={700} c="blue">${price.price}</Text>
                      </Box>
                      
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => updateTicketQuantity(
                            price.ticketPriceId, 
                            price.ticketTypeName, 
                            price.price, 
                            Math.max(0, currentQuantity - 1)
                          )}
                          disabled={currentQuantity === 0}
                        >
                          <IconMinus size={16} />
                        </ActionIcon>
                        
                        <NumberInput
                          value={currentQuantity}
                          onChange={(value) => updateTicketQuantity(
                            price.ticketPriceId, 
                            price.ticketTypeName, 
                            price.price, 
                            typeof value === 'string' ? parseInt(value, 10) || 0 : value || 0
                          )}
                          min={0}
                          max={10}
                          styles={{ input: { width: 60, textAlign: 'center' } }}
                        />
                        
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => updateTicketQuantity(
                            price.ticketPriceId, 
                            price.ticketTypeName, 
                            price.price, 
                            Math.min(10, currentQuantity + 1)
                          )}
                          disabled={currentQuantity === 10}
                        >
                          <IconPlus size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
            
            <Divider my="lg" />
            
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={700}>Total</Text>
              <Box ta="right">
                <Text size="lg" fw={700} c="blue">${getTotalAmount()}</Text>
                <Text size="sm" c="dimmed">{getTotalTickets()} ticket(s)</Text>
              </Box>
            </Group>
            
            <Group>
              <Button variant="outline" onClick={closeTicketModal} fullWidth>
                Cancel
              </Button>
              <Button 
                onClick={handleProceedFromTickets} 
                fullWidth 
                disabled={getTotalTickets() === 0}
                color="purple"
              >
                {selectedPerformance.seatingType === SeatingType.GeneralAdmission 
                  ? 'Proceed to Checkout' 
                  : 'Select Seats'}
              </Button>
            </Group>
          </Box>
        )}
      </Modal>

      {/* Seat Selection Modal */}
      <Modal
        opened={seatModalOpened}
        onClose={closeSeatModal}
        title={
          <Box>
            <Title order={3}>Select Your Seats</Title>
            <Text size="sm" c="dimmed">
              Select {getTotalTickets()} seat{getTotalTickets() !== 1 ? 's' : ''}
            </Text>
          </Box>
        }
        size="xl"
        centered
      >
        {selectedPerformance && selectedPerformance.seatingPlan && (
          <Box>
            <Box mb="md">
              <Group gap="lg">
                <Box>
                  <Box w={20} h={20} bg="gray.3" style={{ borderRadius: 4, display: 'inline-block' }} />
                  <Text size="sm" ml={5} display="inline">Available</Text>
                </Box>
                <Box>
                  <Box w={20} h={20} bg="red.5" style={{ borderRadius: 4, display: 'inline-block' }} />
                  <Text size="sm" ml={5} display="inline">Reserved</Text>
                </Box>
                <Box>
                  <Box w={20} h={20} bg="blue.5" style={{ borderRadius: 4, display: 'inline-block' }} />
                  <Text size="sm" ml={5} display="inline">Selected</Text>
                </Box>
              </Group>
            </Box>

            <Paper p="lg" bg="gray.0" radius="md">
              <Text ta="center" mb="md" fw={700}>Stage</Text>
              <Divider mb="lg" />
              
              <ScrollArea h={400}>
                {Array.from({ length: selectedPerformance.seatingPlan.rows }, (_, rowIndex) => (
                  <Flex key={rowIndex} mb="sm" align="center">
                    <Text size="sm" fw={500} mr="md" w={30}>
                      {rowIndex + 1}
                    </Text>
                    <Group gap="xs">
                      {Array.from({ length: selectedPerformance.seatingPlan.seatsPerRow }, (_, seatIndex) => {
                        const row = rowIndex + 1;
                        const seat = seatIndex + 1;
                        const isReserved = isReservedSeat(row, seat);
                        const isSelected = isSelectedSeat(row, seat);
                        
                        return (
                          <Box
                            key={seatIndex}
                            w={25}
                            h={25}
                            bg={isReserved ? 'red.5' : isSelected ? 'blue.5' : 'gray.3'}
                            style={{
                              borderRadius: 4,
                              cursor: isReserved ? 'not-allowed' : 'pointer',
                              border: '1px solid',
                              borderColor: theme.colors.gray[4],
                            }}
                            onClick={() => toggleSeat(row, seat)}
                          />
                        );
                      })}
                    </Group>
                  </Flex>
                ))}
              </ScrollArea>
            </Paper>
            
            <Box mt="lg">
              <Group justify="space-between" mb="md">
                <Text fw={700}>Selected Seats ({selectedSeats.length}/{getTotalTickets()})</Text>
                <Text size="sm">
                  {selectedSeats.map(s => `Row ${s.rowNumber}, Seat ${s.seatNumber}`).join(' • ')}
                </Text>
              </Group>
              
              <Group>
                <Button variant="outline" onClick={closeSeatModal} fullWidth>
                  Back
                </Button>
                <Button 
                  onClick={handleProceedToCheckout} 
                  fullWidth 
                  disabled={selectedSeats.length !== getTotalTickets()}
                  color="purple"
                >
                  Proceed to Checkout
                </Button>
              </Group>
            </Box>
          </Box>
        )}
      </Modal>

      <Container size="lg" pt="xl" pb="md">
        <Button 
          component={Link} 
          href="/" 
          mb="lg" 
          variant="subtle" 
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Shows
        </Button>

        <Grid gutter={24}>
          {/* Left Column - Main Image */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper radius="md" p={0} style={{ overflow: 'hidden' }}>
              <Image
                src={ eventImages[0]}
                alt={show.showName}
                height={400}
              />
            </Paper>
          </Grid.Col>

          {/* Right Column - Show Details */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p="lg" radius="md" style={{ border: `1px solid ${theme.colors.gray[3]}` }}>
              <Group mb="md">
                <IconCalendar size={16} color={theme.colors.gray[6]} />
                <Text size="sm" fw={500}>{formattedStartDate} - {formattedEndDate}</Text>
              </Group>

              <Group mb="md"  display="none">
                <IconClock size={16} color={theme.colors.gray[6]} />
                <Text size="sm" fw={500}>{formatDuration(show.startDate, show.endDate)}</Text>
              </Group>

              <Group mb="md">
                <IconUser size={16} color={theme.colors.gray[6]} />
                <Text size="sm" fw={500}>Age Limit: {show.ageRestrictionCode}</Text>
              </Group>

              <Group mb="md">
                <Badge>{show.showType}</Badge>
                {show.active ? (
                  <Badge color="green">Active</Badge>
                ) : (
                  <Badge color="red">Inactive</Badge>
                )}
              </Group>

              <Group mb="md">
                <IconMapPin size={16} color={theme.colors.gray[6]} />
                <Text size="sm" fw={500}>{show.venueName}</Text>
              </Group>

              <Divider my="md" />

              {show.ticketTypeName && (
                <Box>
                  <Text fw={700} mb="xs">Ticket Type:</Text>
                  <Text>{show.ticketTypeName}</Text>
                </Box>
              )}

              <Button 
                onClick={handleBookTickets}
                color="purple" 
                size="lg" 
                radius="md" 
                fullWidth 
                mt="md"
              >
                Book Tickets
              </Button>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Show Title & Description */}
        <Box mt="xl">
          <Title order={1}>{show.showName}</Title>
          <Badge size="lg" color="pink" mt="xs">{show.showType}</Badge>
          
          <Box mt="xl">
            <Title order={3} mb="md">About The Show</Title>
            <Text>{show.description}</Text>

            {show.warningDescription && (
              <Paper p="md" bg="red.0" mt="lg" style={{ borderLeft: `4px solid ${theme.colors.red[6]}` }}>
                <Text fw={700} c="red.9">Warning:</Text>
                <Text c="red.8">{show.warningDescription}</Text>
              </Paper>
            )}

            {show.videosUrl && (
              <Button
                component="a"
                href={show.videosUrl}
                target="_blank"
                color="blue"
                variant="outline"
                mt="xl"
              >
                Watch Trailer
              </Button>
            )}
          </Box>
        </Box>

        {/* Venue Information */}
        <Box mt="xl">
          <Title order={3} mb="md">Venue Information</Title>
          <Paper p="lg" radius="md" style={{ border: `1px solid ${theme.colors.gray[3]}` }}>
            <Text fw={700}>{show.venueName}</Text>
            <Text size="sm" mt="xs">Venue ID: {show.venueId}</Text>
            
            <Button 
              component={Link}
              href={`/venue/${show.venueId}`}
              variant="outline"
              color="gray"
              size="sm"
              mt="md"
            >
              View Venue Details
            </Button>
          </Paper>
        </Box>

        {/* Ticket Information */}
        <Box mt="xl">
          <Title order={3} mb="md">Ticket Information</Title>
          <Paper p="lg" radius="md" style={{ border: `1px solid ${theme.colors.gray[3]}` }}>
            <Grid>
              <Grid.Col span={12}>
                <Text fw={700}>Ticket Type:</Text>
                <Text>{show.ticketTypeName}</Text>
                {show.ticketTypeId && (
                  <Text size="sm" c="dimmed">Ticket Type ID: {show.ticketTypeId}</Text>
                )}
              </Grid.Col>
              
              <Grid.Col span={12} mt="md">
                <Text fw={700}>Show Dates:</Text>
                <Text>{formattedStartDate} - {formattedEndDate}</Text>
              </Grid.Col>
              
              <Grid.Col span={12}>
                <Button 
                  onClick={handleBookTickets}
                  color="purple" 
                  size="lg" 
                  radius="md" 
                  mt="md"
                >
                  Book Tickets
                </Button>
              </Grid.Col>
            </Grid>
          </Paper>
        </Box>
      </Container>

      <NewsletterSection />
      <AboutSection />
      <ContactSection />
    </Box>
  );
}
