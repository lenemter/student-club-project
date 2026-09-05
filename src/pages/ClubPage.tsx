import { Avatar, Button, Separator, Typography } from "@heroui/react";
import HeaderBar from "../components/HeaderBar";
import AvatarGroup from "../components/AvatarGroup";
import { Calendar } from "@gravity-ui/icons";
import { mockClub } from "../data/mockClubs";

export interface Member {
    id: number;
    name: string;
    image: string;
}

export interface Club {
    id: number;
    name: string;
    description: string;
    schedule: string;
    leader: string;
}

function ClubPage() {
    return (
        <main className="bg-background min-h-screen px-5 py-8 flex flex-col items-center gap-5">

            <div className="flex justify-end w-full max-w-5xl p-4 mx-auto rounded-xl">
                <HeaderBar />
            </div>

            <div className="flex gap-4 w-full max-w-5xl p-4 mx-auto rounded-xl items-start">
                <Avatar size="lg" className="size-24 rounded-4xl sm:size-36 sm:rounded-[calc(var(--radius-2xl)*3)] lg:size-48 lg:rounded-[calc(var(--radius-2xl)*4)]">
                    <Avatar.Fallback>ЛК</Avatar.Fallback>
                    <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg" />
                </Avatar>

                <div className="flex flex-col gap-6 flex-1">
                    <div className="flex items-center gap-4">
                        <Typography type="h1">{mockClub.name}</Typography>
                        <AvatarGroup />
                    </div>

                    <Typography type="body" className="text-default-500">
                        {mockClub.description}
                    </Typography>

                    <Separator />

                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="size-10">
                                <Avatar.Image alt="Руководитель" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                                <Avatar.Fallback className="text-xs">АВ</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-xs text-default-400">Руководитель</span>
                                <span className="font-medium">{mockClub.leader}</span>
                            </div>
                        </div>

                        <Button size="lg">Вступить</Button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Typography type="h3">Расписание</Typography>
                        <div className="flex items-start gap-2 p-3 rounded-xl border border-default-100">
                            <Calendar className="size-4 text-default-400 mt-0.5 shrink-0" />
                            <span className="text-default-600 whitespace-pre-line">{mockClub.schedule}</span>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}

export default ClubPage
