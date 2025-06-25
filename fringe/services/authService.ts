import { LoginDto, TokenResponseDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, RegisterDto } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5098';

// ✅ Updated helper function for safe fetch handling
async function fetchWithErrorHandling<T>(url: string, options: RequestInit): Promise<T | void> {
    const response = await fetch(url, options);

    if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('text/plain')) {
            const errorText = await response.text();
            throw new Error(errorText);
        } else if (contentType.includes('application/json')) {
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
        } else {
            const errorText = await response.text();
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }
    }

    const text = await response.text();
    if (!text) return; // response body is empty (e.g. 204)

    try {
        return JSON.parse(text) as T;
    } catch {
        return; // silently return if response body isn't valid JSON
    }
}

// Login user
export async function loginUser(data: LoginDto): Promise<TokenResponseDto> {
    return fetchWithErrorHandling<TokenResponseDto>(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    }) as Promise<TokenResponseDto>;
}

// Refresh token
export async function refreshToken(data: RefreshTokenDto): Promise<TokenResponseDto> {
    return fetchWithErrorHandling<TokenResponseDto>(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    }) as Promise<TokenResponseDto>;
}

// Forgot password
export async function forgotPassword(data: ForgotPasswordDto): Promise<void> {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Reset password
export async function resetPassword(data: ResetPasswordDto): Promise<void> {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Register user
export async function registerUser(data: RegisterDto): Promise<void> {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}
