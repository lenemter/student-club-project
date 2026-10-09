import { Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { useStore } from "../../../app/providers/StoreContext";

export function SignUpForm() {
    const navigate = useNavigate();
    const { signup, users } = useStore();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "Введите имя";
        } else if (firstName.trim().length < 2) {
            newErrors.firstName = "Имя должно содержать не менее 2 символов";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "Введите фамилию";
        } else if (lastName.trim().length < 2) {
            newErrors.lastName = "Фамилия должна содержать не менее 2 символов";
        }

        const emailTrimmed = email.trim();
        if (!emailTrimmed) {
            newErrors.email = "Введите email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
            newErrors.email = "Некорректный формат email (например, name@example.com)";
        } else if (users.some((u) => u.email.toLowerCase() === emailTrimmed.toLowerCase())) {
            newErrors.email = "Пользователь с таким email уже зарегистрирован";
        }

        if (!password) {
            newErrors.password = "Введите пароль";
        } else if (password.length < 6) {
            newErrors.password = "Пароль должен содержать не менее 6 символов";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Подтвердите пароль";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) {
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

            {errors.general && (
                <div className="p-3 text-sm rounded-xl bg-danger-soft text-danger border border-danger/20">
                    {errors.general}
                </div>
            )}

            <TextField
                name="firstName"
                variant="secondary"
                value={firstName}
                isInvalid={Boolean(errors.firstName)}
                onChange={(val) => {
                    setFirstName(val);
                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
            >
                <Label>Имя</Label>
                <Input placeholder="Иван" />
                {errors.firstName ? <FieldError>{errors.firstName}</FieldError> : <FieldError />}
            </TextField>

            <TextField
                name="lastName"
                variant="secondary"
                value={lastName}
                isInvalid={Boolean(errors.lastName)}
                onChange={(val) => {
                    setLastName(val);
                    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
            >
                <Label>Фамилия</Label>
                <Input placeholder="Петров" />
                {errors.lastName ? <FieldError>{errors.lastName}</FieldError> : <FieldError />}
            </TextField>

            <TextField
                name="email"
                variant="secondary"
                type="email"
                autoComplete="email"
                value={email}
                isInvalid={Boolean(errors.email)}
                onChange={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
            >
                <Label>Email</Label>
                <Input placeholder="example@example.com" />
                {errors.email ? <FieldError>{errors.email}</FieldError> : <FieldError />}
            </TextField>

            <PasswordField
                label="Пароль"
                autoComplete="new-password"
                value={password}
                errorMessage={errors.password}
                onChange={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
            />

            <PasswordField
                label="Подтвердите пароль"
                autoComplete="new-password"
                value={confirmPassword}
                errorMessage={errors.confirmPassword}
                onChange={(val) => {
                    setConfirmPassword(val);
                    if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                }}
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
