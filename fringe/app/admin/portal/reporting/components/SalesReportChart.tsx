'use client';
import { Bar } from 'react-chartjs-2';
import { ShowSalesReportDto } from '@/types/api/report';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    FontSpec,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
    data: ShowSalesReportDto[];
};

export default function SalesReportChart({ data }: Props) {
    const chartData = {
        labels: data.map(d => d.showName),
        datasets: [
            {
                label: 'Revenue ($)',
                data: data.map(d => d.totalRevenue),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderRadius: 10,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `$${context.parsed.y.toLocaleString()}`;
                    },
                },
            },
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue ($)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    } as Partial<FontSpec>,
                },
                ticks: {
                    callback: (value: any) => `$${value}`,
                },
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },

    };

    return <Bar data={chartData} options={options} />;
}
