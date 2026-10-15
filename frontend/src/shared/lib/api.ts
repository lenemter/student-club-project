import type { User } from "../types";

const ACCESS_TOKEN_KEY = "student_clubs_access_token";
const REFRESH_TOKEN_KEY = "student_clubs_refresh_token";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

interface TokenResponse {
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
    tokenType?: string;
    token_type?: string;
}

export async function refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearTokens();
        throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
        clearTokens();
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Refresh token expired or revoked");
    }

    const data: TokenResponse = await response.json();
    const newAccess = data.access_token || data.accessToken || "";
    const newRefresh = data.refresh_token || data.refreshToken || refreshToken;

    setTokens(newAccess, newRefresh);
    return newAccess;
}

export async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const token = getAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized by trying to refresh access token
    if (response.status === 401 && getRefreshToken() && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
        try {
            const newToken = await refreshAccessToken();
            headers["Authorization"] = `Bearer ${newToken}`;
            response = await fetch(url, { ...options, headers });
        } catch {
            clearTokens();
            throw new Error("Session expired. Please log in again.");
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || `Request failed with status ${response.status}`;
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

export async function loginApi(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Неверный email или пароль");
    }

    const tokenData: TokenResponse = await response.json();
    const access = tokenData.access_token || tokenData.accessToken || "";
    const refresh = tokenData.refresh_token || tokenData.refreshToken || "";

    setTokens(access, refresh);

    // Fetch current user from protected endpoint
    const user = await apiFetch<User>("/users/me");
    return user;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    aboutMe?: string;
    avatarUrl?: string;
}

export async function registerApi(dto: RegisterDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Ошибка регистрации");
    }

    const tokenData: TokenResponse = await response.json();
    const access = tokenData.access_token || tokenData.accessToken || "";
    const refresh = tokenData.refresh_token || tokenData.refreshToken || "";

    setTokens(access, refresh);

    // Fetch current user from protected endpoint
    const user = await apiFetch<User>("/users/me");
    return user;
}

export async function logoutApi(): Promise<void> {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
        } catch {
            // Ignore network errors on logout
        }
    }
    clearTokens();
}

export async function getCurrentUserApi(): Promise<User | null> {
    const token = getAccessToken();
    if (!token && !getRefreshToken()) {
        return null;
    }
    try {
        return await apiFetch<User>("/users/me");
    } catch {
        return null;
    }
}
