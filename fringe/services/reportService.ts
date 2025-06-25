import { ShowSalesReportDto } from '@/types/api/report'; // Assuming this type exists
import { getCookie } from 'cookies-next';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5098';

function getAuthHeaders(): HeadersInit {
    const accessToken = getCookie('accessToken') as string;
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
}

async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options.headers as HeadersInit)
    });

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (response.status === 404) {
        throw new Error(await response.text() || 'Not found');
    }

    if (!response.ok) {
        const type = response.headers.get('content-type') || '';
        const content = type.includes('application/json')
            ? await response.json()
            : await response.text();

        const message =
            typeof content === 'string'
                ? content
                : content.message || content.title || content.detail || JSON.stringify(content);

        throw new Error(`API Error: ${message}`);
    }

    return response.status === 204 ? null as unknown as T : response.json();
}

export async function getSalesReport(): Promise<ShowSalesReportDto[]> {
    return fetchApi<ShowSalesReportDto[]>(`${API_BASE_URL}/api/Report/show-sales`);
}

// Added axios-based version for date-range filtering
export async function getShowSalesReport(startDate?: Date, endDate?: Date): Promise<ShowSalesReportDto[]> {
    const params: Record<string, string> = {};
    if (startDate) {
        params.startDate = startDate.toISOString();
    }
    if (endDate) {
        params.endDate = endDate.toISOString();
    }

    const response = await axios.get(`${API_BASE_URL}/api/Report/show-sales`, {
        params,
    });
    return response.data;
}
