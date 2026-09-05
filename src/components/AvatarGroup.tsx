import { Avatar } from "@heroui/react"
import { mockMembers } from "../data/mockClubMembers"

function AvatarGroup() {
    return (
        <div className="flex -space-x-2">
            {mockMembers.slice(0, 3).map((user) => (
                <Avatar key={user.id} className="ring-2 ring-background">
                    <Avatar.Image alt={user.name} src={user.image} />
                    <Avatar.Fallback>
                    {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar.Fallback>
                </Avatar>
            ))}
            <Avatar className="ring-2 ring-background">
                <Avatar.Fallback className="text-xs">+{mockMembers.length - 3}</Avatar.Fallback>
            </Avatar>
        </div>
    )
}

export default AvatarGroup
