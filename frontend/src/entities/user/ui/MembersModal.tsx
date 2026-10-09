import { Avatar, Modal } from "@heroui/react";
import { Link } from "react-router-dom";
import type { User } from "../../../shared/types";
import { getMemberCountText, getUserAvatarFallback, getUserFullName } from "../../../shared/lib/formatters";

export interface MembersModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    members: User[];
    leaderId: number;
}

export function MembersModal({ isOpen, onOpenChange, members, leaderId }: MembersModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-md">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>{getMemberCountText(members.length)}</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-2">
                                {members.map((m) => (
                                    <Link
                                        key={m.id}
                                        to={`/profile/${m.id}`}
                                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface"
                                    >
                                        <Avatar>
                                            <Avatar.Image alt={getUserFullName(m)} src={m.avatarUrl} />
                                            <Avatar.Fallback>{getUserAvatarFallback(m)}</Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium truncate">{getUserFullName(m)}</span>
                                            {m.id === leaderId && (
                                                <span className="text-xs text-muted">Руководитель</span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default MembersModal;
