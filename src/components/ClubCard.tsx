import { Avatar, Button, Card } from "@heroui/react"
import { useNavigate } from "react-router-dom";
import type { Club, User } from "../types";
import { getClubMembers, getUserAvatarFallback, getUserById, getUserFullName } from "../data/helper";
import { currentUser, fallbackUser } from "../data/mockUsers";

interface ClubCardProps {
    club: Club;
}

function getMemberCountText(n: number): string {
    if (n <= 0) {
        return "Нет участников"
    }

    if (n % 10 === 1 && n % 100 !== 11) {
        return `${n} участник`
    }

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 > 20)) {
        return `${n} участника`
    }

    return `${n} участников`
}

function ClubCard({ club }: ClubCardProps) {
    const navigate = useNavigate()

    const leader: User = getUserById(club.leaderId) ?? fallbackUser

    return (
        <Button variant="ghost" onPress={() => navigate(`/club/${club.id}`)} className="w-full h-auto p-0 block text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg">
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
    )
}

export default ClubCard
