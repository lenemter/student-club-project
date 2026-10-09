import { Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordField } from "../../../shared/ui/PasswordField";

export function SignUpForm() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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

            <TextField
                name="firstName"
                variant="secondary"
                isRequired
                value={firstName}
                onChange={setFirstName}
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
                onChange={setLastName}
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
                onChange={setEmail}
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
                onChange={setPassword}
            />

            <PasswordField
                label="Подтвердите пароль"
                autoComplete="new-password"
                isRequired
                value={confirmPassword}
                onChange={setConfirmPassword}
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
