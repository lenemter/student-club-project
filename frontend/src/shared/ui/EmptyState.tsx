import { Typography } from "@heroui/react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function EmptyState({ title, description, action, icon, className = "" }: EmptyStateProps) {
    return (
        <div className={`w-full flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-surface/50 border border-dashed border-border ${className}`}>
            {icon && <div className="mb-3 text-muted">{icon}</div>}
            <Typography type="h4" className="font-semibold">{title}</Typography>
            {description && <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export default EmptyState;
