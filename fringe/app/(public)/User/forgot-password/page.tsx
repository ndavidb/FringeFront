'use client';

import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Text,
  Title,
  Anchor,
  Alert,
  Paper,
  Container,
  Flex,
  Image,
  Box,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import Link from 'next/link';
import { IconInfoCircle } from '@tabler/icons-react';
import { forgotPassword } from '@/services/authService';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: { email: '' },
    validate: { email: isEmail('Invalid email') },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await forgotPassword({ email: values.email });
      setSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      form.setErrors({ email: 'Error sending reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" w="100%">
      {/* Left - Form */}
      <Box w={{ base: '100%', md: '60%' }} py="xl" px="md" style={{ display: 'flex', alignItems: 'center' }}>
        <Container size="xs" w="100%">
          <Paper withBorder p="xl" shadow="xl" radius="md">
      
            <Flex justify="center" mb="md">
              <Image src="/images/main-logo.svg" alt="Fringe Logo" width={180} />
            </Flex>

            <Title order={2} ta="center" mb="md" c="pink">
              Forgot Your Password?
            </Title>

            {!submitted ? (
              <>
                <Text size="sm" ta="center" mb="lg">
                  Enter your email and we’ll send you a reset link.
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    {...form.getInputProps('email')}
                    mb="xl"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    color="purple.7"
                    loading={loading}
                    mb="md"
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Alert icon={<IconInfoCircle size={16} />} title="Check your email" color="purple.7" mb="xl">
                  If an account exists with <Text span fw={500}>{form.values.email}</Text>, you’ll receive a password reset link shortly.
                </Alert>
                <Text ta="center" mt="lg">
                  <Link href="/user/login" passHref legacyBehavior>
                    <Button component="a" size="sm" color="purple.6">Return to login</Button>
                  </Link>
                </Text>
              </>
            )}

            {!submitted && (
              <Text size="xs" ta="center">
                <Link href="/User/login" passHref legacyBehavior>
                  <Anchor component="a" size="xs">Back to login</Anchor>
                </Link>
              </Text>
            )}
          </Paper>
        </Container>
      </Box>

      <Box
        w="40%"
        h="100%"
        bg="#f4f4f4"
        display={{ base: 'none', md: 'block' }}
        style={{ overflow: 'hidden' }}
      >
        <Image
          src="/images/admin/auth-layout.webp"
          alt="Reset Visual"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Flex>
  );
}
