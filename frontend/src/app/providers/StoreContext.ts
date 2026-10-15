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
    isLoading: boolean;

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
    createClub: (data: CreateClubDto) => Promise<Club> | Club;
    updateClub: (id: number, data: Partial<CreateClubDto>) => Promise<Club>;
    deleteClub: (id: number) => Promise<void>;
    refreshClubs: () => Promise<void>;
    updateCurrentUser: (data: UpdateProfileDto) => Promise<void> | void;
    login: (email: string, password?: string) => Promise<boolean> | boolean;
    signup: (user: Omit<User, "id">, password?: string) => Promise<User> | User;
    logout: () => Promise<void> | void;
    requestToJoinClub: (clubId: number) => Promise<void> | void;
    cancelJoinRequest: (clubId: number) => Promise<void> | void;
    leaveClub: (clubId: number) => Promise<void> | void;
    approveJoinRequest: (requestId: number) => Promise<void> | void;
    rejectJoinRequest: (requestId: number) => Promise<void> | void;
    addAttendanceRecord: (clubId: number, attendedUserIds: number[]) => Promise<AttendanceRecord> | AttendanceRecord;
    markNotificationAsRead: (notificationId: number) => Promise<void> | void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export function useStore(): StoreContextType {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
