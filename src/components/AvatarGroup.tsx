import { Avatar } from "@heroui/react"
import type { User } from "../types";
import { getUserAvatarFallback, getUserFullName } from "../data/helper";

export interface AvatarGroupProps {
    users: User[];
}

function AvatarGroup({ users }: AvatarGroupProps) {
    const NUM_USERS = 3

    return (
        <div className="flex -space-x-2">
            {users.slice(0, NUM_USERS).map((user) => (
                <Avatar key={user.id} className="ring-2 ring-background">
                    <Avatar.Image alt={getUserFullName(user)} src={user.avatarUrl} />
                    <Avatar.Fallback>{getUserAvatarFallback(user)}</Avatar.Fallback>
                </Avatar>
            ))}

            {users.length - NUM_USERS > 0 ? (
                <Avatar className="ring-2 ring-background">
                    <Avatar.Fallback className="text-xs">+{users.length - 3}</Avatar.Fallback>
                </Avatar>
            ) : <></>}


        </div>
    )
}

export default AvatarGroup
