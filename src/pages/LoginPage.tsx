import { Button, Card, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log("Вход:", { email, password })
        navigate("/")
    }

    return (
        <main className="bg-background min-h-screen flex items-center justify-center px-4">
            <Card variant="default" className="p-10 w-full max-w-md">
                <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1 mb-2">
                        <Typography type="h2">Вход</Typography>
                        <Typography type="body" className="text-default-500">
                            Войдите, чтобы управлять своими кружками
                        </Typography>
                    </div>

                    <TextField name="email" variant="secondary" type="email" autoComplete="email" isRequired onChange={(str) => setEmail(str)}>
                        <Label>Email</Label>
                        <Input placeholder="example@example.com" />
                        <FieldError />
                    </TextField>

                    <TextField name="password" variant="secondary" type="password" autoComplete="current-password" isRequired onChange={(str) => setPassword(str)}>
                        <Label>Пароль</Label>
                        <Input placeholder="••••••••" />
                        <FieldError />
                    </TextField>

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
            </Card>
        </main>
    )
}

export default LoginPage
