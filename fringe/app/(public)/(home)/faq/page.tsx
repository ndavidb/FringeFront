'use client';

import React from 'react';
import { Box, Container, Flex, Text, Title, Accordion, Group, Image } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';
import Link from 'next/link';

export default function FaqSection() {
  return (
    <>
      {/* Header Section with Logo and Navigation */}
      <Box bg="gray.1" py="md">
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Image src="/images/main-logo.svg" alt="Adelaide Fringe Logo" width={180} />
            <Group gap="lg">
              <Link href="/#about" passHref legacyBehavior>
                <Text
                  component="a"
                  fw={700}
                  fz="md"
                  c="pink.6"
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  About Us
                </Text>
              </Link>
              <Link href="/#contact" passHref legacyBehavior>
                <Text
                  component="a"
                  fw={700}
                  fz="md"
                  c="pink.6"
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Contact Us
                </Text>
              </Link>
            </Group>
          </Flex>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box id="faq" py="xl" px="md" bg="gray.0">
        <Container size="xl">
          <Flex direction="column" gap="sm">
            <Title order={2} c="purple">
              Frequently Asked Questions
            </Title>

            <Flex align="center" gap="sm" mt="xs">
              <IconHelpCircle size={18} />
              <Text>Have a question? Check out these common answers:</Text>
            </Flex>

            <Accordion variant="separated" mt="md">
              <Accordion.Item value="q1">
                <Accordion.Control>What is Adelaide Fringe?</Accordion.Control>
                <Accordion.Panel>
                  Adelaide Fringe is the world’s second-largest annual arts festival, featuring over 7,000 artists and 1,300+ events.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="q2">
                <Accordion.Control>Do I need tickets for all events?</Accordion.Control>
                <Accordion.Panel>
                  Not always! Some events are free, while others require tickets. Details are listed on each show’s page.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="q3">
                <Accordion.Control>Where are the venues located?</Accordion.Control>
                <Accordion.Panel>
                  Venues are spread across Adelaide. You can search shows by location on our homepage.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="q4">
                <Accordion.Control>How can I contact support?</Accordion.Control>
                <Accordion.Panel>
                  Email us at support@adelaidefringe.com or call +61-1234-5678.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
