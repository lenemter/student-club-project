import { Button, Card, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function SignUpPage() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (password !== confirmPassword) {
            console.log("Пароли не совпадают")
            return
        }

        console.log("Регистрация:", { firstName, lastName, email, password })
        navigate("/")
    }

    return (
        <main className="bg-background min-h-screen flex items-center justify-center px-5">
            <Card variant="default" className="p-10 w-full max-w-md">
                <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1 mb-2">
                        <Typography type="h2">Регистрация</Typography>
                        <Typography type="body" className="text-default-500">
                            Создайте аккаунт, чтобы вступать в кружки и следить за расписанием
                        </Typography>
                    </div>

                    <TextField name="firstName" variant="secondary" isRequired onChange={(str) => setFirstName(str)}>
                        <Label>Имя</Label>
                        <Input placeholder="Иван" />
                        <FieldError />
                    </TextField>

                    <TextField name="lastName" variant="secondary" isRequired onChange={(str) => setLastName(str)}>
                        <Label>Имя</Label>
                        <Input placeholder="Петров" />
                        <FieldError />
                    </TextField>

                    <TextField name="email" variant="secondary" type="email" autoComplete="email" isRequired onChange={(str) => setEmail(str)}>
                        <Label>Email</Label>
                        <Input placeholder="example@example.com" />
                        <FieldError />
                    </TextField>

                    <TextField name="password" variant="secondary" type="password" autoComplete="new-password" isRequired onChange={(str) => setPassword(str)}>
                        <Label>Пароль</Label>
                        <Input placeholder="••••••••" />
                        <FieldError />
                    </TextField>

                    <TextField
                        name="confirmPassword"
                        variant="secondary"
                        type="password"
                        autoComplete="new-password"
                        isRequired
                        onChange={(str) => setConfirmPassword(str)}
                        validate={(value) => (value !== password ? "Пароли не совпадают." : null)}
                    >
                        <Label>Подтвердите пароль</Label>
                        <Input placeholder="••••••••" />
                        <FieldError />
                    </TextField>

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
            </Card>
        </main>
    )
}

export default SignUpPage
