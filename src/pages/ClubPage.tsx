import { Avatar, Button, Card, Typography } from "@heroui/react";
import HeaderBar from "../components/HeaderBar";
import AvatarGroup from "../components/AvatarGroup";
import { Calendar } from "@gravity-ui/icons";
import { mockClubs } from "../data/mockClubs";
import type { Club, User } from "../types";
import { getClubMembers, getMemberCountText, getUserAvatarFallback, getUserById, getUserFullName } from "../data/helper";
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

    const members = getClubMembers(club)

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                    <div className="flex flex-col gap-6 min-w-0">
                        <div className="flex items-center gap-5">
                            <Avatar className="size-24 sm:size-32 shrink-0 rounded-3xl">
                                <Avatar.Image alt={club.name} src={club.imageUrl} />
                                <Avatar.Fallback>{club.name.slice(0, 1)}</Avatar.Fallback>
                            </Avatar>

                            <div className="flex flex-col gap-3 min-w-0">
                                <Typography type="h1">{club.name}</Typography>
                                <div className="flex items-center gap-3">
                                    <AvatarGroup users={members} />
                                    <span className="text-sm text-muted">{getMemberCountText(members.length)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Typography type="h3">О кружке</Typography>
                            {club.description ? (
                                <Typography>{club.description}</Typography>
                            ) : (
                                <Typography className="text-muted">Описание пока не добавлено</Typography>
                            )}
                        </div>
                    </div>

                    <Card className="lg:sticky lg:top-8">
                        <Card.Content className="flex flex-col gap-5">
                            <Button size="lg" className="w-full">Вступить</Button>

                            <div className="flex items-center gap-3">
                                <Avatar className="size-10">
                                    <Avatar.Image alt={`Руководитель ${getUserFullName(leader)}`} src={leader.avatarUrl} />
                                    <Avatar.Fallback className="text-xs">{getUserAvatarFallback(leader)}</Avatar.Fallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted">Руководитель</span>
                                    <span className="font-medium">{getUserFullName(leader)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-muted">Расписание</span>
                                <div className="flex items-start gap-2">
                                    <Calendar className="size-4 mt-0.5 shrink-0 text-muted" />
                                    {club.schedule ? (
                                        <span className="whitespace-pre-line">{club.schedule}</span>
                                    ) : (
                                        <span className="text-muted">Пока не указано</span>
                                    )}
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default ClubPage
