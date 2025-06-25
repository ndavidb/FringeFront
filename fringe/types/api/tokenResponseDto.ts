export interface TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    userId: string;
    email: string;
    roles: string[];
}