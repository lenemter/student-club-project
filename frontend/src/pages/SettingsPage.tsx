import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, FieldError, Form, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";
import HeaderBar from "../components/HeaderBar";
import { currentUser } from "../data/mockUsers";

const ABOUT_ME_MAX_LENGTH = 200;

function SettingsPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
    const [aboutMe, setAboutMe] = useState(currentUser.aboutMe || "");

    const avatarFallback = (firstName[0] ?? "") + (lastName[0] ?? "");
    const profilePath = `/profile/${currentUser.id}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarUrl(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setAvatarUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        currentUser.firstName = firstName.trim();
        currentUser.lastName = lastName.trim();
        currentUser.avatarUrl = avatarUrl;
        currentUser.aboutMe = aboutMe.trim();

        navigate(profilePath);
    }

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col gap-6">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <Card className="p-6">
                        <div className="flex flex-col gap-4">
                            <Typography type="h4">Фото профиля</Typography>

                            <div className="flex items-center gap-5">
                                <Avatar className="size-20 sm:size-24 rounded-full shrink-0">
                                    <Avatar.Image alt={`${firstName} ${lastName}`} src={avatarUrl} />
                                    <Avatar.Fallback className="text-xl">{avatarFallback}</Avatar.Fallback>
                                </Avatar>

                                <div className="flex flex-col gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onPress={() => fileInputRef.current?.click()}
                                        >
                                            Загрузить фото
                                        </Button>

                                        {avatarUrl && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                isIconOnly
                                                onPress={handleRemoveAvatar}
                                                aria-label="Удалить фото"
                                            >
                                                <TrashBin className="size-4 text-danger" />
                                            </Button>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted">JPG, PNG или WEBP</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex flex-col gap-4">
                            <Typography type="h4">Личные данные</Typography>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextField
                                    name="firstName"
                                    variant="secondary"
                                    isRequired
                                    value={firstName}
                                    onChange={setFirstName}
                                >
                                    <Label>Имя</Label>
                                    <Input />
                                    <FieldError />
                                </TextField>

                                <TextField
                                    name="lastName"
                                    variant="secondary"
                                    isRequired
                                    value={lastName}
                                    onChange={setLastName}
                                >
                                    <Label>Фамилия</Label>
                                    <Input />
                                    <FieldError />
                                </TextField>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="aboutMe">О себе</Label>
                                <TextArea
                                    fullWidth
                                    id="aboutMe"
                                    variant="secondary"
                                    rows={4}
                                    maxLength={ABOUT_ME_MAX_LENGTH}
                                    placeholder="Курс, интересы, чем занимаетесь"
                                    value={aboutMe}
                                    onChange={(e) => setAboutMe(e.target.value)}
                                />
                                <span className="text-xs text-muted self-end">
                                    {aboutMe.length}/{ABOUT_ME_MAX_LENGTH}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onPress={() => navigate(profilePath)}>
                            Отмена
                        </Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </Form>
            </div>
        </main>
    );
}

export default SettingsPage;
