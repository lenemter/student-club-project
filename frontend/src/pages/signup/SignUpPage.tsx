import { Card } from "@heroui/react";
import { SignUpForm } from "../../features/auth";

export function SignUpPage() {
    return (
        <main className="bg-background min-h-screen flex items-center justify-center px-4">
            <Card variant="default" className="p-10 w-full max-w-md">
                <SignUpForm />
            </Card>
        </main>
    );
}

export default SignUpPage;
