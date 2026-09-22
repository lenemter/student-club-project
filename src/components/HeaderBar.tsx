import { mockNotifications } from "../data/mockNotifications"
import NewClubButton from "./NewClubButton"
import NotificationButton from "./NotificationButton"
import ProfileButton from "./ProfileButton"


function HeaderBar() {
    return (
        <div className="flex gap-2 items-center">
            <NewClubButton />
            <NotificationButton notifications={mockNotifications} />
            <ProfileButton />
        </div>
    )
}

export default HeaderBar
