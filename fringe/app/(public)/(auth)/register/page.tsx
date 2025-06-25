//Ignore PAGE FOR NOW
'use client';

import React, { useState } from "react";
import {
    TextInput,
    PasswordInput,
    Button,
    Group,
    Text,
    Title,
    Anchor, Image, Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: {
            firstName: (value) => (value.length < 2 ? "First name is too short" : null),
            lastName: (value) => (value.length < 2 ? "Last name is too short" : null),
            phoneNumber: (value) => {
                if (!value) return "Phone number is required";
                // Basic phone validation - can be adjusted based on your requirements
                const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
                return phoneRegex.test(value) ? null : "Invalid phone number format";
            },
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            password: (value) =>
                value.length < 6 ? "Password must be at least 6 characters" : null,
            confirmPassword: (value, values) =>
                value !== values.password ? "Passwords do not match" : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            // Implement your registration logic here
            console.log("Register values:", values);
            // Redirect to login on success
            // router.push('/admin/login');
        } catch (error) {
            console.error("Registration error:", error);
            form.setErrors({ email: "Email already exists" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex direction="column">
            <Flex justify="center" my="lg">
                <Image src="/images/main-logo.svg" alt="Adelaide Fringe Logo"></Image>
            </Flex>
            <Title order={2} ta="center" mb="md">
                Create Your Account
            </Title>
            <Text size="sm" mb="lg">
                Please fill in your details to register
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
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

                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    {...form.getInputProps("email")}
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
                    color="grape.7"
                    loading={loading}
                    mb="md"
                >
                    Register
                </Button>

                <Text size="xs" ta="center">
                    <Link href="/admin/login" passHref legacyBehavior>
                        <Anchor component="a" size="xs">
                            Already have an account? Log in
                        </Anchor>
                    </Link>
                </Text>
            </form>
        </Flex>
    );
}