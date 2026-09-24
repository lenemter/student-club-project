import { Check, Persons } from "@gravity-ui/icons"
import { Button, FieldError, IconPlus, Input, Label, Modal, TextArea, TextField } from "@heroui/react"
import { Form } from "react-router-dom"


function NewClubButton() {
    return (
        <Modal>
            <Button variant="primary">
                Открыть свой кружок
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
                                Что-то сюда мб??
                            </p>
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            <Form className="flex flex-col gap-4" onSubmit={() => {}}>
                                <TextField name="name" variant="secondary" isRequired>
                                    <Label>Название</Label>
                                    <Input placeholder="Классный кружок" />
                                    <FieldError />
                                </TextField>

                                <TextArea fullWidth placeholder="Он классный, потому что проходит в 610." name="description" variant="secondary" />

                                <TextField name="schedule" variant="secondary" isRequired>
                                    <Label>Расписание</Label>
                                    <Input placeholder="Понедельник, четверг 17:00" />
                                    <FieldError />
                                </TextField>

                                <Button type="submit">
                                    <Check />
                                    Создать
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

export default NewClubButton
