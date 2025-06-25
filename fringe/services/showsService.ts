import { Show, CreateShowDto, UpdateShowDto, AgeRestrictionDto, ShowTypeLookupDto } from '@/types/api';
import {getCookie} from "cookies-next";

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

        // Handle plain text responses (which is what your error is)
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

// Get all shows
export async function getShows(): Promise<Show[]> {
    return fetchWithErrorHandling<Show[]>(`${API_BASE_URL}/api/shows`, {
        credentials: 'include'
    });
}

// Get a show by ID
export async function getShowById(id: number): Promise<Show> {
    return fetchWithErrorHandling<Show>(`${API_BASE_URL}/api/shows/${id}`, {
        credentials: 'include'
    });
}

// Create a new show
export async function createShow(show: CreateShowDto): Promise<Show> {
    console.log(show);
    return fetchWithErrorHandling<Show>(`${API_BASE_URL}/api/shows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(show),
        credentials: 'include'
    });
}

// Update a show
export async function updateShow(id: number, show: UpdateShowDto): Promise<Show> {
    return fetchWithErrorHandling<Show>(`${API_BASE_URL}/api/shows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(show),
        credentials: 'include'
    });
}

// Delete a show
export async function deleteShow(id: number): Promise<void> {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/api/shows/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
}

// Get all age restrictions
export async function getAgeRestrictions(): Promise<AgeRestrictionDto[]> {
    return fetchWithErrorHandling<AgeRestrictionDto[]>(`${API_BASE_URL}/api/shows/age-restrictions`, {
        credentials: 'include'
    });
}

// Get all show types
export async function getShowTypes(): Promise<ShowTypeLookupDto[]> {
    return fetchWithErrorHandling<ShowTypeLookupDto[]>(`${API_BASE_URL}/api/shows/show-types`, {
        credentials: 'include'
    });
}