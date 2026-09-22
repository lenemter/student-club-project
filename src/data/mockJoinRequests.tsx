import type { JoinRequest } from "../types";

export const mockJoinRequests: JoinRequest[] = [
    {
        id: 1,
        userId: 1,
        clubId: 3,
        status: "pending",
        createdAt: "2026-09-01T12:00:00Z",
    },

    {
        id: 2,
        userId: 1,
        clubId: 4,
        status: "rejected",
        createdAt: "2026-08-20T09:00:00Z",
    },

    {
        id: 3,
        userId: 3,
        clubId: 1,
        status: "pending",
        createdAt: "2026-09-05T15:30:00Z",
    },

    {
        id: 4,
        userId: 4,
        clubId: 2,
        status: "approved",
        createdAt: "2026-08-01T10:00:00Z",
    },
];
