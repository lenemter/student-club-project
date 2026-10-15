import { Check, Persons, Picture, TrashBin } from "@gravity-ui/icons";
import { Button, FieldError, Form, IconPlus, Input, Label, Modal, TextArea, TextField } from "@heroui/react";
import { useRef, useState } from "react";
import { useStore, type CreateClubDto } from "../../../app/providers/StoreContext";
import { uploadClubImageApi } from "../../../shared/lib";

export interface NewClubButtonProps {
    onClubCreated?: (newClub: CreateClubDto) => void;
}

export function NewClubButton({ onClubCreated }: NewClubButtonProps) {
    const { createClub } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setErrors] = useState<{
        name?: string;
        schedule?: string;
        description?: string;
    }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setImageUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImageUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        const trimmedName = name.trim();
        if (!trimmedName) {
            newErrors.name = "Введите название кружка";
        } else if (trimmedName.length < 3) {
            newErrors.name = "Название должно содержать не менее 3 символов";
        } else if (trimmedName.length > 60) {
            newErrors.name = "Название не должно превышать 60 символов";
        }

        const trimmedSchedule = schedule.trim();
        if (!trimmedSchedule) {
            newErrors.schedule = "Укажите расписание занятий";
        } else if (trimmedSchedule.length < 5) {
            newErrors.schedule = "Расписание должно быть более информативным (от 5 символов)";
        }

        if (description.length > 500) {
            newErrors.description = "Описание не должно превышать 500 символов";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function onFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            let finalImageUrl = imageUrl;
            if (selectedFile) {
                try {
                    const uploadRes = await uploadClubImageApi(selectedFile);
                    if (uploadRes?.imageUrl) {
                        finalImageUrl = uploadRes.imageUrl;
                    }
                } catch (uploadErr) {
                    console.error("Failed to upload image:", uploadErr);
                }
            }

            const clubData: CreateClubDto = {
                name: name.trim(),
                description: description.trim(),
                schedule: schedule.trim(),
                imageUrl: finalImageUrl || undefined,
            };

            await createClub(clubData);

            if (onClubCreated) {
                onClubCreated(clubData);
            }

            setName("");
            setDescription("");
            setSchedule("");
            setImageUrl("");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setErrors({});
            setIsOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setName("");
            setDescription("");
            setSchedule("");
            setImageUrl("");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setErrors({});
        }
    };


    return (
        <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
            <Button variant="secondary" onPress={() => setIsOpen(true)}>
                <span className="hidden sm:inline">Создать кружок</span>
                <IconPlus />
            </Button>

            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-md">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                                <Persons className="size-5" />
                            </Modal.Icon>
                            <Modal.Heading>Создать кружок</Modal.Heading>
                            <p className="mt-1.5 text-sm leading-5 text-muted">
                                Вы станете руководителем и сможете принимать заявки на вступление
                            </p>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="flex flex-col gap-3" onSubmit={onFormSubmit}>
                                <div className="flex flex-col gap-2">
                                    <Label>Обложка кружка</Label>
                                    <div className="flex items-center gap-4">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt="Обложка кружка"
                                                className="aspect-square size-16 rounded-2xl object-cover border border-border"
                                            />
                                        ) : (
                                            <div className="aspect-square size-16 rounded-2xl bg-surface border border-dashed border-border flex items-center justify-center text-muted">
                                                <Picture className="size-6 text-muted" />
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    onPress={() => fileInputRef.current?.click()}
                                                >
                                                    {imageUrl ? "Сменить фото" : "Загрузить фото"}
                                                </Button>

                                                {imageUrl && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        isIconOnly
                                                        onPress={handleRemoveImage}
                                                        aria-label="Удалить фото"
                                                    >
                                                        <TrashBin className="size-4 text-danger" />
                                                    </Button>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted">
                                                JPG, PNG или WEBP (необязательно)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <TextField
                                    name="name"
                                    variant="secondary"
                                    value={name}
                                    isInvalid={Boolean(errors.name)}
                                    onChange={(val) => {
                                        setName(val);
                                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                                    }}
                                >
                                    <Label>Название *</Label>
                                    <Input placeholder="Например: Робототехника" />
                                    {errors.name ? <FieldError>{errors.name}</FieldError> : <FieldError />}
                                </TextField>

                                <div>
                                    <Label htmlFor="description">Описание</Label>
                                    <TextArea
                                        fullWidth
                                        id="description"
                                        placeholder="Расскажите о целях кружка, проектах и встречах"
                                        name="description"
                                        variant="secondary"
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            if (errors.description) {
                                                setErrors((prev) => ({ ...prev, description: undefined }));
                                            }
                                        }}
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-danger mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <TextField
                                    name="schedule"
                                    variant="secondary"
                                    value={schedule}
                                    isInvalid={Boolean(errors.schedule)}
                                    onChange={(val) => {
                                        setSchedule(val);
                                        if (errors.schedule) setErrors((prev) => ({ ...prev, schedule: undefined }));
                                    }}
                                >
                                    <Label>Расписание *</Label>
                                    <Input placeholder="Понедельник, четверг 17:00" />
                                    {errors.schedule ? <FieldError>{errors.schedule}</FieldError> : <FieldError />}
                                </TextField>

                                <Button type="submit" className="mt-4" isDisabled={isSubmitting}>
                                    <Check />
                                    {isSubmitting ? "Создание..." : "Создать"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default NewClubButton;
