"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Box,
  Button,
  Paper,
  Grid,
  TextInput,
  Stack,
  Group,
  Divider,
  Card,
  Select,
  Checkbox,
  Textarea,
  useMantineTheme,
  Loader,
  Alert,
  List,
} from "@mantine/core";
import { 
  IconCalendar, 
  IconClock, 
  IconTicket, 
  IconUser,
  IconMail,
  IconPhone,
  IconArrowLeft,
  IconShoppingCart,
  IconAlertCircle,
  IconArmchair,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';

import HeaderSection from "@/app/(public)/(home)/components/HeaderSection";

// Enhanced booking data type to include seating information
type BookingData = {
  performanceId: number;
  showId: number;
  showName: string;
  performanceDate: string;
  startTime: string;
  tickets: {
    [ticketPriceId: number]: {
      ticketTypeName: string;
      price: number;
      quantity: number;
    };
  };
  totalAmount: number;
  totalTickets: number;
  seatingType: number; // 0 for General Admission, 1 for Customised Seating
  selectedSeats: {
    rowNumber: number;
    seatNumber: number;
  }[] | null; // null for General Admission
};

type BookingFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialRequests: string;
  newsletter: boolean;
  agreeToTerms: boolean;
};

// Enum for SeatingType
enum SeatingType {
  GeneralAdmission = 0,
  CustomisedSeating = 1,
}

export default function CheckoutPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Australia',
      specialRequests: '',
      newsletter: false,
      agreeToTerms: false,
    },
    validate: {
      firstName: (value) => (value.trim().length === 0 ? 'First name is required' : null),
      lastName: (value) => (value.trim().length === 0 ? 'Last name is required' : null),
      email: (value) => {
      
      if (!value || value.trim().length === 0) {
        return 'Email is required';
      }
      
      const trimmedEmail = value.trim();
      
      // Check basic structure first
      if (!trimmedEmail.includes('@')) {
        return 'Email must contain @ symbol';
      }
      
      const atCount = (trimmedEmail.match(/@/g) || []).length;
      if (atCount !== 1) {
        return 'Email must contain exactly one @ symbol';
      }
      
      const [localPart, domainPart] = trimmedEmail.split('@');
      
      // Validate local part (before @)
      if (!localPart || localPart.length === 0) {
        return 'Email must have a username before @';
      }
      
      if (localPart.length > 64) {
        return 'Username part is too long (max 64 characters)';
      }
      
      // Validate domain part (after @) - THIS IS THE KEY FIX
      if (!domainPart || domainPart.length === 0) {
        return 'Email must have a domain after @';
      }
      
      // CRITICAL: Domain must contain at least one dot for TLD
      if (!domainPart.includes('.')) {
        return 'Please enter a complete email address (e.g., user@gmail.com)';
      }
      
      if (domainPart.length > 253) {
        return 'Domain part is too long';
      }
      
      // Check for proper domain structure
      if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
        return 'Domain cannot start or end with a dot';
      }
      
      if (domainPart.includes('..')) {
        return 'Domain cannot contain consecutive dots';
      }
      
      const domainParts = domainPart.split('.');
      
      // Must have at least 2 parts (domain + TLD)
      if (domainParts.length < 2) {
        return 'Please enter a complete email address (e.g., user@gmail.com)';
      }
      
      // Check each domain part
      for (const part of domainParts) {
        if (!part || part.length === 0) {
          return 'Invalid domain format';
        }
        
        if (part.length > 63) {
          return 'Domain part is too long';
        }
        
        // Domain parts should only contain letters, numbers, and hyphens
        if (!/^[a-zA-Z0-9-]+$/.test(part)) {
          return 'Domain contains invalid characters';
        }
        
        // Cannot start or end with hyphen
        if (part.startsWith('-') || part.endsWith('-')) {
          return 'Domain parts cannot start or end with hyphen';
        }
      }
      
      // Check TLD (last part after final dot) - MUST BE AT LEAST 2 CHARACTERS
      const tld = domainParts[domainParts.length - 1];
      if (!tld || tld.length < 2) {
        return 'Please enter a valid domain extension (e.g., .com, .org)';
      }
      
      // TLD should only contain letters
      if (!/^[a-zA-Z]+$/.test(tld)) {
        return 'Domain extension should only contain letters';
      }
      
      // Additional comprehensive regex check
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      
      if (!emailRegex.test(trimmedEmail)) {
        return 'Please enter a valid email address';
      }
      
      return null;
    },
      confirmEmail: (value, values) => 
        value !== values.email ? 'Emails do not match' : null,
      phone: (value) => 
        value.trim().length === 0 ? 'Phone number is required' : 
        !/^\+?[\d\s-()]+$/.test(value) ? 'Invalid phone number' : null,
      agreeToTerms: (value) => (!value ? 'You must agree to the terms and conditions' : null),
    },
  });

  useEffect(() => {
    // Retrieve booking data from sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      // If no booking data, redirect back to home
      router.push('/');
    }
    setLoading(false);
  }, [router]);

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

  const getSeatingTypeLabel = (seatingType: number) => {
    return seatingType === SeatingType.GeneralAdmission 
      ? 'General Admission' 
      : 'Reserved Seating';
  };

  // Update your handleSubmit function in checkout page

const handleSubmit = async (values: BookingFormValues) => {
  setSubmitting(true);
  
  try {
    // Prepare booking request data with seating information
    const bookingRequest = {
      performanceId: bookingData?.performanceId,
      customerInfo: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
      },
      tickets: Object.entries(bookingData?.tickets || {}).map(([ticketPriceId, ticket]) => ({
        ticketPriceId: parseInt(ticketPriceId),
        quantity: ticket.quantity,
        price: ticket.price,
      })),
      seatingType: bookingData?.seatingType,
      selectedSeats: bookingData?.selectedSeats || [],
      specialRequests: values.specialRequests,
      newsletter: values.newsletter,
      totalAmount: bookingData?.totalAmount,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingRequest),
    });
    console.log(response);

    if (!response.ok) {
      console.error('Failed to create booking:', response.status, response.statusText);
      throw new Error('Failed to create booking');
    }

    const result = await response.json();
  
    // Clear booking data from sessionStorage
    sessionStorage.removeItem('bookingData');
    
    // Redirect to confirmation page using the booking reference
    router.push(`/booking-confirmation/${result.bookingReference}`);

  } catch (error) {
    console.error('Error creating booking:', error);
    // Show error notification
    // You might want to add a notification system here
    alert('Failed to create booking. Please try again.');
  } finally {
    setSubmitting(false);
  }
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

  if (!bookingData) {
    return (
      <>
        <HeaderSection />
        <Container>
          <Title order={2}>No booking data found</Title>
          <Button component={Link} href="/" mt="md">
            Back to Home
          </Button>
        </Container>
      </>
    );
  }

  return (
    <Box bg="white">
      <HeaderSection />

      <Container size="lg" pt="xl" pb="xl">
        <Button 
          component={Link} 
          href={`/show/${bookingData.showId}`}
          mb="lg" 
          variant="subtle" 
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Show
        </Button>

        <Title order={1} mb="xl">Complete Your Booking</Title>

        <Grid gutter={32}>
          {/* Left Column - Booking Form */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Paper p="lg" radius="md" withBorder>
                <Title order={3} mb="lg">
                  <IconUser size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Customer Information
                </Title>

                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="First Name"
                      placeholder="John"
                      required
                      {...form.getInputProps('firstName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Last Name"
                      placeholder="Doe"
                      required
                      {...form.getInputProps('lastName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email"
                      placeholder="john.doe@example.com"
                      type="email"
                      required
                      leftSection={<IconMail size={16} />}
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Confirm Email"
                      placeholder="john.doe@example.com"
                      type="email"
                      required
                      leftSection={<IconMail size={16} />}
                      {...form.getInputProps('confirmEmail')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Phone Number"
                      placeholder="+61 412 345 678"
                      required
                      leftSection={<IconPhone size={16} />}
                      {...form.getInputProps('phone')}
                    />
                  </Grid.Col>
                </Grid>

                <Divider my="xl" />

                <Title order={4} mb="md">Billing Address</Title>
                <Grid gutter="md">
                  <Grid.Col span={12}>
                    <TextInput
                      label="Address"
                      placeholder="123 Main Street"
                      {...form.getInputProps('address')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="City"
                      placeholder="Adelaide"
                      {...form.getInputProps('city')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="State/Province"
                      placeholder="South Australia"
                      {...form.getInputProps('state')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Postal Code"
                      placeholder="5000"
                      {...form.getInputProps('zipCode')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Country"
                      data={[
                        { value: 'Australia', label: 'Australia' },
                        { value: 'New Zealand', label: 'New Zealand' },
                        { value: 'United States', label: 'United States' },
                        { value: 'United Kingdom', label: 'United Kingdom' },
                        { value: 'Other', label: 'Other' },
                      ]}
                      {...form.getInputProps('country')}
                    />
                  </Grid.Col>
                </Grid>

                <Divider my="xl" />

                <Title order={4} mb="md">Additional Information</Title>
                <Textarea
                  label="Special Requests"
                  placeholder="Any special requirements or requests..."
                  rows={3}
                  {...form.getInputProps('specialRequests')}
                />

                <Stack gap="md" mt="lg">
                  <Checkbox
                    label="I would like to receive news and updates via email"
                    {...form.getInputProps('newsletter', { type: 'checkbox' })}
                  />
                  <Checkbox
                    label="I agree to the terms and conditions"
                    required
                    {...form.getInputProps('agreeToTerms', { type: 'checkbox' })}
                  />
                </Stack>

                <Alert 
                  icon={<IconAlertCircle size={16} />} 
                  title="Important" 
                  color="blue" 
                  mt="lg"
                >
                  Please review your booking details carefully before submitting. 
                  A confirmation email will be sent to the provided email address.
                </Alert>

                <Button 
                  type="submit" 
                  size="lg" 
                  color="purple" 
                  fullWidth 
                  mt="xl"
                  loading={submitting}
                  leftSection={<IconShoppingCart size={20} />}
                >
                  Complete Booking - ${bookingData.totalAmount}
                </Button>
              </Paper>
            </form>
          </Grid.Col>

          {/* Right Column - Booking Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="lg" radius="md" withBorder style={{ position: 'sticky', top: 20 }}>
              <Title order={3} mb="lg">
                <IconTicket size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Booking Summary
              </Title>

              <Card p="md" radius="md" bg="gray.0" mb="lg">
                <Text size="lg" fw={700} mb="xs">{bookingData.showName}</Text>
                
                <Group gap="xs" mb="xs">
                  <IconCalendar size={16} color={theme.colors.gray[6]} />
                  <Text size="sm">{formatDate(bookingData.performanceDate)}</Text>
                </Group>
                
                <Group gap="xs" mb="xs">
                  <IconClock size={16} color={theme.colors.gray[6]} />
                  <Text size="sm">{formatTime(bookingData.startTime)}</Text>
                </Group>
                
                <Group gap="xs">
                  <IconArmchair size={16} color={theme.colors.gray[6]} />
                  <Text size="sm">{getSeatingTypeLabel(bookingData.seatingType)}</Text>
                </Group>
              </Card>

              <Title order={5} mb="md">Tickets</Title>
              <Stack gap="sm" mb="lg">
                {Object.entries(bookingData.tickets).map(([ticketPriceId, ticket]) => (
                  <Box key={ticketPriceId}>
                    <Group justify="space-between">
                      <Text>{ticket.ticketTypeName}</Text>
                      <Text fw={500}>{ticket.quantity} x ${ticket.price}</Text>
                    </Group>
                    <Text size="sm" c="dimmed" ta="right">
                      ${ticket.quantity * ticket.price}
                    </Text>
                  </Box>
                ))}
              </Stack>

              {/* Show selected seats if it's customised seating */}
              {bookingData.seatingType === SeatingType.CustomisedSeating && bookingData.selectedSeats && (
                <>
                  <Title order={5} mb="md">Selected Seats</Title>
                  <Paper p="sm" radius="md" bg="purple.0" mb="lg">
                    <List size="sm">
                      {bookingData.selectedSeats.map((seat, index) => (
                        <List.Item key={index}>
                          Row {seat.rowNumber}, Seat {seat.seatNumber}
                        </List.Item>
                      ))}
                    </List>
                  </Paper>
                </>
              )}

              <Divider my="md" />

              <Group justify="space-between" mb="xs">
                <Text>Subtotal</Text>
                <Text>${bookingData.totalAmount}</Text>
              </Group>
              
              <Group justify="space-between" mb="xs">
                <Text>Booking Fee</Text>
                <Text>$0</Text>
              </Group>

              <Divider my="md" />

              <Group justify="space-between">
                <Text size="lg" fw={700}>Total</Text>
                <Text size="lg" fw={700} c="purple">
                  ${bookingData.totalAmount}
                </Text>
              </Group>

              <Text size="xs" c="dimmed" mt="md">
                {bookingData.totalTickets} ticket{bookingData.totalTickets !== 1 ? 's' : ''}
              </Text>

              {/* Information about seating type */}
              <Paper p="sm" radius="md" bg="gray.0" mt="lg">
                <Group gap="xs">
                  <IconArmchair size={16} color={theme.colors.blue[6]} />
                  <Text size="sm" fw={500}>
                    {bookingData.seatingType === SeatingType.GeneralAdmission 
                      ? 'General Admission - No specific seats assigned'
                      : 'Reserved Seating - Seats assigned as selected'}
                  </Text>
                </Group>
              </Paper>

              <Paper p="sm" radius="md" bg="blue.0" mt="lg">
                <Text size="sm" c="blue.9">
                  <strong>Secure Checkout:</strong> Your payment information is encrypted and secure.
                </Text>
              </Paper>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
