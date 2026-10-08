import type { Membership } from "../types";

export const mockMemberships: Membership[] = [
    { id: 2, userId: 1, clubId: 2, joinedAt: "2026-01-15T00:00:00Z" },

    { id: 3, userId: 2, clubId: 1, joinedAt: "2026-01-01T00:00:00Z" },

    { id: 4, userId: 3, clubId: 3, joinedAt: "2026-01-01T00:00:00Z" },
    { id: 5, userId: 3, clubId: 2, joinedAt: "2026-02-20T00:00:00Z" },

    { id: 6, userId: 4, clubId: 4, joinedAt: "2026-01-01T00:00:00Z" },
    { id: 7, userId: 4, clubId: 1, joinedAt: "2026-03-01T00:00:00Z" },
];
