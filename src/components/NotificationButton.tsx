import { Bell, CircleCheck, CircleInfo, TriangleExclamation } from "@gravity-ui/icons"
import { Button, Dropdown, Label } from "@heroui/react"

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    type: "success" | "info" | "warning";
}

const notificationIcons = {
    success: { icon: CircleCheck, color: "text-green-500" },
    info: { icon: CircleInfo, color: "text-blue-500" },
    warning: { icon: TriangleExclamation, color: "text-amber-500" },
}

interface NotificationButtonProps {
    notifications: Notification[];
}

function NotificationButton({ notifications }: NotificationButtonProps) {
    // const unreadCount = notifications.filter((n) => !n.isRead).length

    return (
        <Dropdown>
            <Button isIconOnly variant="ghost">
                <Bell />
            </Button>

            <Dropdown.Popover className="max-w-72.5" placement="bottom">
                <Dropdown.Menu>
                    <Dropdown.Section>
                        {notifications.length === 0 ? (
                            <Dropdown.Item id="empty" textValue="Нет уведомлений" isDisabled>
                                <Label>Нет новых уведомлений</Label>
                            </Dropdown.Item>
                        ) : (
                            notifications.map((notification) => {
                                const { icon: Icon, color } = notificationIcons[notification.type]
                                return (
                                    <Dropdown.Item
                                        key={notification.id}
                                        id={notification.id}
                                        textValue={notification.title}
                                        className="flex flex-row items-center gap-3"
                                    >
                                        <Icon className={`size-5 mt-0.5 shrink-0 ${color}`} />
                                        <div className="flex flex-col gap-1">
                                            <Label className={notification.isRead ? "text-default-400" : "font-semibold"}>
                                                {notification.title}
                                            </Label>
                                            <span className="text-xs text-default-400">
                                                {notification.description}
                                            </span>
                                            <span className="text-xs text-default-300 text-muted">
                                                {notification.time}
                                            </span>
                                        </div>
                                    </Dropdown.Item>
                                )
                            })
                        )}
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}

export default NotificationButton
