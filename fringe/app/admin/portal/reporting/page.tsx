'use client';
import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Title,
    Group,
    Text,
    SimpleGrid,
    Stack,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconFilter } from '@tabler/icons-react';
import { getShowSalesReport } from '@/services/reportService';
import { ShowSalesReportDto } from '@/types/api/report';
import ExportButton from '@/app/admin/portal/reporting/components/ExportButton';
import SalesReportChart from '@/app/admin/portal/reporting/components/SalesReportChart';
import SalesReportTable from '@/app/admin/portal/reporting/components/SalesReportTable';

export default function ReportingPage() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [trigger, setTrigger] = useState<number>(0); // trigger is a number to change query key

    const { data = [], isLoading } = useQuery<ShowSalesReportDto[]>({
        queryKey: ['salesReport', trigger], // only depends on trigger
        queryFn: () => {
            if (!startDate || !endDate) return Promise.resolve([]); // fallback
            return getShowSalesReport(startDate, endDate);
        },
        enabled: trigger !== 0, // only run if trigger is changed
    });

    const handleGenerate = () => {
        if (startDate && endDate) {
            setTrigger(prev => prev + 1); // change trigger to refetch
        } else {
            alert('Please select both start and end dates.');
        }
    };

    return (
        <Box p="lg">
            <Title order={2} mb="md">Ticket Sales Report</Title>

            <Paper shadow="md" radius="lg" p="lg" mb="xl" withBorder>
                <Group grow align="end">
                    <DatePickerInput
                        value={startDate}
                        onChange={setStartDate}
                        label="Start Date"
                        leftSection={<IconCalendar size={12} />}
                        radius="md"
                        size="sm"
                    />
                    <DatePickerInput
                        value={endDate}
                        onChange={setEndDate}
                        label="End Date"
                        leftSection={<IconCalendar size={12} />}
                        radius="md"
                        size="sm"
                    />
                    <Group>
                        <Button
                            onClick={handleGenerate}
                            leftSection={<IconFilter size={12} />}
                            size="xs"
                            radius="md"
                            color="pink.8"
                            style={{ maxWidth: 120 }}
                        >
                            Generate
                        </Button>
                        <ExportButton data={data} />
                    </Group>
                </Group>
            </Paper>

            {data.length === 0 && !isLoading ? (
                <Text>No report data available for selected date range.</Text>
            ) : (
                <Stack>
                    <SimpleGrid cols={2} spacing="xl">
                        <Paper shadow="md" radius="lg" p="lg"><SalesReportTable data={data} /></Paper>
                        <Paper shadow="md" radius="lg" p="lg"><SalesReportChart data={data} /></Paper>
                    </SimpleGrid>
                </Stack>
            )}
        </Box>
    );
}
