// contexts/auth-context.tsx
'use client';

import React, {createContext, useContext, useState, useEffect, ReactNode, useCallback} from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { loginUser } from '@/services/authService';

// Define the token response type
type TokenResponse = {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    userId: string;
    email: string;
    roles: string[];
};

// Define the auth context type
type AuthContextType = {
    user: TokenResponse | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (roleName: string) => boolean;
    isAdmin: boolean; // New property to quickly check admin role
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
    children: ReactNode;
};

// Create the auth provider
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<TokenResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(() => {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('user');
        setUser(null);
        router.push('/admin/login');
    }, [router]);

    // Check if the user is authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            const accessToken = getCookie('accessToken');
            const storedUser = getCookie('user');

            if (accessToken && storedUser) {
                try {
                    setUser(JSON.parse(storedUser as string));
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    logout();
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, [logout]);

    // Role checking function
    const hasRole = (roleName: string): boolean => {
        if (!user || !user.roles) return false;
        return user.roles.includes(roleName);
    };

    // IsAdmin helper
    const isAdmin = hasRole('Admin');

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await loginUser({
                email,
                password,
            });

            // Check if user has the Admin role
            if (!response.roles.includes('Admin')) {
                router.push('/');
            }

            // Set cookies
            setCookie('accessToken', response.accessToken, {
                maxAge: 60 * 60, // 60 minutes
                path: '/',
                sameSite: 'strict',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production'
            });

            setCookie('refreshToken', response.refreshToken, {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
                sameSite: 'strict',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production'
            });

            // Store user data
            setCookie('user', JSON.stringify(response), {
                maxAge: 60 * 60, // 60 minutes
                path: '/',
                sameSite: 'strict',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production'
            });

            setUser(response);
            router.push('/admin/portal');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}