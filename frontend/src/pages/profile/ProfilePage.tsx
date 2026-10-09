import { Avatar, Typography } from "@heroui/react";
import { useParams } from "react-router-dom";
import { ClubCardGrid, getUserClubs } from "../../entities/club";
import { HeaderBar } from "../../shared/ui";
import { getUserById, currentUser } from "../../entities/user";
import { getUserAvatarFallback, getUserFullName } from "../../shared/lib/formatters";
import type { User } from "../../shared/types";
import { NotFoundPage } from "../not-found/NotFoundPage";

export function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const user: User | undefined = getUserById(Number(id));

    if (!user) {
        return <NotFoundPage message="Пользователь не найден" />;
    }

    const isOwn = user.id === currentUser.id;

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <div className="w-full flex items-center gap-4">
                    <Avatar size="lg" className="size-24 sm:size-36 lg:size-48 rounded-full shrink-0">
                        <Avatar.Image alt={getUserFullName(user)} src={user.avatarUrl} />
                        <Avatar.Fallback>{getUserAvatarFallback(user)}</Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 min-w-0">
                        <Typography type="h1">{getUserFullName(user)}</Typography>
                        <Typography type="h4">{user.aboutMe}</Typography>
                    </div>
                </div>

                <ClubCardGrid title={isOwn ? "Мои кружки" : "Кружки участника"} clubs={getUserClubs(user.id)} />
            </div>
        </main>
    );
}

export default ProfilePage;
