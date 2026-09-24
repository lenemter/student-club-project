import { Button, FieldError, InputGroup, Label, TextField, type TextFieldProps } from "@heroui/react"
import { Eye, EyeSlash } from "@gravity-ui/icons"
import { useState } from "react"

interface PasswordFieldProps extends Omit<TextFieldProps, "children" | "type"> {
    label: string;
    placeholder?: string;
}

function PasswordField({ label, onChange, ...props }: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <TextField variant="secondary" onChange={onChange} {...props}>
            <Label>{label}</Label>
            <InputGroup>
                <InputGroup.Input
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••"
                />
                <InputGroup.Suffix className="pr-0">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
                        onPress={() => setIsVisible(!isVisible)}
                    >
                        {isVisible ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                </InputGroup.Suffix>
            </InputGroup>
            <FieldError />
        </TextField>
    )
}

export default PasswordField
