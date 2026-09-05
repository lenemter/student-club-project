import { Avatar, Typography } from "@heroui/react"
import ClubCardGrid from "../components/ClubCardGrid"
import { mockJoinedCards } from "../data/mockClubs"
import HeaderBar from "../components/HeaderBar"

function ProfilePage() {
    return (
        <main className="bg-background min-h-screen py-8 flex flex-col items-center gap-5">

            <div className="flex justify-end w-full max-w-5xl p-4 mx-auto rounded-xl">
                <HeaderBar />
            </div>

            <div className="flex gap-4 w-full max-w-5xl p-4 mx-auto rounded-xl items-center">
                <Avatar size="lg" className="size-24 sm:size-36 lg:size-48 rounded-full">
                    <Avatar.Fallback>ЛК</Avatar.Fallback>
                    <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                </Avatar>
                <div className="flex flex-col gap-2">
                    <Typography type="h1">Имя Фамилия</Typography>
                    <Typography type="h4">3 курс</Typography>
                </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto p-4 rounded-xl">
                <ClubCardGrid title="Мои кружки" cards={mockJoinedCards} />
            </div>

        </main>
    )
}

export default ProfilePage
