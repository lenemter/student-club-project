import { createContext, useContext } from "react";
import type { User, Club, Membership, JoinRequest, Notification, AttendanceRecord } from "../../shared/types";

export interface CreateClubDto {
    name: string;
    description: string;
    schedule: string;
    imageUrl?: string;
}

export interface UpdateProfileDto {
    firstName: string;
    lastName: string;
    aboutMe: string;
    avatarUrl: string;
}

export interface StoreContextType {
    // State
    currentUser: User;
    users: User[];
    clubs: Club[];
    memberships: Membership[];
    joinRequests: JoinRequest[];
    attendanceRecords: AttendanceRecord[];
    notifications: Notification[];

    // Selectors
    getUserById: (id: number) => User | undefined;
    getClubById: (id: number) => Club | undefined;
    getUserClubs: (userId: number) => Club[];
    getJoinableClubs: () => Club[];
    getClubMembers: (clubId: number) => User[];
    getClubAttendance: (clubId: number) => AttendanceRecord[];
    getClubPendingRequests: (clubId: number) => JoinRequest[];
    getUserRequestStatusForClub: (clubId: number) => "none" | "pending" | "approved";

    // Actions (user scripts)
    createClub: (data: CreateClubDto) => Club;
    updateCurrentUser: (data: UpdateProfileDto) => void;
    login: (email: string, password?: string) => Promise<boolean> | boolean;
    signup: (user: Omit<User, "id">, password?: string) => Promise<User> | User;
    logout: () => Promise<void> | void;
    requestToJoinClub: (clubId: number) => void;
    cancelJoinRequest: (clubId: number) => void;
    leaveClub: (clubId: number) => void;
    approveJoinRequest: (requestId: number) => void;
    rejectJoinRequest: (requestId: number) => void;
    addAttendanceRecord: (clubId: number, attendedUserIds: number[]) => AttendanceRecord;
    markNotificationAsRead: (notificationId: number) => void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export function useStore(): StoreContextType {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
