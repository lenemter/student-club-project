import { Check, Persons } from "@gravity-ui/icons";
import { Button, FieldError, Form, IconPlus, Input, Label, Modal, TextArea, TextField } from "@heroui/react";
import { useState } from "react";

export interface NewClubButtonProps {
    onClubCreated?: (newClub: { name: string; description: string; schedule: string }) => void;
}

export function NewClubButton({ onClubCreated }: NewClubButtonProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState("");

    function onFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (onClubCreated) {
            onClubCreated({ name, description, schedule });
        }

        setName("");
        setDescription("");
        setSchedule("");
        setIsOpen(false);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
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
                            <Form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                                <TextField
                                    name="name"
                                    variant="secondary"
                                    isRequired
                                    value={name}
                                    onChange={setName}
                                >
                                    <Label>Название</Label>
                                    <Input placeholder="Классный кружок" />
                                    <FieldError />
                                </TextField>

                                <div>
                                    <Label htmlFor="description">Описание</Label>
                                    <TextArea
                                        fullWidth
                                        id="description"
                                        placeholder="Он классный, потому что проходит в 610."
                                        name="description"
                                        variant="secondary"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <TextField
                                    name="schedule"
                                    variant="secondary"
                                    isRequired
                                    value={schedule}
                                    onChange={setSchedule}
                                >
                                    <Label>Расписание</Label>
                                    <Input placeholder="Понедельник, четверг 17:00" />
                                    <FieldError />
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
