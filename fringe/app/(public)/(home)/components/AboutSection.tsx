'use client';

import { Box, Container, Flex, Text, Title } from '@mantine/core';

export default function AboutSection() {
  return (
    <Box id="about" py="xl" px="md" bg="gray.0">
      <Container size="xl">
        <Flex direction="column" gap="sm">
          <Title order={2} c="purple">
            About Adelaide Fringe
          </Title>
          <Text>
            Adelaide Fringe is Australia’s biggest arts festival and the world’s second-largest annual arts festival.
            It features over 7,000 artists and 1,300+ events every year across hundreds of venues.
            The Fringe celebrates diversity in artistic expression and offers both free and ticketed events.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
