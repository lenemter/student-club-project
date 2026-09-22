import type { AttendanceRecord } from "../types";

export const mockAttendance: AttendanceRecord[] = [
    {
        id: 1,
        clubId: 1,
        date: "2026-09-01T19:00:00Z",
        attendedUserIds: [2, 3],
    },
    {
        id: 2,
        clubId: 2,
        date: "2026-08-27T19:00:00Z",
        attendedUserIds: [1, 3, 4],
    },
    {
        id: 3,
        clubId: 1,
        date: "2026-09-03T18:00:00Z",
        attendedUserIds: [2, 1, 4],
    },
]
