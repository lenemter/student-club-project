import { useState, useRef } from "react";
import { Avatar, Button, Card, FieldError, Form, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { ArrowLeft, TrashBin } from "@gravity-ui/icons";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import { currentUser } from "../data/mockUsers";
import { getUserAvatarFallback } from "../data/helper";

function SettingsPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
    const [aboutMe, setAboutMe] = useState(currentUser.aboutMe || "");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setAvatarUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        currentUser.firstName = firstName;
        currentUser.lastName = lastName;
        currentUser.avatarUrl = avatarUrl;
        currentUser.aboutMe = aboutMe;

        navigate(`/profile/${currentUser.id}`);
    }

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            isIconOnly 
                            onPress={() => navigate(-1)} 
                            aria-label="Назад"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Typography type="h1">Настройки профиля</Typography>
                    </div>
                    <HeaderBar />
                </div>

                <Card className="p-6 sm:p-8">
                    <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                            <Avatar className="size-24 rounded-full shrink-0">
                                <Avatar.Image alt={`${firstName} ${lastName}`} src={avatarUrl} />
                                <Avatar.Fallback className="text-xl">
                                    {getUserAvatarFallback({ firstName, lastName } as any)}
                                </Avatar.Fallback>
                            </Avatar>

                            <div className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
                                <span className="text-sm font-medium">Фото профиля</span>
                                
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />

                                <div className="flex flex-wrap items-center gap-2">
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
                                <span className="text-xs text-muted">
                                    Поддерживаются форматы JPG, PNG или WEBP.
                                </span>
                            </div>
                        </div>

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

                        <div>
                            <Label htmlFor="aboutMe" className="mb-1 block text-sm font-medium">О себе</Label>
                            <TextArea
                                fullWidth
                                id="aboutMe"
                                variant="secondary"
                                value={aboutMe}
                                onChange={(e) => setAboutMe(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end items-center gap-3 pt-4 border-t border-border">
                            <Button type="button" variant="ghost" onPress={() => navigate(-1)}>
                                Отмена
                            </Button>
                            <Button type="submit">
                                Сохранить изменения
                            </Button>
                        </div>

                    </Form>
                </Card>
            </div>
        </main>
    );
}

export default SettingsPage;