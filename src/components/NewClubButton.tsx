import { Check, Persons } from "@gravity-ui/icons"
import { Button, FieldError, Form, IconPlus, Input, Label, Modal, TextArea, TextField } from "@heroui/react"


function NewClubButton() {
    return (
        <Modal>
            <Button variant="primary">
                <span className="hidden sm:inline">
                    Создать кружок
                </span>
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
                            <Form className="flex flex-col gap-2" onSubmit={() => { }}>
                                <TextField name="name" variant="secondary" isRequired>
                                    <Label>Название</Label>
                                    <Input placeholder="Классный кружок" />
                                    <FieldError />
                                </TextField>

                                <div>
                                    <Label htmlFor="description">Название</Label>
                                    <TextArea
                                        fullWidth
                                        id="description"
                                        placeholder="Он классный, потому что проходит в 610."
                                        name="description"
                                        variant="secondary"
                                    />
                                </div>

                                <TextField name="schedule" variant="secondary" isRequired>
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
    )
}

export default NewClubButton
