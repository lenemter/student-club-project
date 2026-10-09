import { useNavigate } from "react-router-dom";
import { House } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { NotificationButton, mockNotifications } from "../../entities/notification";
import { ProfileButton } from "../../entities/user";

export function HeaderBar() {
    const navigate = useNavigate();

    return (
        <div className="flex gap-2 items-center">
            <Button isIconOnly variant="ghost" size="lg" aria-label="На главную" onPress={() => navigate("/")}>
                <House className="size-5" />
            </Button>
            <NotificationButton notifications={mockNotifications} />
            <ProfileButton />
        </div>
    );
}

export default HeaderBar;
