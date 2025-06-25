'use client';

import { Box, Container, Flex, Text, Title } from '@mantine/core';
import { IconMail, IconPhone } from '@tabler/icons-react';

export default function ContactSection() {
  return (
    <Box id="contact" py="xl" px="md" bg="gray.1">
      <Container size="xl">
        <Flex direction="column" gap="sm">
          <Title order={2} c="purple">
            Contact Us
          </Title>

          <Flex align="center" gap="sm">
            <IconMail size={18} />
            <Text>
              Email us at <strong>support@adelaidefringe.com</strong>
            </Text>
          </Flex>

          <Flex align="center" gap="sm">
            <IconPhone size={18} />
            <Text>
              Call us at <strong>+61-1234-5678</strong>
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
