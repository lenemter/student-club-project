import { ArrowRightFromSquare, ChevronDown, Gear } from "@gravity-ui/icons"
import { Dropdown, Button, Avatar, Typography, Label, Separator } from "@heroui/react"
import { useNavigate } from "react-router-dom";


function ProfileButton() {
    const navigate = useNavigate();

    return (
        <Dropdown>
            <Button aria-label="Профиль" size="lg" variant="outline" className="px-2 py-6">
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                        <Avatar.Fallback>КЛ</Avatar.Fallback>
                    </Avatar>
                    <Typography>Леонид</Typography>
                    <ChevronDown />
                </div>
            </Button>

            <Dropdown.Popover className="max-w-72.5" placement="bottom end">
                <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                        <Avatar size="sm">
                            <Avatar.Image
                                alt="Jane"
                                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                            />
                            <Avatar.Fallback>ЛК</Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col gap-0">
                            <p className="text-sm leading-5 font-medium">Леонид Копылов</p>
                            <p className="text-xs leading-none text-muted">lenemter@gmail.com</p>
                        </div>
                    </div>
                </div>

                <Dropdown.Menu
                    onAction={(key) => {
                        if (key =="profile") navigate ("/profile")
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
                            textValue="Squash and merge"
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
