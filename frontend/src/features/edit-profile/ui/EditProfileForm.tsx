import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, FieldError, Form, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";
import { useStore } from "../../../app/providers/StoreContext";
import { uploadAvatarApi } from "../../../shared/lib";

const ABOUT_ME_MAX_LENGTH = 200;

export function EditProfileForm() {
    const navigate = useNavigate();
    const { currentUser, updateCurrentUser } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
    const [aboutMe, setAboutMe] = useState(currentUser.aboutMe || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; aboutMe?: string }>({});

    const avatarFallback = ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?";
    const profilePath = `/profile/${currentUser.id}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setAvatarUrl(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setSelectedFile(null);
        setAvatarUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "Введите имя";
        } else if (firstName.trim().length < 2) {
            newErrors.firstName = "Имя должно содержать не менее 2 символов";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "Введите фамилию";
        } else if (lastName.trim().length < 2) {
            newErrors.lastName = "Фамилия должна содержать не менее 2 символов";
        }

        if (aboutMe.length > ABOUT_ME_MAX_LENGTH) {
            newErrors.aboutMe = `Длина текста не должна превышать ${ABOUT_ME_MAX_LENGTH} символов`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            let finalAvatarUrl = avatarUrl;
            if (selectedFile) {
                try {
                    const uploadedUser = await uploadAvatarApi(selectedFile);
                    if (uploadedUser?.avatarUrl) {
                        finalAvatarUrl = uploadedUser.avatarUrl;
                    }
                } catch (err) {
                    console.error("Ошибка при загрузке аватара:", err);
                }
            }

            await updateCurrentUser({
                firstName,
                lastName,
                avatarUrl: finalAvatarUrl,
                aboutMe,
            });

            navigate(profilePath);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
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
                            value={firstName}
                            isInvalid={Boolean(errors.firstName)}
                            onChange={(val) => {
                                setFirstName(val);
                                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                            }}
                        >
                            <Label>Имя *</Label>
                            <Input />
                            {errors.firstName ? <FieldError>{errors.firstName}</FieldError> : <FieldError />}
                        </TextField>

                        <TextField
                            name="lastName"
                            variant="secondary"
                            value={lastName}
                            isInvalid={Boolean(errors.lastName)}
                            onChange={(val) => {
                                setLastName(val);
                                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                            }}
                        >
                            <Label>Фамилия *</Label>
                            <Input />
                            {errors.lastName ? <FieldError>{errors.lastName}</FieldError> : <FieldError />}
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
                            onChange={(e) => {
                                setAboutMe(e.target.value);
                                if (errors.aboutMe) setErrors((prev) => ({ ...prev, aboutMe: undefined }));
                            }}
                        />
                        <div className="flex justify-between items-center text-xs">
                            {errors.aboutMe ? (
                                <span className="text-danger">{errors.aboutMe}</span>
                            ) : (
                                <span />
                            )}
                            <span className="text-muted">
                                {aboutMe.length}/{ABOUT_ME_MAX_LENGTH}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onPress={() => navigate(profilePath)}>
                    Отмена
                </Button>
                <Button type="submit" isDisabled={isSubmitting}>
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                </Button>
            </div>
        </Form>
    );
}

export default EditProfileForm;
