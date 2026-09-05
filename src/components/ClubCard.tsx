import { Avatar, Button, Card } from "@heroui/react"
import { useNavigate } from "react-router-dom";

export interface ClubCardProps {
    name: string;
}

function ClubCard({ name }: ClubCardProps) {
    const navigate = useNavigate()

    return (
        <Button variant="ghost" onPress={() => navigate("/club")} className="w-full h-auto p-0 block text-left">
            <Card>
                <img
                    alt={name}
                    className="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
                    loading="lazy"
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
                />

                <Card.Header>
                    <Card.Title>{name}</Card.Title>
                    <Card.Description>148 участников</Card.Description>
                </Card.Header>

                <Card.Footer className="flex gap-2">
                    <Avatar aria-label="" className="size-5">
                        <Avatar.Image
                            alt=""
                            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
                        />
                        <Avatar.Fallback className="text-xs">АВ</Avatar.Fallback>
                    </Avatar>
                    <span className="text-xs">Абоба Викторович</span>
                </Card.Footer>
            </Card>
        </Button>
    )
}

export default ClubCard
