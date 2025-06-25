"use client";
import React, { useState } from "react";
import {
    TextInput,
    Button,
    Text,
    Box,
    Title,
    Anchor,
    Alert, Image, Flex,
} from "@mantine/core";
import {isEmail, useForm} from "@mantine/form";
import Link from "next/link";
import { IconInfoCircle } from "@tabler/icons-react";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: isEmail("Invalid email"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            // IMPLEMENT LOGIC FOR RESET PASSWORD
            console.log("Reset password for:", values.email);
            setSubmitted(true);
        } catch (error) {
            console.error("Reset password error:", error);
            form.setErrors({ email: "Error sending reset link" });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Flex direction="column" gap="md">
                <Flex justify="center" my="lg">
                    <Image src="/images/main-logo.svg" alt="Adelaide Fringe Logo"></Image>
                </Flex>
                <Title order={2} ta="center" mb="md">
                    Reset Link Sent
                </Title>

                <Alert
                    icon={<IconInfoCircle size={16} />}
                    title="Check your email"
                    color="purple.7"
                    mb="xl"
                >
                    If an account exists with the email {<Text component="span" fw={500}>{form.values.email}</Text>}, you will receive a
                    password reset link shortly.
                </Alert>

                <Text size="sm" ta="center">
                    <Link href="/admin/login" passHref legacyBehavior>
                        <Button component="a" size="sm">
                            Return to login
                        </Button>
                    </Link>
                </Text>
            </Flex>
        );
    }

    return (
        <Box>
            <Flex justify="center" my="lg">
                <Image src="/images/main-logo.svg" alt="Adelaide Fringe Logo"></Image>
            </Flex>
            <Title order={2} ta="center" mb="md">
                Forgot Your Password?
            </Title>
            <Text size="sm" mb="lg">
                Enter your email address and we&apos;ll send you a link to reset your password
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    {...form.getInputProps("email")}
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

                <Text size="xs" ta="center">
                    <Link href="/admin/login" passHref legacyBehavior>
                        <Anchor component="a" size="xs">
                            Back to login
                        </Anchor>
                    </Link>
                </Text>
            </form>
        </Box>
    );
}