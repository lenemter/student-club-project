import { ArrowRightFromSquare, ChevronDown, Gear } from "@gravity-ui/icons"
import { Dropdown, Button, Avatar, Typography, Label, Separator } from "@heroui/react"
import { useNavigate } from "react-router-dom";
import { currentUser } from "../data/mockUsers";
import { getUserAvatarFallback, getUserFullName } from "../data/helper";


function ProfileButton() {
    const navigate = useNavigate();

    return (
        <Dropdown>
            <Button aria-label="Профиль" size="lg" variant="outline" className="px-2 py-6">
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <Avatar.Image alt={getUserFullName(currentUser)} src={currentUser.avatarUrl} />
                        <Avatar.Fallback>{getUserAvatarFallback(currentUser)}</Avatar.Fallback>
                    </Avatar>
                    <Typography>{currentUser.firstName}</Typography>
                    <ChevronDown />
                </div>
            </Button>

            <Dropdown.Popover className="max-w-72.5" placement="bottom end">
                <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                        <Avatar size="sm">
                            <Avatar.Image alt={getUserFullName(currentUser)} src={currentUser.avatarUrl} />
                            <Avatar.Fallback>{getUserAvatarFallback(currentUser)}</Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col gap-0">
                            <p className="text-sm leading-5 font-medium">{getUserFullName(currentUser)}</p>
                            <p className="text-xs leading-none text-muted">{currentUser.email}</p>
                        </div>
                    </div>
                </div>

                <Dropdown.Menu
                    onAction={(key) => {
                        if (key =="profile") navigate (`/profile/${currentUser.id}`)
                        if (key == "settings") navigate("/settings")
                        if (key == "log-out") navigate("/login")
                    }}
                >
                    <Dropdown.Section>
                        <Dropdown.Item
                            className="flex flex-col items-start gap-1"
                            id="profile"
                            textValue="Профиль"
                        >
                            <Label>Профиль</Label>
                        </Dropdown.Item>

                        <Dropdown.Item
                            isDisabled
                            className="flex flex-col items-start gap-1"
                            id="settings"
                            textValue="Настройки"
                        >
                            <div className="flex w-full items-center justify-between gap-2">
                                <Label>Настройки</Label>
                                <Gear className="size-3.5 text-muted" />
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Section>
                    <Separator />
                    <Dropdown.Section>
                        <Dropdown.Item
                            className="flex flex-col items-start gap-1"
                            id="log-out"
                            textValue="Выйти"
                            variant="danger"
                        >
                            <div className="flex w-full items-center justify-between gap-2">
                                <Label>Выйти</Label>
                                <ArrowRightFromSquare className="size-3.5 text-danger" />
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}

export default ProfileButton
