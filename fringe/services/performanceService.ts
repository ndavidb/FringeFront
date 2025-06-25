// services/performanceService.ts
import {
    Performance,
    BatchCreatePerformanceDto,
    CreatePerformanceDto,
    UpdatePerformanceDto
} from '@/types/api';
import { getCookie } from 'cookies-next';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5098';

// Helper function for fetch requests
async function fetchWithErrorHandling<T>(url: string, options: RequestInit): Promise<T> {
    const accessToken = getCookie('accessToken') as string;

    const headers = new Headers(options.headers || {
        'Content-Type': 'application/json'
    });

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const enhancedOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include' as RequestCredentials
    };

    const response = await fetch(url, enhancedOptions);

    if (!response.ok) {
        // Get the content type to determine how to handle the response
        const contentType = response.headers.get('content-type') || '';

        // Handle plain text responses
        if (contentType.includes('text/plain')) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Handle JSON responses for other error types
        else if (contentType.includes('application/json')) {
            const errorData = await response.json();
            if (typeof errorData === 'string') {
                throw new Error(errorData);
            } else if (errorData.message) {
                throw new Error(errorData.message);
            } else if (errorData.title) {
                throw new Error(errorData.title);
            } else if (errorData.detail) {
                throw new Error(errorData.detail);
            } else {
                throw new Error(JSON.stringify(errorData));
            }
        }

        // Fallback for other content types
        else {
            const errorText = await response.text();
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }
    }

    if (response.status === 204) {
        return (null as unknown) as T;
    }

    return response.json() as Promise<T>;
}

// Get all performances
export async function getPerformances(): Promise<Performance[]> {
    return fetchWithErrorHandling<Performance[]>(`${API_BASE_URL}/api/Performances`, {
        credentials: 'include'
    });
}

// Get performances by show ID
export async function getPerformancesByShowId(showId: number): Promise<Performance[]> {
    return fetchWithErrorHandling<Performance[]>(`${API_BASE_URL}/api/Performances/show/${showId}`, {
        credentials: 'include'
    });
}

// Get a performance by ID
export async function getPerformanceById(id: number): Promise<Performance> {
    return fetchWithErrorHandling<Performance>(`${API_BASE_URL}/api/Performances/${id}`, {
        credentials: 'include'
    });
}

// Create a new performance
export async function createPerformance(performance: CreatePerformanceDto): Promise<Performance> {
    return fetchWithErrorHandling<Performance>(`${API_BASE_URL}/api/Performances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performance),
        credentials: 'include'
    });
}

// Batch create performances
export async function batchCreatePerformances(performances: BatchCreatePerformanceDto): Promise<Performance[]> {
    return fetchWithErrorHandling<Performance[]>(`${API_BASE_URL}/api/Performances/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performances),
        credentials: 'include'
    });
}

// Update a performance
export async function updatePerformance(id: number, performance: UpdatePerformanceDto): Promise<Performance> {
    return fetchWithErrorHandling<Performance>(`${API_BASE_URL}/api/Performances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performance),
        credentials: 'include'
    });
}

// Delete a performance
export async function deletePerformance(id: number): Promise<void> {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/api/Performances/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
}