'use client';

import {Anchor, Button, Flex, Image, PasswordInput, Text, TextInput, Title} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {isEmail, useForm} from "@mantine/form";
import Link from "next/link";
import {useAuth} from "@/contexts/auth-context";
import {useRouter} from "next/navigation";

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const {login, user, isLoading, isAdmin} = useAuth();
    const router = useRouter();

    // Redirect if already logged in and is an admin
    useEffect(() => {
        if (!isLoading && user && isAdmin) {
            router.push('/admin/portal');
        }
    }, [user, isLoading, isAdmin, router]);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: isEmail("Invalid email"),
            password: (value) =>
                value.length < 6 ? "Password must be at least 6 characters" : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setGeneralError(null);

        try {
            await login(values.email, values.password);
        } catch (error: unknown) {
            const err = error as { message?: string; code?: string };  // Type assertion
            if (err?.message?.includes('credentials')) {
                setGeneralError('Invalid email or password');
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex direction="column" gap="xs">
            <Flex justify="center" my="lg">
                <Image src="/images/main-logo.svg" alt="Adelaide Fringe Logo"></Image>
            </Flex>
            <Title order={2} ta="center" mb="md">
                Welcome to Admin Portal
            </Title>


            <form onSubmit={form.onSubmit(handleSubmit)}>

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
                    mb="lg"
                    required
                />
                {generalError && (
                    <Text c="red" size="sm" mb="md">
                        {generalError}
                    </Text>
                )}
                <Button
                    type="submit"
                    fullWidth
                    color="purple.7"
                    loading={loading}
                    mb="md"
                >
                    Log In
                </Button>
            </form>
            <Text size="xs">
                <Link href="/admin/forgot-password" passHref>
                    <Anchor component="a" size="xs">
                        Forgot your password?
                    </Anchor>
                </Link>
            </Text>
        </Flex>)
}
