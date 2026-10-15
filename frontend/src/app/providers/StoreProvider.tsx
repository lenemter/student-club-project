import { useEffect, useState, type ReactNode } from "react";
import type { User, Club, Membership, JoinRequest, Notification, AttendanceRecord } from "../../shared/types";
import { mockUsers as initialUsers, currentUser as initialCurrentUser } from "../../entities/user/model/mockUsers";
import { mockClubs as initialClubs } from "../../entities/club/model/mockClubs";
import { mockMemberships as initialMemberships } from "../../entities/club/model/mockMemberships";
import { mockJoinRequests as initialJoinRequests } from "../../entities/join-request/model/mockJoinRequests";
import { mockAttendance as initialAttendance } from "../../entities/attendance/model/mockAttendance";
import { mockNotifications as initialNotifications } from "../../entities/notification/model/mockNotifications";
import { StoreContext, type CreateClubDto, type UpdateProfileDto } from "./StoreContext";
import {
    createAttendanceRecordApi,
    createClubApi,
    createJoinRequestApi,
    deleteClubApi,
    deleteJoinRequestApi,
    getAccessToken,
    getClubsApi,
    getCurrentUserApi,
    getJoinRequestsApi,
    getMyMembershipsApi,
    getNotificationsApi,
    getUsersApi,
    loginApi,
    logoutApi,
    markNotificationReadApi,
    registerApi,
    removeMemberApi,
    updateClubApi,
    updateJoinRequestStatusApi,
    updateProfileApi,
} from "../../shared/lib";

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

    // Refresh clubs and users from backend
    const refreshClubs = async (): Promise<void> => {
        try {
            const loadedClubs = await getClubsApi();
            if (loadedClubs) {
                setClubs(loadedClubs);
            }
        } catch {
            // Ignore offline errors
        }
    };

    const refreshData = async (): Promise<void> => {
        try {
            const [loadedClubs, loadedUsers] = await Promise.all([
                getClubsApi().catch(() => null),
                getUsersApi().catch(() => null),
            ]);
            if (loadedClubs && loadedClubs.length > 0) {
                setClubs(loadedClubs);
            }
            if (loadedUsers && loadedUsers.length > 0) {
                setUsers(loadedUsers);
            }

            if (getAccessToken()) {
                const [myMemberships, requests, notifs] = await Promise.all([
                    getMyMembershipsApi().catch(() => null),
                    getJoinRequestsApi().catch(() => null),
                    getNotificationsApi().catch(() => null),
                ]);
                if (myMemberships) setMemberships(myMemberships);
                if (requests) setJoinRequests(requests);
                if (notifs) setNotifications(notifs);
            }
        } catch {
            // Ignore network errors
        }
    };

    // Restore authenticated session and load backend data on mount
    useEffect(() => {
        getCurrentUserApi()
            .then((user) => {
                if (user) {
                    setCurrentUser(user);
                }
            })
            .catch(() => {})
            .finally(() => {
                refreshData();
            });
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
    const createClub = async (data: CreateClubDto): Promise<Club> => {
        try {
            const newClub = await createClubApi({
                name: data.name.trim(),
                description: data.description.trim(),
                schedule: data.schedule.trim(),
                imageUrl: data.imageUrl,
            });
            setClubs((prev) => [newClub, ...prev.filter((c) => c.id !== newClub.id)]);

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
        } catch {
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
        }
    };

    const updateClub = async (id: number, data: Partial<CreateClubDto>): Promise<Club> => {
        try {
            const updated = await updateClubApi(id, data);
            setClubs((prev) => prev.map((c) => (c.id === id ? updated : c)));
            return updated;
        } catch {
            setClubs((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
            );
            const found = clubs.find((c) => c.id === id);
            return found ? { ...found, ...data } : (data as Club);
        }
    };

    const deleteClub = async (id: number): Promise<void> => {
        try {
            await deleteClubApi(id);
        } finally {
            setClubs((prev) => prev.filter((c) => c.id !== id));
        }
    };


    const updateCurrentUser = async (data: UpdateProfileDto): Promise<void> => {
        try {
            const updated = await updateProfileApi({
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                aboutMe: data.aboutMe.trim(),
                avatarUrl: data.avatarUrl,
            });
            setCurrentUser(updated);
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        } catch {
            const updated: User = {
                ...currentUser,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                aboutMe: data.aboutMe.trim(),
                avatarUrl: data.avatarUrl,
            };
            setCurrentUser(updated);
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        }
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

    const requestToJoinClub = async (clubId: number): Promise<void> => {
        const existing = joinRequests.find(
            (r) => r.clubId === clubId && r.userId === currentUser.id && r.status === "pending",
        );
        if (existing) return;

        try {
            const newRequest = await createJoinRequestApi(clubId);
            setJoinRequests((prev) => [newRequest, ...prev.filter((r) => r.id !== newRequest.id)]);
        } catch {
            const fallback: JoinRequest = {
                id: Date.now(),
                clubId,
                userId: currentUser.id,
                status: "pending",
                createdAt: new Date().toISOString(),
            };
            setJoinRequests((prev) => [fallback, ...prev]);
        }
    };

    const cancelJoinRequest = async (clubId: number): Promise<void> => {
        const existing = joinRequests.find(
            (r) => r.clubId === clubId && r.userId === currentUser.id && r.status === "pending",
        );
        if (existing) {
            try {
                await deleteJoinRequestApi(existing.id);
            } catch {
                // Ignore API error on cancel
            }
        }
        setJoinRequests((prev) =>
            prev.filter((r) => !(r.clubId === clubId && r.userId === currentUser.id && r.status === "pending")),
        );
    };

    const leaveClub = async (clubId: number): Promise<void> => {
        try {
            await removeMemberApi(clubId, currentUser.id);
        } catch {
            // Ignore API error on leave
        }
        setMemberships((prev) =>
            prev.filter((m) => !(m.clubId === clubId && m.userId === currentUser.id)),
        );
        setJoinRequests((prev) =>
            prev.filter((r) => !(r.clubId === clubId && r.userId === currentUser.id)),
        );
    };

    const approveJoinRequest = async (requestId: number): Promise<void> => {
        const req = joinRequests.find((r) => r.id === requestId);
        try {
            await updateJoinRequestStatusApi(requestId, "approved");
            if (req) {
                const newMembership: Membership = {
                    id: Date.now(),
                    clubId: req.clubId,
                    userId: req.userId,
                    joinedAt: new Date().toISOString(),
                };
                setMemberships((prev) => [...prev, newMembership]);
            }
        } catch {
            if (req) {
                const newMembership: Membership = {
                    id: Date.now(),
                    clubId: req.clubId,
                    userId: req.userId,
                    joinedAt: new Date().toISOString(),
                };
                setMemberships((prev) => [...prev, newMembership]);
            }
        } finally {
            setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
        }
    };

    const rejectJoinRequest = async (requestId: number): Promise<void> => {
        try {
            await updateJoinRequestStatusApi(requestId, "rejected");
        } catch {
            // Ignore error
        } finally {
            setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
        }
    };

    const addAttendanceRecord = async (
        clubId: number,
        attendedUserIds: number[],
    ): Promise<AttendanceRecord> => {
        try {
            const record = await createAttendanceRecordApi(clubId, attendedUserIds);
            setAttendanceRecords((prev) => [record, ...prev]);
            return record;
        } catch {
            const record: AttendanceRecord = {
                id: Date.now(),
                clubId,
                date: new Date().toISOString(),
                attendedUserIds,
            };
            setAttendanceRecords((prev) => [record, ...prev]);
            return record;
        }
    };

    const markNotificationAsRead = async (notificationId: number): Promise<void> => {
        try {
            await markNotificationReadApi(notificationId);
        } catch {
            // Ignore error
        }
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
                updateClub,
                deleteClub,
                refreshClubs,
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
