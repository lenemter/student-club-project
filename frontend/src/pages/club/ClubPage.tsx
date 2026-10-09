import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Avatar, Button, Card, Typography } from "@heroui/react";
import { Calendar, Check, Xmark } from "@gravity-ui/icons";
import { HeaderBar } from "../../shared/ui";
import { AvatarGroup, MembersModal, getUserById, currentUser } from "../../entities/user";
import { mockClubs, mockMemberships, getClubMembers } from "../../entities/club";
import { mockAttendance } from "../../entities/attendance";
import { mockJoinRequests } from "../../entities/join-request";
import { AttendanceModal } from "../../features/manage-attendance";
import type { Club, User, AttendanceRecord, JoinRequest } from "../../shared/types";
import {
    getMemberCountText,
    getUserAvatarFallback,
    getUserFullName,
} from "../../shared/lib/formatters";
import { NotFoundPage } from "../not-found/NotFoundPage";

export function ClubPage() {
    const { id } = useParams<{ id: string }>();
    const clubId = Number(id);

    const club: Club | undefined = mockClubs.find((c) => c.id === clubId);
    const leader: User | undefined = club ? getUserById(club.leaderId) : undefined;

    const [members, setMembers] = useState<User[]>(club ? getClubMembers(club) : []);
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(
        mockAttendance.filter((a) => a.clubId === clubId),
    );
    const [requests, setRequests] = useState<JoinRequest[]>(
        mockJoinRequests.filter((r) => r.clubId === clubId && r.status === "pending"),
    );
    const [myRequestStatus, setMyRequestStatus] = useState<"none" | "pending" | "approved">(
        mockJoinRequests.find((r) => r.clubId === clubId && r.userId === currentUser.id)?.status === "pending"
            ? "pending"
            : mockMemberships.some((m) => m.clubId === clubId && m.userId === currentUser.id)
              ? "approved"
              : "none",
    );

    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const isMembersModalOpen = searchParams.get("members") === "1";

    const setMembersModalOpen = (open: boolean) => {
        setSearchParams(open ? { members: "1" } : {}, { replace: true });
    };

    if (!club || !leader) {
        return <NotFoundPage message="Кружок не найден" />;
    }

    const isLeader = club.leaderId === currentUser.id;

    const handleJoin = () => {
        setMyRequestStatus("pending");
    };

    const handleCancelRequest = () => {
        setMyRequestStatus("none");
    };

    const handleLeave = () => {
        setMembers(members.filter((m) => m.id !== currentUser.id));
        setMyRequestStatus("none");
    };

    const handleApproveRequest = (reqId: number, userId: number) => {
        setRequests(requests.filter((r) => r.id !== reqId));
        const userToAdd = getUserById(userId);
        if (userToAdd && !members.some((m) => m.id === userId)) {
            setMembers([...members, userToAdd]);
        }
    };

    const handleRejectRequest = (reqId: number) => {
        setRequests(requests.filter((r) => r.id !== reqId));
    };

    const handleSaveAttendance = () => {
        const newRecord: AttendanceRecord = {
            id: Date.now(),
            clubId,
            date: new Date().toISOString(),
            attendedUserIds: selectedUserIds,
        };
        setAttendanceList([newRecord, ...attendanceList]);
        setIsAttendanceModalOpen(false);
        setSelectedUserIds([]);
    };

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
                                <button
                                    type="button"
                                    onClick={() => setMembersModalOpen(true)}
                                    className="flex items-center gap-3 self-start rounded-full py-1 px-2 -m-1 transition-colors hover:bg-surface-hover hover:cursor-pointer"
                                    aria-label="Показать список участников"
                                >
                                    <AvatarGroup users={members} />
                                    <span className="text-sm text-muted">{getMemberCountText(members.length)}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Typography type="h3">О кружке</Typography>
                            <Typography>{club.description || "Описание пока не добавлено."}</Typography>
                        </div>

                        {isLeader && requests.length > 0 && (
                            <Card className="p-4 border-accent">
                                <Typography type="h3" className="mb-3">
                                    Входящие заявки ({requests.length})
                                </Typography>
                                <div className="flex flex-col gap-2">
                                    {requests.map((req) => {
                                        const reqUser = getUserById(req.userId);
                                        if (!reqUser) return null;
                                        return (
                                            <div
                                                key={req.id}
                                                className="flex items-center justify-between bg-surface p-2 rounded-xl"
                                            >
                                                <Link
                                                    to={`/profile/${reqUser.id}`}
                                                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                                                >
                                                    <Avatar size="sm">
                                                        <Avatar.Image src={reqUser.avatarUrl} />
                                                        <Avatar.Fallback>
                                                            {getUserAvatarFallback(reqUser)}
                                                        </Avatar.Fallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">
                                                        {getUserFullName(reqUser)}
                                                    </span>
                                                </Link>

                                                <div className="flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="bg-success text-success-foreground"
                                                        isIconOnly
                                                        aria-label="Принять заявку"
                                                        onPress={() => handleApproveRequest(req.id, req.userId)}
                                                    >
                                                        <Check />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        isIconOnly
                                                        aria-label="Отклонить заявку"
                                                        onPress={() => handleRejectRequest(req.id)}
                                                    >
                                                        <Xmark />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <Typography type="h3">Посещаемость</Typography>
                                {isLeader && (
                                    <Button size="sm" onPress={() => setIsAttendanceModalOpen(true)}>
                                        Отметить занятие
                                    </Button>
                                )}
                            </div>

                            {attendanceList.length === 0 ? (
                                <Typography className="text-muted">Занятия ещё не фиксировались</Typography>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {attendanceList.map((rec) => (
                                        <Card key={rec.id} className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm">
                                                    {new Date(rec.date).toLocaleDateString("ru-RU", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="text-xs text-muted">
                                                    Присутствовало: {rec.attendedUserIds.length} из {members.length}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {members.map((m) => {
                                                    const attended = rec.attendedUserIds.includes(m.id);
                                                    return (
                                                        <div
                                                            key={m.id}
                                                            className={`text-xs px-2.5 py-1 rounded-full flex gap-1 ${
                                                                attended
                                                                    ? "bg-success-soft text-success-soft-foreground"
                                                                    : "bg-default text-muted"
                                                            }`}
                                                        >
                                                            {attended ? <Check /> : <Xmark />} {m.firstName}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Card className="lg:sticky lg:top-8">
                        <Card.Content className="flex flex-col gap-5">
                            {isLeader ? (
                                <Button size="lg" className="w-full" isDisabled>
                                    Вы руководитель
                                </Button>
                            ) : myRequestStatus === "approved" ? (
                                <Button size="lg" variant="danger" className="w-full" onPress={handleLeave}>
                                    Выйти из кружка
                                </Button>
                            ) : myRequestStatus === "pending" ? (
                                <Button size="lg" variant="secondary" className="w-full" onPress={handleCancelRequest}>
                                    Отменить заявку
                                </Button>
                            ) : (
                                <Button size="lg" className="w-full" onPress={handleJoin}>
                                    Вступить в кружок
                                </Button>
                            )}

                            <Link
                                to={`/profile/${leader.id}`}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                                <Avatar className="size-10">
                                    <Avatar.Image alt={getUserFullName(leader)} src={leader.avatarUrl} />
                                    <Avatar.Fallback className="text-xs">
                                        {getUserAvatarFallback(leader)}
                                    </Avatar.Fallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted">Руководитель</span>
                                    <span className="font-medium">{getUserFullName(leader)}</span>
                                </div>
                            </Link>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-muted">Расписание</span>
                                <div className="flex items-start gap-2">
                                    <Calendar className="size-4 mt-0.5 shrink-0 text-muted" />
                                    <span className="whitespace-pre-line">{club.schedule || "Пока не указано"}</span>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>

            <AttendanceModal
                isOpen={isAttendanceModalOpen}
                onOpenChange={setIsAttendanceModalOpen}
                members={members}
                selectedUserIds={selectedUserIds}
                onSelectedUserIdsChange={setSelectedUserIds}
                onSave={handleSaveAttendance}
            />

            <MembersModal
                isOpen={isMembersModalOpen}
                onOpenChange={setMembersModalOpen}
                members={members}
                leaderId={club.leaderId}
            />
        </main>
    );
}

export default ClubPage;
