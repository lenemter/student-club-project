import { Typography } from "@heroui/react";
import { ClubCardGrid, getUserClubs, getJoinableClubs } from "../../entities/club";
import { HeaderBar } from "../../shared/ui";
import { currentUser } from "../../entities/user";
import { NewClubButton } from "../../features/create-club";

export function HomePage() {
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

                <ClubCardGrid title="Мои кружки" clubs={getUserClubs(currentUser.id)} />
                <ClubCardGrid title="Другие кружки" clubs={getJoinableClubs()} />
            </div>
        </main>
    );
}

export default HomePage;
