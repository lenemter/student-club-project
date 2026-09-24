import { Avatar, Typography } from "@heroui/react"
import ClubCardGrid from "../components/ClubCardGrid"
import { getUserClubs, getUserAvatarFallback, getUserById, getUserFullName } from "../data/helper"
import HeaderBar from "../components/HeaderBar"
import type { User } from "../types"
import { useParams } from "react-router-dom"

function ProfilePage() {
    const { id } = useParams<{ id: string }>()
    const user: User | undefined = getUserById(Number(id))

    if (!user) {
        return <div>Пользователь не найден</div>
    }

    return (
        <main className="bg-background min-h-screen py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <div className="w-full flex items-center gap-4">
                    <Avatar size="lg" className="size-24 sm:size-36 lg:size-48 rounded-full">
                        <Avatar.Image alt={getUserFullName(user)} src={user.avatarUrl} />
                        <Avatar.Fallback>{getUserAvatarFallback(user)}</Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <Typography type="h1">{getUserFullName(user)}</Typography>
                        <Typography type="h4">{user.aboutMe}</Typography>
                    </div>
                </div>

                <ClubCardGrid title="Мои кружки" clubs={getUserClubs(user.id)} />
            </div>
        </main>
    )
}

export default ProfilePage
