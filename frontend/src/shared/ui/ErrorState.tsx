import { TriangleExclamation } from "@gravity-ui/icons";
import { Button, Typography } from "@heroui/react";
import type { ReactNode } from "react";

export interface ErrorStateProps {
    title?: string;
    message?: string;
    action?: ReactNode;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = "Произошла ошибка",
    message = "Не удалось загрузить данные. Попробуйте повторить попытку позже.",
    action,
    onRetry,
    className = "",
}: ErrorStateProps) {
    return (
        <div
            className={`w-full flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-danger-soft/30 border border-danger/20 ${className}`}
        >
            <div className="mb-3 text-danger">
                <TriangleExclamation className="size-10" />
            </div>
            <Typography type="h3" className="text-danger font-semibold">
                {title}
            </Typography>
            {message && <p className="text-sm text-muted mt-2 max-w-md">{message}</p>}
            <div className="mt-4 flex gap-3">
                {onRetry && (
                    <Button variant="secondary" onPress={onRetry}>
                        Повторить попытку
                    </Button>
                )}
                {action}
            </div>
        </div>
    );
}

export default ErrorState;
