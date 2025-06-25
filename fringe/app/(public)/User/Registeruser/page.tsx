'use client';

import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Title,
  Anchor,
  Image,
  Flex,
  Paper,
  Container,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from '@/services/authService';

export default function RegisterUserPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : "Invalid email address",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      firstName: (value) => (value.length < 2 ? "First name is too short" : null),
      lastName: (value) => (value.length < 2 ? "Last name is too short" : null),
      phoneNumber: (value) =>
        /^\d{10}$/.test(value) ? null : "Phone number must be exactly 10 digits",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      });

      router.push('/User/login');
    } catch (error: unknown) {
      let raw = '';

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object'
      ) {
        raw =
          (error as any).response?.data?.message ||
          (error as any).response?.data ||
          (error as any).message ||
          '';
      } else if (error instanceof Error) {
        raw = error.message;
      }

      const message = raw.toString().toLowerCase();

      let field = "email";
      let friendlyMessage = "An account with this email already exists";

      if (message.includes("phone")) {
        field = "phoneNumber";
        friendlyMessage = "An account with this phone number already exists.";
      }

      form.setErrors({ [field]: friendlyMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" w="100%">
      <Box w={{ base: '100%', md: '60%' }} py="xl" px="md" style={{ display: 'flex', alignItems: 'center' }}>
        <Container size="xs" w="100%">
          <Paper withBorder shadow="xl" p="xl" radius="md">
            <Flex justify="center" mb="md">
              <Image src="/images/main-logo.svg" alt="Fringe Logo" width={180} />
            </Flex>

            <Title order={2} ta="center" mb="md" c="pink">
              Create Your Fringe Account
            </Title>
            <Text size="sm" mb="lg" ta="center">
              Fill in your details to register
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="Enter your email"
                {...form.getInputProps("email")}
                mb="md"
                required
              />

              <Group grow mb="sm">
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  {...form.getInputProps("firstName")}
                  required
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  {...form.getInputProps("lastName")}
                  required
                />
              </Group>

              <TextInput
                label="Phone Number"
                placeholder="Enter your phone number"
                {...form.getInputProps("phoneNumber")}
                mb="md"
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                {...form.getInputProps("password")}
                mb="md"
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                {...form.getInputProps("confirmPassword")}
                mb="lg"
                required
              />

              <Button
                type="submit"
                fullWidth
                color="purple"
                loading={loading}
                mb="md"
              >
                Register
              </Button>

              <Text size="xs" ta="center">
                <Link href="/User/login" passHref legacyBehavior>
                  <Anchor component="a" size="xs">
                    Already have an account? Log in
                  </Anchor>
                </Link>
              </Text>
            </form>
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
          alt="Register Visual"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Flex>
  );
}
