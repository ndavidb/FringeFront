// services/venueService.ts
import {CreateVenueDto, Venue, VenueType} from '@/types/api/venue';
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
    if (response.status === 404) {
        const errorText = await response.text();
        throw new Error(errorText || 'Venue not found or linked to another entity.');
    }


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

// Get all venues
export async function getVenues(): Promise<Venue[]> {
    return fetchWithErrorHandling<Venue[]>(`${API_BASE_URL}/api/venues`, {
        credentials: 'include'
    });
}

// Get a venue by ID
export async function getVenueById(id: number): Promise<Venue> {
    return fetchWithErrorHandling<Venue>(`${API_BASE_URL}/api/venues/${id}`, {
        credentials: 'include'
    });
}

// Create a new venue
export async function createVenue(venue: CreateVenueDto): Promise<Venue> {
    const accessToken = getCookie('accessToken') as string;

    return fetchWithErrorHandling<Venue>(`${API_BASE_URL}/api/venues`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(venue),
        credentials: 'include'
    });
}

// Update a venue
export async function updateVenue(id: number, venue: CreateVenueDto): Promise<Venue> {
    const accessToken = getCookie('accessToken') as string;
    return fetchWithErrorHandling<Venue>(`${API_BASE_URL}/api/venues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(venue),
        credentials: 'include'
    });
}

// Delete a venue
export async function deleteVenue(id: number): Promise<void> {
    const accessToken = getCookie('accessToken') as string;
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/api/venues/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include'
    });
}

// Get all venue types - Based on the ShowTypeLookupDto in your backend
export async function getVenueTypes(): Promise<VenueType[]> {
    return fetchWithErrorHandling<VenueType[]>(`${API_BASE_URL}/api/venues/venue-types`, {
        credentials: 'include'
    });
}
