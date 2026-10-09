import { Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { useStore } from "../../../app/providers/StoreContext";

export function SignUpForm() {
    const navigate = useNavigate();
    const { signup } = useStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            setError("Пожалуйста, заполните все обязательные поля");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        signup({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            aboutMe: "Студент",
            avatarUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
        });

        navigate("/");
    }

    return (
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-2">
                <Typography type="h2">Регистрация</Typography>
                <Typography type="body">
                    Создайте аккаунт, чтобы вступать в кружки и следить за расписанием
                </Typography>
            </div>

            {error && (
                <div className="p-3 text-sm rounded-xl bg-danger-soft text-danger border border-danger/20">
                    {error}
                </div>
            )}

            <TextField
                name="firstName"
                variant="secondary"
                isRequired
                value={firstName}
                onChange={(val) => {
                    setFirstName(val);
                    setError(null);
                }}
            >
                <Label>Имя</Label>
                <Input placeholder="Иван" />
                <FieldError />
            </TextField>

            <TextField
                name="lastName"
                variant="secondary"
                isRequired
                value={lastName}
                onChange={(val) => {
                    setLastName(val);
                    setError(null);
                }}
            >
                <Label>Фамилия</Label>
                <Input placeholder="Петров" />
                <FieldError />
            </TextField>

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
                autoComplete="new-password"
                isRequired
                value={password}
                onChange={(val) => {
                    setPassword(val);
                    setError(null);
                }}
            />

            <PasswordField
                label="Подтвердите пароль"
                autoComplete="new-password"
                isRequired
                value={confirmPassword}
                onChange={(val) => {
                    setConfirmPassword(val);
                    setError(null);
                }}
                validate={(value) => (value !== password ? "Пароли не совпадают." : null)}
            />

            <Button type="submit" size="lg" className="mt-2">
                Зарегистрироваться
            </Button>

            <Typography type="body" className="text-center">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="underline">
                    Войти
                </Link>
            </Typography>
        </Form>
    );
}

export default SignUpForm;
