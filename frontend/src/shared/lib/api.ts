import type { AttendanceRecord, Club, JoinRequest, Membership, Notification, User } from "../types";

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
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const token = getAccessToken();

    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized by trying to refresh access token
    if (
        response.status === 401 &&
        getRefreshToken() &&
        !endpoint.includes("/auth/refresh") &&
        !endpoint.includes("/auth/login")
    ) {
        try {
            const newToken = await refreshAccessToken();
            headers["Authorization"] = `Bearer ${newToken}`;
            response = await fetch(url, { ...options, headers });
        } catch {
            clearTokens();
            throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let message = errorData.detail;
        if (!message) {
            if (response.status === 403) {
                message = "У вас нет прав для выполнения этого действия";
            } else if (response.status === 404) {
                message = "Запрошенные данные не найдены";
            } else if (response.status === 409) {
                message = "Конфликт данных";
            } else if (response.status === 422) {
                message = "Некорректный формат переданных данных";
            } else {
                message = `Ошибка запроса (код ${response.status})`;
            }
        }
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
        if (response.status === 401) {
            throw new Error("Неверный email или пароль");
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Произошла ошибка при входе");
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
        if (response.status === 409) {
            throw new Error("Пользователь с таким email уже зарегистрирован");
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Произошла ошибка при регистрации");
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

// ==========================================
// Clubs API
// ==========================================
export async function getClubsApi(): Promise<Club[]> {
    return apiFetch<Club[]>("/clubs/");
}

export async function getMyClubsApi(): Promise<Club[]> {
    return apiFetch<Club[]>("/clubs/my");
}

export async function getJoinableClubsApi(): Promise<Club[]> {
    return apiFetch<Club[]>("/clubs/joinable");
}

export async function getClubByIdApi(id: number): Promise<Club> {
    return apiFetch<Club>(`/clubs/${id}`);
}

export interface CreateClubApiDto {
    name: string;
    description?: string;
    imageUrl?: string;
    schedule?: string;
}

export async function createClubApi(dto: CreateClubApiDto): Promise<Club> {
    return apiFetch<Club>("/clubs/", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export async function updateClubApi(id: number, dto: Partial<CreateClubApiDto>): Promise<Club> {
    return apiFetch<Club>(`/clubs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
    });
}

export async function deleteClubApi(id: number): Promise<void> {
    return apiFetch<void>(`/clubs/${id}`, {
        method: "DELETE",
    });
}

export async function uploadClubImageApi(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<{ imageUrl: string }>("/clubs/upload-image", {
        method: "POST",
        body: formData,
    });
}

export async function getClubMembersApi(clubId: number): Promise<User[]> {
    return apiFetch<User[]>(`/clubs/${clubId}/members`);
}

// ==========================================
// Memberships & Join Requests API
// ==========================================
interface RawMembership {
    id: number;
    clubId?: number;
    club_id?: number;
    userId?: number;
    user_id?: number;
    joinedAt?: string;
    joined_at?: string;
}

interface RawJoinRequest {
    id: number;
    clubId?: number;
    club_id?: number;
    userId?: number;
    user_id?: number;
    status: "pending" | "approved" | "rejected";
    createdAt?: string;
    created_at?: string;
}

export async function getClubMembershipsApi(clubId: number): Promise<Membership[]> {
    const list = await apiFetch<RawMembership[]>(`/clubs/${clubId}/memberships/`);
    return (list || []).map((raw) => ({
        id: raw.id,
        clubId: (raw.clubId ?? raw.club_id) || 0,
        userId: (raw.userId ?? raw.user_id) || 0,
        joinedAt: raw.joinedAt ?? raw.joined_at ?? "",
    }));
}

export async function getMyMembershipsApi(): Promise<Membership[]> {
    const list = await apiFetch<RawMembership[]>("/users/me/memberships");
    return (list || []).map((raw) => ({
        id: raw.id,
        clubId: (raw.clubId ?? raw.club_id) || 0,
        userId: (raw.userId ?? raw.user_id) || 0,
        joinedAt: raw.joinedAt ?? raw.joined_at ?? "",
    }));
}

export async function removeMemberApi(clubId: number, userId: number): Promise<void> {
    return apiFetch<void>(`/clubs/${clubId}/members/${userId}`, {
        method: "DELETE",
    });
}

export async function getJoinRequestsApi(clubId?: number, statusFilter?: string): Promise<JoinRequest[]> {
    const params = new URLSearchParams();
    if (clubId !== undefined) params.append("club_id", String(clubId));
    if (statusFilter) params.append("status_filter", statusFilter);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const list = await apiFetch<RawJoinRequest[]>(`/join-requests/${queryString}`);
    return (list || []).map((raw) => ({
        id: raw.id,
        clubId: (raw.clubId ?? raw.club_id) || 0,
        userId: (raw.userId ?? raw.user_id) || 0,
        status: raw.status,
        createdAt: raw.createdAt ?? raw.created_at ?? "",
    }));
}

export async function createJoinRequestApi(clubId: number): Promise<JoinRequest> {
    const raw = await apiFetch<RawJoinRequest>("/join-requests/", {
        method: "POST",
        body: JSON.stringify({ club_id: clubId, clubId }),
    });
    return {
        id: raw.id,
        clubId: (raw.clubId ?? raw.club_id) || 0,
        userId: (raw.userId ?? raw.user_id) || 0,
        status: raw.status,
        createdAt: raw.createdAt ?? raw.created_at ?? "",
    };
}

export async function updateJoinRequestStatusApi(
    requestId: number,
    status: "approved" | "rejected",
): Promise<JoinRequest> {
    const raw = await apiFetch<RawJoinRequest>(`/join-requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
    return {
        id: raw.id,
        clubId: (raw.clubId ?? raw.club_id) || 0,
        userId: (raw.userId ?? raw.user_id) || 0,
        status: raw.status,
        createdAt: raw.createdAt ?? raw.created_at ?? "",
    };
}

export async function deleteJoinRequestApi(requestId: number): Promise<void> {
    return apiFetch<void>(`/join-requests/${requestId}`, {
        method: "DELETE",
    });
}

// ==========================================
// Attendance API
// ==========================================
export async function getClubAttendanceApi(clubId: number): Promise<AttendanceRecord[]> {
    return apiFetch<AttendanceRecord[]>(`/clubs/${clubId}/attendance/`);
}

export async function createAttendanceRecordApi(
    clubId: number,
    attendedUserIds: number[],
    date?: string,
): Promise<AttendanceRecord> {
    return apiFetch<AttendanceRecord>(`/clubs/${clubId}/attendance/`, {
        method: "POST",
        body: JSON.stringify({
            club_id: clubId,
            date: date || new Date().toISOString(),
            attended_user_ids: attendedUserIds,
        }),
    });
}

export async function deleteAttendanceRecordApi(recordId: number): Promise<void> {
    return apiFetch<void>(`/attendance/${recordId}`, {
        method: "DELETE",
    });
}

// ==========================================
// Users & Profile API
// ==========================================
export interface UpdateProfileApiDto {
    firstName?: string;
    lastName?: string;
    aboutMe?: string;
    avatarUrl?: string;
    password?: string;
}

export async function updateProfileApi(dto: UpdateProfileApiDto): Promise<User> {
    return apiFetch<User>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(dto),
    });
}

export async function uploadAvatarApi(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<User>("/users/me/avatar", {
        method: "POST",
        body: formData,
    });
}

export async function getUsersApi(): Promise<User[]> {
    return apiFetch<User[]>("/users/");
}

export async function getUserByIdApi(userId: number): Promise<User> {
    return apiFetch<User>(`/users/${userId}`);
}

// ==========================================
// Notifications API
// ==========================================
export async function getNotificationsApi(): Promise<Notification[]> {
    return apiFetch<Notification[]>("/notifications/");
}

export async function markNotificationReadApi(notificationId: number): Promise<Notification> {
    return apiFetch<Notification>(`/notifications/${notificationId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: true }),
    });
}

export async function deleteNotificationApi(notificationId: number): Promise<void> {
    return apiFetch<void>(`/notifications/${notificationId}`, {
        method: "DELETE",
    });
}

