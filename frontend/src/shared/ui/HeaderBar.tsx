import { useNavigate } from "react-router-dom";
import { House } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { NotificationButton } from "../../entities/notification";
import { ProfileButton } from "../../entities/user";
import { useStore } from "../../app/providers/StoreContext";

export function HeaderBar() {
    const navigate = useNavigate();
    const { notifications, currentUser } = useStore();

    return (
        <div className="flex gap-2 items-center">
            <Button isIconOnly variant="ghost" size="lg" aria-label="На главную" onPress={() => navigate("/")}>
                <House className="size-5" />
            </Button>
            {currentUser && <NotificationButton notifications={notifications} />}
            <ProfileButton />
        </div>
    );
}

export default HeaderBar;
