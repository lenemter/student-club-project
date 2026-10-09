import { Spinner } from "@heroui/react";

export interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({ message = "Загрузка...", className = "" }: LoadingStateProps) {
    return (
        <div className={`w-full flex flex-col items-center justify-center p-12 text-center ${className}`}>
            <Spinner size="lg" />
            {message && <p className="text-sm text-muted mt-3">{message}</p>}
        </div>
    );
}

export default LoadingState;
