import type { Notification } from "../types";

export const mockNotifications: Notification[] = [
    {
        id: 1,
        userId: 1,
        title: "Заявка одобрена",
        description: "Вы приняты в кружок «Теннис»",
        createdAt: "5 минут назад",
        isRead: false,
        type: "success",
    },
    {
        id: 2,
        userId: 1,
        title: "Заявка одобрена",
        description: "Вы приняты в кружок «Баскетбол»",
        createdAt: "28 минут назад",
        isRead: false,
        type: "success",
    },
];
