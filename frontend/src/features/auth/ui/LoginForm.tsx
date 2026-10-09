import { Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { useStore } from "../../../app/providers/StoreContext";

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        const success = login(email);
        if (success) {
            navigate("/");
        } else {
            setError("Пользователь с таким email не найден. Проверьте адрес или зарегистрируйтесь.");
        }
    }

    return (
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-2">
                <Typography type="h2">Вход</Typography>
                <Typography type="body">Войдите, чтобы управлять своими кружками</Typography>
            </div>

            {error && (
                <div className="p-3 text-sm rounded-xl bg-danger-soft text-danger border border-danger/20">
                    {error}
                </div>
            )}

            <TextField
                name="email"
                variant="secondary"
                type="email"
                autoComplete="email"
                isRequired
                value={email}
                onChange={(val) => {
                    setEmail(val);
                    setError(null);
                }}
            >
                <Label>Email</Label>
                <Input placeholder="example@example.com" />
                <FieldError />
            </TextField>

            <PasswordField
                label="Пароль"
                autoComplete="current-password"
                isRequired
                value={password}
                onChange={(val) => {
                    setPassword(val);
                    setError(null);
                }}
            />

            <Button type="submit" size="lg" className="mt-2">
                Войти
            </Button>

            <Typography type="body" className="text-center">
                Нет аккаунта?{" "}
                <Link to="/signup" className="underline">
                    Зарегистрироваться
                </Link>
            </Typography>
        </Form>
    );
}

export default LoginForm;
