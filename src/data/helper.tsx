import { currentUser, mockUsers } from "./mockUsers";
import { mockClubs } from "./mockClubs";
import { mockMemberships } from "./mockMemberships";
import type { Club, User } from "../types";

export function getUserById(id: number) {
    return mockUsers.find((u) => u.id === id);
}

export function getUserFullName(user: User): string {
    return user.firstName + " " + user.lastName
}

export function getUserAvatarFallback(user: User): string {
    return user.firstName[0] + user.lastName[0]
}

export function getUserClubs(userId: number): Club[] {
    const myClubIds = mockMemberships
        .filter((m) => m.userId === userId)
        .map((m) => m.clubId)
    myClubIds.push(...mockClubs.filter((c) => c.leaderId === userId).map((c) => c.id))

    return mockClubs.filter((c) => myClubIds.includes(c.id));
}

export function getJoinableClubs(): Club[] {
    const myClubIds = mockMemberships
        .filter((m) => m.userId === currentUser.id)
        .map((m) => m.clubId);
    return mockClubs.filter((c) => !myClubIds.includes(c.id));
}

export function getClubMembers(club: Club): User[] {
    const result: User[] = []

    const leader = getUserById(club.leaderId)
    if (leader) {
        result.push(leader)
    }

    mockMemberships.forEach(membership => {
        if (membership.clubId == club.id) {
            const user = getUserById(membership.userId)
            if (user) {
                result.push(user)
            }
        }
    });

    return result
}
