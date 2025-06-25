// app/dashboard/_components/TopShowsTable.tsx
'use client';
import { Table, Card, Title, Text } from '@mantine/core';

interface SalesData {
    showName: string;
    totalTicketsSold: number;
    totalRevenue: number;
}

interface TopShowsTableProps {
    data: SalesData[];
}

export function TopShowsTable({ data }: TopShowsTableProps) {
    const rows = data.map((row) => (
        <Table.Tr key={row.showName}>
            <Table.Td>{row.showName}</Table.Td> {/**/}
            <Table.Td align="left">{row.totalTicketsSold.toLocaleString()}</Table.Td> {/**/}
            <Table.Td align="left">{`$${row.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</Table.Td> {/**/}
        </Table.Tr>
    ));

    return (
        <Card withBorder radius="md" p="lg">
            <Title order={4}>Top 5 Selling Shows</Title>
            <Text c="dimmed" fz="sm" mb="lg">Shows ranked by all-time total revenue.</Text>
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Show Name</Table.Th>
                        <Table.Th align="left">Tickets Sold</Table.Th>
                        <Table.Th align="left">Total Revenue</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Card>
    );
}