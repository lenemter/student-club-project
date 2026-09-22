import { Typography } from "@heroui/react";
import ClubCardGrid from "../components/ClubCardGrid";
import { getUserClubs, getJoinableClubs } from "../data/helper";
import HeaderBar from "../components/HeaderBar";
import { currentUser } from "../data/mockUsers";

function HomePage() {
    return (
        <main className="bg-background min-h-screen px-5 py-8 flex flex-col items-center gap-5">
            <div className="flex justify-between w-full max-w-5xl p-4 mx-auto rounded-xl">
                <Typography type="h1">Привет, {currentUser.firstName} 👋</Typography>
                <HeaderBar />
            </div>

            <div className="flex flex-col gap-2 w-full max-w-5xl p-4 mx-auto rounded-xl">
                <ClubCardGrid title="Мои кружки" clubs={getUserClubs(currentUser.id)} />
            </div>

            <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto p-4 rounded-xl">
                <ClubCardGrid title="Другие кружки" clubs={getJoinableClubs()} />
            </div>
        </main>
    );
}

export default HomePage;
