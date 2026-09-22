import type { User } from "../types";

export const mockUsers: User[] = [
    {
        id: 1,
        firstName: "Леонид",
        lastName: "Копылов",
        aboutMe: "3 курс",
        email: "lenemter@gmail.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    },
    {
        id: 2,
        firstName: "Андрей",
        lastName: "Иванов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    },
    {
        id: 3,
        firstName: "Борис",
        lastName: "Смирнов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    },
    {
        id: 4,
        firstName: "Владимир",
        lastName: "Попов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    },
    {
        id: 5,
        firstName: "Максим",
        lastName: "Кузнецов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    },
    {
        id: 6,
        firstName: "Артём",
        lastName: "Смирнов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    },
    {
        id: 7,
        firstName: "Максим",
        lastName: "Кузнецов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    },
    {
        id: 8,
        firstName: "Сергей",
        lastName: "Иванов",
        aboutMe: "",
        email: "example@example.com",
        avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    },
];

export const currentUser: User = mockUsers[0];

export const fallbackUser: User = {
    id: 0,
    firstName: "Неизвестный",
    lastName: "Инкогнито",
    aboutMe: "Этого пользователя не существует",
    email: "",
    avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
}
