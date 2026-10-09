import { Typography } from "@heroui/react";
import { ClubCardGrid } from "../../entities/club";
import { HeaderBar } from "../../shared/ui";
import { NewClubButton } from "../../features/create-club";
import { useStore } from "../../app/providers/StoreContext";

export function HomePage() {
    const { currentUser, getUserClubs, getJoinableClubs } = useStore();

    const myClubs = getUserClubs(currentUser.id);
    const otherClubs = getJoinableClubs();

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:justify-between">
                    <Typography type="h1">Привет, {currentUser.firstName} 👋</Typography>
                    <div className="flex items-center justify-end gap-2">
                        <NewClubButton />
                        <HeaderBar />
                    </div>
                </div>

                <ClubCardGrid title="Мои кружки" clubs={myClubs} />
                <ClubCardGrid title="Другие кружки" clubs={otherClubs} />
            </div>
        </main>
    );
}

export default HomePage;
