'use client';
import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { ShowSalesReportDto } from '@/types/api/report';

export default function ExportButton({ data }: { data: ShowSalesReportDto[] }) {
    const handleExport = () => {
        const csvContent = [
            ['Show Name', 'Total Tickets Sold', 'Total Revenue'],
            ...data.map(row => [row.showName, row.totalTicketsSold, row.totalRevenue.toFixed(2)]),
        ]
            .map(e => e.join(','))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'show_sales_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            onClick={handleExport}
            leftSection={<IconDownload size={12} />}
            color="pink.8"
            radius="md"
            size="xs"
            style={{ maxWidth: 130, alignSelf: 'flex-end' }}
        >
            Export CSV
        </Button>

    );
}
