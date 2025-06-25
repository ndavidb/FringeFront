export interface ShowSalesReportDto {
    showId: number;
    showName: string;
    totalTicketsSold: number;
    totalRevenue: number;
    date?: string;
    startDate: string;
    endDate: string;
}
