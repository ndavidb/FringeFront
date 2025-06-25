// services/fileUploadService.ts
import { getCookie } from 'cookies-next';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5098';

interface UploadResponse {
    path: string;
    fileName?: string;
    size?: number;
}

/**
 * Uploads a file to the server
 * @param file The file to upload
 * @param type The type of upload (venue, show, etc.)
 * @returns The path to the uploaded file
 */
export async function uploadFile(file: File, type: 'venue' | 'show' = 'venue'): Promise<string> {
    const accessToken = getCookie('accessToken') as string;

    if (!accessToken) {
        throw new Error('Authentication required');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Send the request
    const response = await fetch(`${API_BASE_URL}/api/FileUpload/${type}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    // Handle errors
    if (!response.ok) {
        let errorMessage = `Failed to upload file: ${response.status} ${response.statusText}`;

        try {
            // Try to parse error response
            const errorData = await response.json();
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (e) {
            console.log('Error while uploading file', e);
        }

        throw new Error(errorMessage);
    }

    // Parse the response
    const data: UploadResponse = await response.json();

    // Return the file path
    return data.path;
}

/**
 * Get a full URL for an uploaded file
 * @param path Relative path to the file
 * @returns Full URL to the file
 */
export function getFileUrl(path: string): string {
    // Log for debugging
    console.log(`getFileUrl called with path: "${path}"`);

    if (!path) {
        console.warn('getFileUrl called with empty path');
        return '';
    }

    // If it's already a full URL, return it
    if (path.startsWith('http')) {
        console.log(`Path is already a full URL: ${path}`);
        return path;
    }

    const baseUrl = API_BASE_URL;
    let fullUrl: string;

    // If it's a relative path, prepend the API base URL
    if (path.startsWith('/')) {
        fullUrl = `${baseUrl}${path}`;
    } else {
        // If it's a relative path without leading slash, add it
        fullUrl = `${baseUrl}/${path}`;
    }

    console.log(`Constructed URL: ${fullUrl}`);
    return fullUrl;
}