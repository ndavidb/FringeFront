import React from 'react';
import { Container, Title, Text, Box } from '@mantine/core';

export const metadata = {
  title: 'Book Tickets - Fringe Festival',
  description: 'Select and book tickets for Fringe Festival events',
};

export default function BookingPage() {
  return (
    <Container size="xl" py="xl">
      <Box mb="xl">
        <Title>Book Tickets</Title>
        <Text c="dimmed" mt="sm">
          Select your tickets and seats for the event
        </Text>
      </Box>
    </Container>
  );
}