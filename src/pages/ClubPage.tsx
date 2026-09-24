import { Avatar, Button, Separator, Typography } from "@heroui/react";
import HeaderBar from "../components/HeaderBar";
import AvatarGroup from "../components/AvatarGroup";
import { Calendar } from "@gravity-ui/icons";
import { mockClubs } from "../data/mockClubs";
import type { Club, User } from "../types";
import { getClubMembers, getUserAvatarFallback, getUserById, getUserFullName } from "../data/helper";
import { useParams } from "react-router-dom";


function ClubPage() {
    const { id } = useParams<{ id: string }>()

    const club: Club | undefined = mockClubs.find((c) => c.id === Number(id))
    if (!club) {
        return <div>Кружок  не найден</div>
    }

    const leader: User | undefined = getUserById(club.leaderId)
    if (!leader) {
        return <div>Руководитель не найден</div>
    }

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <div className="w-full flex items-start gap-8">
                    <Avatar size="lg" className="size-24 rounded-4xl sm:size-36 sm:rounded-[calc(var(--radius-2xl)*3)] lg:size-48 lg:rounded-[calc(var(--radius-2xl)*4)]">
                        <Avatar.Image alt={club.name} src={club.imageUrl} />
                        <Avatar.Fallback>{club.name.slice(0, 1)}</Avatar.Fallback>
                    </Avatar>

                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex items-center gap-4">
                            <Typography type="h1">{club.name}</Typography>
                            <AvatarGroup users={getClubMembers(club)} />
                        </div>

                        <Typography>{club.description}</Typography>

                        <Separator />

                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="size-10">
                                    <Avatar.Fallback className="text-xs">{getUserAvatarFallback(leader)}</Avatar.Fallback>
                                    <Avatar.Image alt={`Руководитель ${getUserFullName(leader)}`} src={leader.avatarUrl} />
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-xs text-default-400">Руководитель</span>
                                    <span className="font-medium">{getUserFullName(leader)}</span>
                                </div>
                            </div>

                            <Button size="lg">Вступить</Button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Typography type="h3">Расписание</Typography>
                            <div className="flex items-start gap-2 p-3 rounded-xl border border-default-100">
                                <Calendar className="size-4 text-default-400 mt-0.5 shrink-0" />
                                <span className="text-default-600 whitespace-pre-line">{club.schedule}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ClubPage
