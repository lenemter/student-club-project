import type { Club, User } from "../../../shared/types";
import { currentUser, mockUsers, getUserById } from "../../user/model/mockUsers";
import { mockClubs } from "../model/mockClubs";
import { mockMemberships } from "../model/mockMemberships";

export function getUserClubs(userId: number, clubsList = mockClubs, membershipsList = mockMemberships): Club[] {
    const myClubIds = membershipsList.filter((m) => m.userId === userId).map((m) => m.clubId);
    myClubIds.push(...clubsList.filter((c) => c.leaderId === userId).map((c) => c.id));

    return clubsList.filter((c) => myClubIds.includes(c.id));
}

export function getJoinableClubs(userId = currentUser.id, clubsList = mockClubs, membershipsList = mockMemberships): Club[] {
    const myClubIds = membershipsList.filter((m) => m.userId === userId).map((m) => m.clubId);
    return clubsList.filter((c) => !myClubIds.includes(c.id) && c.leaderId !== userId);
}

export function getClubMembers(club: Club, membershipsList = mockMemberships, usersList = mockUsers): User[] {
    const result: User[] = [];

    const leader = usersList.find((u) => u.id === club.leaderId) ?? getUserById(club.leaderId);
    if (leader) {
        result.push(leader);
    }

    membershipsList.forEach((membership) => {
        if (membership.clubId === club.id) {
            const user = usersList.find((u) => u.id === membership.userId) ?? getUserById(membership.userId);
            if (user && !result.some((existing) => existing.id === user.id)) {
                result.push(user);
            }
        }
    });

    return result;
}
