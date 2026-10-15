import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Avatar, Button, Card, Typography } from "@heroui/react";
import { Calendar, Check, Xmark } from "@gravity-ui/icons";
import { HeaderBar, ErrorState, EmptyState, LoadingState } from "../../shared/ui";
import { AvatarGroup, MembersModal } from "../../entities/user";
import { AttendanceModal } from "../../features/manage-attendance";
import type { Club, User } from "../../shared/types";
import {
    getMemberCountText,
    getUserAvatarFallback,
    getUserFullName,
} from "../../shared/lib/formatters";
import { useStore } from "../../app/providers/StoreContext";

export function ClubPage() {
    const { id } = useParams<{ id: string }>();
    const clubId = Number(id);
    const navigate = useNavigate();

    const {
        currentUser,
        getClubById,
        getUserById,
        getClubMembers,
        getClubAttendance,
        getClubPendingRequests,
        getUserRequestStatusForClub,
        requestToJoinClub,
        cancelJoinRequest,
        leaveClub,
        approveJoinRequest,
        rejectJoinRequest,
        addAttendanceRecord,
        deleteClub,
        isLoading,
    } = useStore();

    const club: Club | undefined = getClubById(clubId);
    const leader: User | undefined = club ? getUserById(club.leaderId) : undefined;

    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const isMembersModalOpen = searchParams.get("members") === "1";

    const setMembersModalOpen = (open: boolean) => {
        setSearchParams(open ? { members: "1" } : {}, { replace: true });
    };

    if (isLoading && (!club || !leader)) {
        return (
            <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center justify-center">
                <LoadingState message="Загрузка кружка..." />
            </main>
        );
    }

    if (!club || !leader) {
        return (
            <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-5xl flex flex-col gap-8">
                    <div className="w-full flex justify-end">
                        <HeaderBar />
                    </div>
                    <ErrorState
                        title="Кружок не найден"
                        message="Кружок с таким идентификатором не существует или был удален."
                        action={<Button onPress={() => navigate("/")}>Вернуться на главную</Button>}
                    />
                </div>
            </main>
        );
    }

    const members = getClubMembers(club.id);
    const attendanceList = getClubAttendance(club.id);
    const requests = getClubPendingRequests(club.id);
    const myRequestStatus = currentUser ? getUserRequestStatusForClub(club.id) : "none";
    const isLeader = currentUser ? club.leaderId === currentUser.id : false;

    const handleJoin = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        await requestToJoinClub(club.id);
    };

    const handleCancelRequest = async () => {
        await cancelJoinRequest(club.id);
    };

    const handleLeave = async () => {
        await leaveClub(club.id);
    };

    const handleApproveRequest = async (reqId: number) => {
        await approveJoinRequest(reqId);
    };

    const handleRejectRequest = async (reqId: number) => {
        await rejectJoinRequest(reqId);
    };

    const handleSaveAttendance = async () => {
        if (selectedUserIds.length === 0) return;
        await addAttendanceRecord(club.id, selectedUserIds);
        setIsAttendanceModalOpen(false);
        setSelectedUserIds([]);
    };

    const handleDeleteClub = async () => {
        if (!window.confirm(`Вы уверены, что хотите удалить кружок «${club.name}»?`)) {
            return;
        }
        try {
            await deleteClub(club.id);
            navigate("/");
        } catch (err) {
            console.error("Ошибка при удалении кружка:", err);
        }
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
                                                        onPress={() => handleApproveRequest(req.id)}
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
                                <EmptyState
                                    title="Занятия ещё не фиксировались"
                                    description={
                                        isLeader
                                            ? "Отметьте первое занятие кружка и выберите присутствовавших участников."
                                            : "Руководитель кружка ещё не создавал отметок о проведении занятий."
                                    }
                                    action={
                                        isLeader ? (
                                            <Button size="sm" onPress={() => setIsAttendanceModalOpen(true)}>
                                                Отметить занятие
                                            </Button>
                                        ) : undefined
                                    }
                                />
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
                            {!currentUser ? (
                                <Button size="lg" className="w-full" onPress={() => navigate("/login")}>
                                    Войдите, чтобы вступить
                                </Button>
                            ) : isLeader ? (
                                <div className="flex flex-col gap-2">
                                    <Button size="lg" className="w-full" isDisabled>
                                        Вы руководитель
                                    </Button>
                                    <Button
                                        size="md"
                                        variant="danger"
                                        className="w-full"
                                        onPress={handleDeleteClub}
                                    >
                                        Удалить кружок
                                    </Button>
                                </div>
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
