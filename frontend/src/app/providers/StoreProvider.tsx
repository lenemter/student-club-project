import { useEffect, useState, type ReactNode } from "react";
import type { User, Club, Membership, JoinRequest, Notification, AttendanceRecord } from "../../shared/types";
import { mockUsers as initialUsers, currentUser as initialCurrentUser } from "../../entities/user/model/mockUsers";
import { mockClubs as initialClubs } from "../../entities/club/model/mockClubs";
import { mockMemberships as initialMemberships } from "../../entities/club/model/mockMemberships";
import { mockJoinRequests as initialJoinRequests } from "../../entities/join-request/model/mockJoinRequests";
import { mockAttendance as initialAttendance } from "../../entities/attendance/model/mockAttendance";
import { mockNotifications as initialNotifications } from "../../entities/notification/model/mockNotifications";
import { StoreContext, type CreateClubDto, type UpdateProfileDto } from "./StoreContext";
import { getCurrentUserApi, loginApi, logoutApi, registerApi } from "../../shared/lib";

const STORAGE_KEY_PREFIX = "student_clubs_";

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage<T>(key: string, value: T): void {
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch {
        // Ignore localStorage quota errors
    }
}

export function StoreProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>(() => loadFromStorage("users", initialUsers));
    const [currentUser, setCurrentUser] = useState<User>(() =>
        loadFromStorage("current_user", initialCurrentUser),
    );
    const [clubs, setClubs] = useState<Club[]>(() => loadFromStorage("clubs", initialClubs));
    const [memberships, setMemberships] = useState<Membership[]>(() =>
        loadFromStorage("memberships", initialMemberships),
    );
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(() =>
        loadFromStorage("join_requests", initialJoinRequests),
    );
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
        loadFromStorage("attendance", initialAttendance),
    );
    const [notifications, setNotifications] = useState<Notification[]>(() =>
        loadFromStorage("notifications", initialNotifications),
    );

    // LocalStorage
    useEffect(() => saveToStorage("users", users), [users]);
    useEffect(() => saveToStorage("current_user", currentUser), [currentUser]);
    useEffect(() => saveToStorage("clubs", clubs), [clubs]);
    useEffect(() => saveToStorage("memberships", memberships), [memberships]);
    useEffect(() => saveToStorage("join_requests", joinRequests), [joinRequests]);
    useEffect(() => saveToStorage("attendance", attendanceRecords), [attendanceRecords]);
    useEffect(() => saveToStorage("notifications", notifications), [notifications]);

    // Restore authenticated session from backend if tokens exist
    useEffect(() => {
        getCurrentUserApi()
            .then((user) => {
                if (user) {
                    setCurrentUser(user);
                }
            })
            .catch(() => {});
    }, []);

    // Selectors
    const getUserById = (id: number): User | undefined => {
        return users.find((u) => u.id === id);
    };

    const getClubById = (id: number): Club | undefined => {
        return clubs.find((c) => c.id === id);
    };

    const getUserClubs = (userId: number): Club[] => {
        const myClubIds = memberships.filter((m) => m.userId === userId).map((m) => m.clubId);
        const leaderClubIds = clubs.filter((c) => c.leaderId === userId).map((c) => c.id);
        const allIds = Array.from(new Set([...myClubIds, ...leaderClubIds]));
        return clubs.filter((c) => allIds.includes(c.id));
    };

    const getJoinableClubs = (): Club[] => {
        const myClubIds = memberships.filter((m) => m.userId === currentUser.id).map((m) => m.clubId);
        return clubs.filter((c) => !myClubIds.includes(c.id) && c.leaderId !== currentUser.id);
    };

    const getClubMembers = (clubId: number): User[] => {
        const club = getClubById(clubId);
        if (!club) return [];

        const result: User[] = [];
        const leader = getUserById(club.leaderId);
        if (leader) result.push(leader);

        memberships
            .filter((m) => m.clubId === clubId)
            .forEach((m) => {
                const user = getUserById(m.userId);
                if (user && !result.some((existing) => existing.id === user.id)) {
                    result.push(user);
                }
            });

        return result;
    };

    const getClubAttendance = (clubId: number): AttendanceRecord[] => {
        return attendanceRecords.filter((a) => a.clubId === clubId);
    };

    const getClubPendingRequests = (clubId: number): JoinRequest[] => {
        return joinRequests.filter((r) => r.clubId === clubId && r.status === "pending");
    };

    const getUserRequestStatusForClub = (clubId: number): "none" | "pending" | "approved" => {
        const isMember = memberships.some((m) => m.clubId === clubId && m.userId === currentUser.id);
        if (isMember) return "approved";

        const req = joinRequests.find((r) => r.clubId === clubId && r.userId === currentUser.id);
        if (req && req.status === "pending") return "pending";

        return "none";
    };

    // Actions (user scripts)
    const createClub = (data: CreateClubDto): Club => {
        const newClub: Club = {
            id: Date.now(),
            name: data.name.trim(),
            description: data.description.trim(),
            schedule: data.schedule.trim(),
            imageUrl:
                data.imageUrl ||
                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg",
            leaderId: currentUser.id,
        };

        setClubs((prev) => [newClub, ...prev]);

        const newNotification: Notification = {
            id: Date.now(),
            userId: currentUser.id,
            title: "Кружок создан",
            description: `Вы успешно создали кружок «${newClub.name}»`,
            createdAt: "Только что",
            isRead: false,
            type: "success",
        };
        setNotifications((prev) => [newNotification, ...prev]);

        return newClub;
    };

    const updateCurrentUser = (data: UpdateProfileDto): void => {
        const updated: User = {
            ...currentUser,
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            aboutMe: data.aboutMe.trim(),
            avatarUrl: data.avatarUrl,
        };

        setCurrentUser(updated);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    };

    const login = async (email: string, password?: string): Promise<boolean> => {
        if (password) {
            const user = await loginApi(email, password);
            setCurrentUser(user);
            setUsers((prev) =>
                prev.some((u) => u.id === user.id) ? prev.map((u) => (u.id === user.id ? user : u)) : [...prev, user],
            );
            return true;
        }

        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
            setCurrentUser(found);
            return true;
        }
        return false;
    };

    const signup = async (userData: Omit<User, "id">, password?: string): Promise<User> => {
        if (password) {
            const user = await registerApi({
                email: userData.email,
                password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                aboutMe: userData.aboutMe,
                avatarUrl: userData.avatarUrl,
            });
            setUsers((prev) =>
                prev.some((u) => u.id === user.id) ? prev.map((u) => (u.id === user.id ? user : u)) : [...prev, user],
            );
            setCurrentUser(user);
            return user;
        }

        const newUser: User = {
            ...userData,
            id: Date.now(),
        };

        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        return newUser;
    };

    const logout = async (): Promise<void> => {
        await logoutApi();
        localStorage.removeItem(STORAGE_KEY_PREFIX + "current_user");
        setCurrentUser(initialCurrentUser);
    };

    const requestToJoinClub = (clubId: number): void => {
        const existing = joinRequests.find(
            (r) => r.clubId === clubId && r.userId === currentUser.id && r.status === "pending",
        );
        if (existing) return;

        const newRequest: JoinRequest = {
            id: Date.now(),
            clubId,
            userId: currentUser.id,
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        setJoinRequests((prev) => [newRequest, ...prev]);

        const club = getClubById(clubId);
        if (club && club.leaderId !== currentUser.id) {
            const notif: Notification = {
                id: Date.now() + 1,
                userId: club.leaderId,
                title: "Новая заявка на вступление",
                description: `${currentUser.firstName} ${currentUser.lastName} хочет вступить в «${club.name}»`,
                createdAt: "Только что",
                isRead: false,
                type: "info",
            };
            setNotifications((prev) => [notif, ...prev]);
        }
    };

    const cancelJoinRequest = (clubId: number): void => {
        setJoinRequests((prev) =>
            prev.filter((r) => !(r.clubId === clubId && r.userId === currentUser.id && r.status === "pending")),
        );
    };

    const leaveClub = (clubId: number): void => {
        setMemberships((prev) =>
            prev.filter((m) => !(m.clubId === clubId && m.userId === currentUser.id)),
        );
        setJoinRequests((prev) =>
            prev.filter((r) => !(r.clubId === clubId && r.userId === currentUser.id)),
        );
    };

    const approveJoinRequest = (requestId: number): void => {
        const req = joinRequests.find((r) => r.id === requestId);
        if (!req) return;

        const newMembership: Membership = {
            id: Date.now(),
            clubId: req.clubId,
            userId: req.userId,
            joinedAt: new Date().toISOString(),
        };

        setMemberships((prev) => [...prev, newMembership]);
        setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));

        const club = getClubById(req.clubId);
        const notif: Notification = {
            id: Date.now() + 2,
            userId: req.userId,
            title: "Заявка одобрена",
            description: `Вы приняты в кружок «${club?.name ?? ""}»`,
            createdAt: "Только что",
            isRead: false,
            type: "success",
        };
        setNotifications((prev) => [notif, ...prev]);
    };

    const rejectJoinRequest = (requestId: number): void => {
        const req = joinRequests.find((r) => r.id === requestId);
        setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));

        if (req) {
            const club = getClubById(req.clubId);
            const notif: Notification = {
                id: Date.now() + 3,
                userId: req.userId,
                title: "Заявка отклонена",
                description: `Руководитель кружка «${club?.name ?? ""}» отклонил заявку`,
                createdAt: "Только что",
                isRead: false,
                type: "warning",
            };
            setNotifications((prev) => [notif, ...prev]);
        }
    };

    const addAttendanceRecord = (clubId: number, attendedUserIds: number[]): AttendanceRecord => {
        const record: AttendanceRecord = {
            id: Date.now(),
            clubId,
            date: new Date().toISOString(),
            attendedUserIds,
        };

        setAttendanceRecords((prev) => [record, ...prev]);
        return record;
    };

    const markNotificationAsRead = (notificationId: number): void => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
        );
    };

    return (
        <StoreContext.Provider
            value={{
                currentUser,
                users,
                clubs,
                memberships,
                joinRequests,
                attendanceRecords,
                notifications,
                getUserById,
                getClubById,
                getUserClubs,
                getJoinableClubs,
                getClubMembers,
                getClubAttendance,
                getClubPendingRequests,
                getUserRequestStatusForClub,
                createClub,
                updateCurrentUser,
                login,
                signup,
                logout,
                requestToJoinClub,
                cancelJoinRequest,
                leaveClub,
                approveJoinRequest,
                rejectJoinRequest,
                addAttendanceRecord,
                markNotificationAsRead,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export default StoreProvider;
