import { Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordField } from "../../../shared/ui/PasswordField";

export function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        navigate("/");
    }

    return (
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-2">
                <Typography type="h2">Вход</Typography>
                <Typography type="body">Войдите, чтобы управлять своими кружками</Typography>
            </div>

            <TextField
                name="email"
                variant="secondary"
                type="email"
                autoComplete="email"
                isRequired
                value={email}
                onChange={setEmail}
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
                onChange={setPassword}
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
