import { Card } from "@heroui/react";
import { LoginForm } from "../../features/auth";

export function LoginPage() {
    return (
        <main className="bg-background min-h-screen flex items-center justify-center px-4">
            <Card variant="default" className="p-10 w-full max-w-md">
                <LoginForm />
            </Card>
        </main>
    );
}

export default LoginPage;
