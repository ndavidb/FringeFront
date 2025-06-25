'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Flex, Text, TextInput, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function NewsletterSection() {
  const theme = useMantineTheme();
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/User/Registeruser');
  };

  return (
    <Box bg="pink" py="xl">
      <Container size="xl">
        <Flex justify="space-between" align="center" wrap="wrap" style={{ gap: theme.spacing.md }}>
          <Box>
            <Text fw={700} fz="lg" c="white">
              Stay updated on exciting giveaways, special offers, amazing events, and everything Fringe!
            </Text>
          </Box>

          <Box style={{ width: 350 }}>
            <TextInput
              radius="xl"
              size="md"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              rightSectionWidth={90}
              rightSection={
                <Button
                  color="purple"
                  size="sm"
                  radius="xl"
                  fw={700}
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              }
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

