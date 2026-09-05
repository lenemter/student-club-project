import type { Notification } from "../components/NotificationButton";

export const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Заявка одобрена",
        description: "Вы приняты в кружок «Теннис»",
        time: "5 минут назад",
        isRead: false,
        type: "success",
    },
    {
        id: "2",
        title: "Заявка одобрена",
        description: "Вы приняты в кружок «Баскетбол»",
        time: "28 минут назад",
        isRead: false,
        type: "success",
    },
];
