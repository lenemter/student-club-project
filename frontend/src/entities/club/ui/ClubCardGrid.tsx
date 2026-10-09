import { Typography, Card, Skeleton } from "@heroui/react";
import type { ReactNode } from "react";
import ClubCard from "./ClubCard";
import type { Club } from "../../../shared/types";
import { EmptyState } from "../../../shared/ui/EmptyState";

export interface ClubCardGridProps {
    title: string;
    clubs: Club[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: ReactNode;
}

export function ClubCardGrid({
    title,
    clubs,
    isLoading = false,
    emptyTitle = "Нет кружков",
    emptyDescription,
    emptyAction,
}: ClubCardGridProps) {
    return (
        <div>
            <div className="flex items-baseline gap-2 mb-3">
                <Typography type="h2">{title}</Typography>
                {!isLoading && <Typography className="text-muted">{clubs.length}</Typography>}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="p-4 flex flex-col gap-3">
                            <Skeleton className="aspect-square w-14 rounded-2xl" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-3/4 rounded-lg" />
                                <Skeleton className="h-3 w-1/2 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-2 mt-auto">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-3 w-1/3 rounded-lg" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : clubs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {clubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                />
            )}
        </div>
    );
}

export default ClubCardGrid;
