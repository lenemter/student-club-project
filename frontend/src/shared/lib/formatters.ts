import type { User } from "../types";

export function getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
}

export function getUserAvatarFallback(user: User): string {
    const first = user.firstName ? user.firstName[0] : "";
    const last = user.lastName ? user.lastName[0] : "";
    return (first + last).toUpperCase() || "?";
}

export function getMemberCountText(n: number): string {
    if (n <= 0) {
        return "Нет участников";
    }

    if (n % 10 === 1 && n % 100 !== 11) {
        return `${n} участник`;
    }

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 > 20)) {
        return `${n} участника`;
    }

    return `${n} участников`;
}

export function resolveImageUrl(url?: string | null): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("data:")) {
        return url;
    }
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl && apiUrl.startsWith("http")) {
        try {
            const origin = new URL(apiUrl).origin;
            return `${origin}${cleanUrl}`;
        } catch {
            // fallback to relative
        }
    }
    return cleanUrl;
}

