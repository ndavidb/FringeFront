// app/unauthorized/page.tsx
'use client';

import { Title, Text, Button, Container, Group, Image } from '@mantine/core';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <Container size="md" style={{ textAlign: 'center', paddingTop: '5rem' }}>
            <Image
                src="/images/main-logo.svg"
                alt="Adelaide Fringe Logo"
                style={{ margin: '0 auto', maxWidth: '200px' }}
                mb="xl"
            />

            <Title order={1} mb="md">Access Denied</Title>

            <Text size="lg" mb="xl">
                You do not have permission to access the requested page.
                This area is restricted to administrators only.
            </Text>

            <Group>
                <Button component={Link} href="/" color="purple.7">
                    Return to Home
                </Button>
            </Group>
        </Container>
    );
}