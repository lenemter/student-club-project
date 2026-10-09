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
