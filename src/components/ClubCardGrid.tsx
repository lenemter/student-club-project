import { Typography } from "@heroui/react";
import ClubCard, { type ClubCardProps } from "./ClubCard";

interface ClubCardGridProps {
    title: string;
    cards: ClubCardProps[];
}

function ClubCardGrid({ title, cards }: ClubCardGridProps) {
    return (
        <>
            <Typography type="h2">{title}</Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cards.map((card) => (
                    <ClubCard key={card.name} name={card.name} />
                ))}
            </div>
        </>
    )
}

export default ClubCardGrid
