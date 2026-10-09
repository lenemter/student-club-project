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
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        const emailTrimmed = email.trim();
        if (!emailTrimmed) {
            newErrors.email = "Введите email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
            newErrors.email = "Некорректный формат email (например, name@example.com)";
        }

        if (!password) {
            newErrors.password = "Введите пароль";
        } else if (password.length < 6) {
            newErrors.password = "Пароль должен содержать не менее 6 символов";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const success = login(email);
        if (success) {
            navigate("/");
        } else {
            setErrors({
                general: "Пользователь с таким email не найден. Зарегистрируйтесь или проверьте адрес.",
            });
        }
    }

    return (
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-2">
                <Typography type="h2">Вход</Typography>
                <Typography type="body">Войдите, чтобы управлять своими кружками</Typography>
            </div>

            {errors.general && (
                <div className="p-3 text-sm rounded-xl bg-danger-soft text-danger border border-danger/20">
                    {errors.general}
                </div>
            )}

            <TextField
                name="email"
                variant="secondary"
                type="email"
                autoComplete="email"
                value={email}
                isInvalid={Boolean(errors.email)}
                onChange={(val) => {
                    setEmail(val);
                    if (errors.email || errors.general) {
                        setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
                    }
                }}
            >
                <Label>Email</Label>
                <Input placeholder="example@example.com" />
                {errors.email ? <FieldError>{errors.email}</FieldError> : <FieldError />}
            </TextField>

            <PasswordField
                label="Пароль"
                autoComplete="current-password"
                value={password}
                errorMessage={errors.password}
                onChange={(val) => {
                    setPassword(val);
                    if (errors.password || errors.general) {
                        setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                    }
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
