import { Typography } from "@heroui/react";
import ClubCardGrid from "../components/ClubCardGrid";
import { getUserClubs, getJoinableClubs } from "../data/helper";
import HeaderBar from "../components/HeaderBar";
import { currentUser } from "../data/mockUsers";
import NewClubButton from "../components/NewClubButton";

function HomePage() {
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
