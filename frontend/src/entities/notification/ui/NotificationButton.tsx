import type { Notification } from "../../../shared/types";
import { Bell, CircleCheck, CircleInfo, TriangleExclamation } from "@gravity-ui/icons";
import { Badge, Button, Dropdown, Label } from "@heroui/react";
import { useStore } from "../../../app/providers/StoreContext";

const notificationIcons = {
    success: { icon: CircleCheck, color: "text-success" },
    info: { icon: CircleInfo, color: "text-accent" },
    warning: { icon: TriangleExclamation, color: "text-warning" },
};

export interface NotificationButtonProps {
    notifications: Notification[];
}

export function NotificationButton({ notifications }: NotificationButtonProps) {
    const { markNotificationAsRead } = useStore();
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <Dropdown>
            <Button isIconOnly variant="ghost" size="lg" aria-label="Уведомления">
                <Badge.Anchor>
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge color="danger" size="sm" className="translate-x-1/5 -translate-y-1/5"></Badge>
                    )}
                </Badge.Anchor>
            </Button>

            <Dropdown.Popover className="max-w-72.5" placement="bottom">
                <Dropdown.Menu
                    onAction={(key) => {
                        const id = Number(key);
                        if (!isNaN(id)) {
                            markNotificationAsRead(id);
                        }
                    }}
                >
                    <Dropdown.Section>
                        {notifications.length === 0 ? (
                            <Dropdown.Item id="empty" textValue="Нет уведомлений" isDisabled>
                                <Label>Нет новых уведомлений</Label>
                            </Dropdown.Item>
                        ) : (
                            notifications.map((notification) => {
                                const { icon: Icon, color } = notificationIcons[notification.type];
                                return (
                                    <Dropdown.Item
                                        key={notification.id}
                                        id={notification.id}
                                        textValue={notification.title}
                                        className={`flex flex-row items-center gap-3 ${
                                            notification.isRead ? "opacity-60" : "font-medium"
                                        }`}
                                    >
                                        <Icon className={`size-5 mt-0.5 shrink-0 ${color}`} />
                                        <div className="flex flex-col gap-1">
                                            <Label className="font-semibold">{notification.title}</Label>
                                            <span className="text-xs">{notification.description}</span>
                                            <span className="text-xs text-muted">{notification.createdAt}</span>
                                        </div>
                                    </Dropdown.Item>
                                );
                            })
                        )}
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}

export default NotificationButton;
