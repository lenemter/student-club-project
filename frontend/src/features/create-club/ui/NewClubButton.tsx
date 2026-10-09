import { Check, Persons } from "@gravity-ui/icons";
import { Button, FieldError, Form, IconPlus, Input, Label, Modal, TextArea, TextField } from "@heroui/react";
import { useState } from "react";
import { useStore, type CreateClubDto } from "../../../app/providers/StoreContext";

export interface NewClubButtonProps {
    onClubCreated?: (newClub: CreateClubDto) => void;
}

export function NewClubButton({ onClubCreated }: NewClubButtonProps) {
    const { createClub } = useStore();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState("");

    const [errors, setErrors] = useState<{
        name?: string;
        schedule?: string;
        description?: string;
    }>({});

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

    function onFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const clubData: CreateClubDto = {
            name: name.trim(),
            description: description.trim(),
            schedule: schedule.trim(),
        };

        createClub(clubData);

        if (onClubCreated) {
            onClubCreated(clubData);
        }

        setName("");
        setDescription("");
        setSchedule("");
        setErrors({});
        setIsOpen(false);
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
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

                                <Button type="submit" className="mt-4">
                                    <Check />
                                    Создать
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
