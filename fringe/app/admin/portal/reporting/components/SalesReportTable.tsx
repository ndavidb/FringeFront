'use client';
import { Table } from '@mantine/core';
import { ShowSalesReportDto } from '@/types/api/report';

type Props = {
    data: ShowSalesReportDto[];
};

export default function SalesReportTable({ data }: Props) {
    return (
        <Table highlightOnHover withColumnBorders striped withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Show Name</Table.Th>
                    <Table.Th>Tickets Sold</Table.Th>
                    <Table.Th>Total Revenue ($)</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {data.map((row, idx) => (
                    <Table.Tr key={idx}>
                        <Table.Td>{row.showName}</Table.Td>
                        <Table.Td>{row.totalTicketsSold}</Table.Td>
                        <Table.Td>${row.totalRevenue.toFixed(2)}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
}
