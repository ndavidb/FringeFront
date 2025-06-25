"use client";

import React from "react";
import {Box, Container, Image, Flex, Paper} from "@mantine/core";
import { usePathname } from "next/navigation";

export default function AdminAuthLayout({children}: { children: React.ReactNode; }) {
    const pathname = usePathname();

    // Only apply the auth layout to login and forgot-password pages
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';

    if (!isAuthPage) {
        return <>{children}</>;
    }

    return (
        <Flex
            h="100vh"
            w="100%"
            style={{
                overflow: "hidden",
            }}
        >
            <Box
                w={{base: '100%', md: '65%'}}
                h="100%"
                py="xl"
                px="md"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <Container size="xs" w="100%">
                    <Paper
                        withBorder
                        p="xl"
                        shadow="xl"
                        radius="sm"
                    >
                        {children}
                    </Paper>
                </Container>
            </Box>
            <Box
                w='35%'
                h="100%"
                bg="#f4f4f4"
                display={{base: 'none', md: 'block'}}
                style={{
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Image src="/images/admin/auth-layout.webp" alt="Fringe visual"
                       style={{width: '100%', height: '100%', objectFit: 'fill'}}/>
            </Box>
        </Flex>
    )
}