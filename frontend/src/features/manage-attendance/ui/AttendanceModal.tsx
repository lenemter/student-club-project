import { Button, Checkbox, Modal } from "@heroui/react";
import type { User } from "../../../shared/types";
import { getUserFullName } from "../../../shared/lib/formatters";

export interface AttendanceModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    members: User[];
    selectedUserIds: number[];
    onSelectedUserIdsChange: (ids: number[]) => void;
    onSave: () => void;
}

export function AttendanceModal({
    isOpen,
    onOpenChange,
    members,
    selectedUserIds,
    onSelectedUserIdsChange,
    onSave,
}: AttendanceModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>Отметка посещаемости</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="flex flex-col gap-3">
                            <p className="text-sm text-muted">
                                Отметьте участников, присутствовавших на занятии сегодня:
                            </p>
                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                                {members.map((m) => (
                                    <div key={m.id} className="p-2 rounded-lg hover:bg-surface flex items-center">
                                        <Checkbox
                                            variant="secondary"
                                            isSelected={selectedUserIds.includes(m.id)}
                                            onChange={(isSelected) => {
                                                if (isSelected) {
                                                    onSelectedUserIdsChange([...selectedUserIds, m.id]);
                                                } else {
                                                    onSelectedUserIdsChange(
                                                        selectedUserIds.filter((id) => id !== m.id),
                                                    );
                                                }
                                            }}
                                        >
                                            <Checkbox.Content>
                                                <Checkbox.Control>
                                                    <Checkbox.Indicator />
                                                </Checkbox.Control>
                                                {getUserFullName(m)}
                                            </Checkbox.Content>
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                            <Button className="mt-4" onPress={onSave}>
                                Зафиксировать
                            </Button>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default AttendanceModal;
