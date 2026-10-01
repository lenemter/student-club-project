import { Button, Typography } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";

interface NotFoundPageProps {
    message?: string;
}

function NotFoundPage({ message = "Страница не найдена" }: NotFoundPageProps) {
    const navigate = useNavigate();

    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <Typography type="h1">404</Typography>
                    <Typography>{message}</Typography>
                    <Button onPress={() => navigate("/")}>На главную</Button>
                </div>
            </div>
        </main>
    );
}

export default NotFoundPage;
