'use client';

import {
  Anchor,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/services/authService';
import { AuthProvider } from '@/contexts/auth-context';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: isEmail('Invalid email'),
      password: (val) => (val.length < 6 ? 'Minimum 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({
        email: values.email,
        password: values.password,
      });

      if (!data.roles.includes('User')) {
        throw new Error('Access denied: not a User');
      }

      router.push('/User/portal/Dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" w="100%">
      <Box w={{ base: '100%', md: '60%' }} p="lg" style={{ display: 'flex', alignItems: 'center' }}>
        <Container size="xs" w="100%">
          <Paper withBorder shadow="xl" p="xl" radius="md">
          
            <Flex justify="center" mb="md">
              <Image src="/images/main-logo.svg" alt="Fringe Logo" width={180} />
            </Flex>

            <Title order={2} ta="center" mb="md" c="pink">
              User Login
            </Title>

            {error && (
              <Text c="red" ta="center" mb="sm">
                {error}
              </Text>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="Enter your email"
                {...form.getInputProps('email')}
                required
                mb="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                {...form.getInputProps('password')}
                required
                mb="lg"
              />

              <Button type="submit" fullWidth loading={loading} color="purple.6">
                Log In
              </Button>
            </form>

            <Text ta="center" mt="md">
              <Link href="/User/Registeruser" passHref>
                <Anchor component="a">Don’t have an account?</Anchor>
              </Link>
            </Text>

            <Text ta="center">
              <Link href="/User/forgot-password" passHref>
                <Anchor component="a">Forgot password?</Anchor>
              </Link>
            </Text>
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
          alt="Login Visual"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Flex>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
