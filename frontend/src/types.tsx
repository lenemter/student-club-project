export interface User {
    id: number;
    firstName: string;
    lastName: string;
    aboutMe: string;
    email: string;
    avatarUrl: string;
}

export interface Club {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    schedule: string;
    leaderId: number;
}

export interface Membership {
    id: number;
    userId: number;
    clubId: number;
    joinedAt: string;
}

export interface JoinRequest {
    id: number;
    userId: number;
    clubId: number;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export interface Notification {
    id: number;
    userId: number;
    title: string;
    description: string;
    createdAt: string;
    isRead: boolean;
    type: "success" | "info" | "warning";
}

export interface AttendanceRecord {
    id: number;
    clubId: number;
    date: string;
    attendedUserIds: number[];
}
