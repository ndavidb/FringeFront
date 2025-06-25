'use client';

import React from 'react';
import {
    Box,
    Paper,
    Text,
    Center,
    ScrollArea,
    rem,
    useMantineTheme,
    Flex
} from '@mantine/core';
import { IconArmchair } from '@tabler/icons-react';

interface SeatingVisualizerProps {
    rows: number;
    seatsPerRow: number;
}

export function SeatingVisualizer({ rows, seatsPerRow }: SeatingVisualizerProps) {
    const theme = useMantineTheme();

    // Render a seat
    const renderSeat = (row: number, seatNumber: number) => {
        return (
            <Box
                key={`seat-${row}-${seatNumber}`}
                style={{
                    width: rem(24),
                    height: rem(24),
                    backgroundColor: theme.colors.blue[5],
                    borderRadius: theme.radius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: rem(2),
                }}
            >
                <IconArmchair size={14} color="white" />
            </Box>
        );
    };

    return (
        <Paper withBorder p="md">
            <ScrollArea h={Math.min(rows * 40 + 100, 400)} type="auto">
                <Flex direction="column" align="center" gap="xs">
                    {/* Stage */}
                    <Paper
                        bg={theme.colors.dark[4]}
                        py="xs"
                        px={64}
                        style={{
                            borderRadius: theme.radius.sm,
                            width: 'fit-content'
                        }}
                        mb="lg"
                    >
                        <Text c="white" fw={700}>STAGE</Text>
                    </Paper>

                    {/* Seats grid */}
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <Flex key={`row-${rowIndex + 1}`} gap={4} align="center">
                            <Box w={24} ta="center">
                                <Text size="xs" fw={700}>{rowIndex + 1}</Text>
                            </Box>

                            {Array.from({ length: seatsPerRow }).map((_, seatIndex) =>
                                renderSeat(rowIndex + 1, seatIndex + 1)
                            )}

                            <Box w={24} ta="center">
                                <Text size="xs" fw={700}>{rowIndex + 1}</Text>
                            </Box>
                        </Flex>
                    ))}

                    {/* Seat numbers */}
                    <Flex gap={4} mt="xs">
                        <Box w={24} />
                        {Array.from({ length: seatsPerRow }).map((_, index) => (
                            <Box
                                key={`seat-num-${index + 1}`}
                                w={24}
                                ta="center"
                            >
                                <Text size="xs">{index + 1}</Text>
                            </Box>
                        ))}
                        <Box w={24} />
                    </Flex>
                </Flex>
            </ScrollArea>

            <Center mt="md">
                <Text size="sm" c="dimmed">
                    Total capacity: {rows * seatsPerRow} seats
                </Text>
            </Center>
        </Paper>
    );
}