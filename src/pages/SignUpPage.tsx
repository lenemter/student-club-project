import { Button, Card, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import PasswordField from "../components/PasswordField"

function SignUpPage() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        console.log("Регистрация:", { firstName, lastName, email, password })
        navigate("/")
    }

    return (
        <main className="bg-background min-h-screen flex items-center justify-center px-4">
            <Card variant="default" className="p-10 w-full max-w-md">
                <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1 mb-2">
                        <Typography type="h2">Регистрация</Typography>
                        <Typography type="body">
                            Создайте аккаунт, чтобы вступать в кружки и следить за расписанием
                        </Typography>
                    </div>

                    <TextField name="firstName" variant="secondary" isRequired onChange={(str) => setFirstName(str)}>
                        <Label>Имя</Label>
                        <Input placeholder="Иван" />
                        <FieldError />
                    </TextField>

                    <TextField name="lastName" variant="secondary" isRequired onChange={(str) => setLastName(str)}>
                        <Label>Фамилия</Label>
                        <Input placeholder="Петров" />
                        <FieldError />
                    </TextField>

                    <TextField name="email" variant="secondary" type="email" autoComplete="email" isRequired onChange={(str) => setEmail(str)}>
                        <Label>Email</Label>
                        <Input placeholder="example@example.com" />
                        <FieldError />
                    </TextField>

                    <PasswordField label="Пароль" autoComplete="new-password" isRequired onChange={(str) => setPassword(str)} />

                    <PasswordField
                        label="Подтвердите пароль"
                        autoComplete="new-password"
                        isRequired
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
            </Card>
        </main>
    )
}

export default SignUpPage
