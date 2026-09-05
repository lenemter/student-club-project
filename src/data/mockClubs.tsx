import type { ClubCardProps } from "../components/ClubCard";
import type { Club } from "../pages/ClubPage";

export const mockJoinedCards: ClubCardProps[] = [
    { name: "Баскетбол" },
    { name: "Настольный теннис" },
];

export const mockOtherCards: ClubCardProps[] = [
    { name: "Теннис" },
    { name: "Футбол" },
    { name: "Хоккей" },
    { name: "Мини-футбол" },
    { name: "Мини-футбол" },
    { name: "Мини-футбол" },
    { name: "Мини-футбол" },
    { name: "Мини-футбол" },
    { name: "Мини-футбол" },
];

export const mockClub: Club = {
    id: 1,
    name: "Теннис",
    description: "Теннис (англ. tennis), большой теннис или лаун-теннис — вид спорта, в котором соперничают либо два игрока («одиночная игра»), либо две команды, состоящие из двух игроков («парная игра»).",
    schedule: "Вторник 15:00, четверг 16:00.",
    leader: "Абоба Викторович",
};
