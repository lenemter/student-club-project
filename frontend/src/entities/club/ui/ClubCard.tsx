import { Avatar, Button, Card } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import type { Club, User } from "../../../shared/types";
import { getMemberCountText, getUserAvatarFallback, getUserFullName } from "../../../shared/lib/formatters";
import { getUserById, fallbackUser } from "../../user/model/mockUsers";
import { getClubMembers } from "../lib/clubHelpers";

export interface ClubCardProps {
    club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
    const navigate = useNavigate();

    const leader: User = getUserById(club.leaderId) ?? fallbackUser;

    return (
        <Button
            variant="ghost"
            onPress={() => navigate(`/club/${club.id}`)}
            className="w-full h-auto p-0 block text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-border"
        >
            <Card>
                <img
                    alt={club.name}
                    className="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
                    loading="lazy"
                    src={club.imageUrl}
                />

                <Card.Header>
                    <Card.Title>{club.name}</Card.Title>
                    <Card.Description>{getMemberCountText(getClubMembers(club).length)}</Card.Description>
                </Card.Header>

                <Card.Footer className="flex gap-2">
                    <Avatar className="size-5">
                        <Avatar.Image alt={getUserFullName(leader)} src={leader.avatarUrl} />
                        <Avatar.Fallback className="text-xs">{getUserAvatarFallback(leader)}</Avatar.Fallback>
                    </Avatar>
                    <span className="text-xs">{getUserFullName(leader)}</span>
                </Card.Footer>
            </Card>
        </Button>
    );
}

export default ClubCard;
