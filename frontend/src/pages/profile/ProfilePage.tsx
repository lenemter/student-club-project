import { Avatar, Button, Typography } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ClubCardGrid } from "../../entities/club";
import { HeaderBar, ErrorState } from "../../shared/ui";
import { getUserAvatarFallback, getUserFullName } from "../../shared/lib/formatters";
import type { User } from "../../shared/types";
import { useStore } from "../../app/providers/StoreContext";

export function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser, getUserById, getUserClubs } = useStore();

    const user: User | undefined = getUserById(Number(id));

    if (!user) {
        return (
            <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-5xl flex flex-col gap-8">
                    <div className="w-full flex justify-end">
                        <HeaderBar />
                    </div>
                    <ErrorState
                        title="Пользователь не найден"
                        message="Пользователь с указанным идентификатором не существует или был удалён."
                        action={<Button onPress={() => navigate("/")}>На главную</Button>}
                    />
                </div>
            </main>
        );
    }

    const isOwn = user.id === currentUser.id;
    const userClubs = getUserClubs(user.id);

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
                        <Typography type="h4" className="text-muted">{user.aboutMe || "Информация о себе пока не заполнена"}</Typography>
                    </div>
                </div>

                <ClubCardGrid
                    title={isOwn ? "Мои кружки" : "Кружки участника"}
                    clubs={userClubs}
                    emptyTitle={isOwn ? "Вы пока не состоите в кружках" : "Участник пока не состоит в кружках"}
                    emptyDescription={isOwn ? "Перейдите на главную страницу, чтобы выбрать подходящий кружок." : undefined}
                />
            </div>
        </main>
    );
}

export default ProfilePage;
