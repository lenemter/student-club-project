import { Typography } from "@heroui/react";
import ClubCard from "./ClubCard";
import type { Club } from "../types";

interface ClubCardGridProps {
    title: string;
    clubs: Club[];
}

function ClubCardGrid({ title, clubs }: ClubCardGridProps) {
    return (
        <div>
            <div className="flex items-baseline gap-2">
                <Typography type="h2">{title}</Typography>
                <Typography className="text-muted">{clubs.length}</Typography>
            </div>

            {clubs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {clubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                </div>
            ) : (
                <div className="w-full flex justify-center">
                    <Typography type="h3">Нет кружков</Typography>
                </div>
            )}
        </div>
    )
}

export default ClubCardGrid
