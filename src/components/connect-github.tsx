"use client"
import { useState } from "react";
import { linkSocial } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
interface ConnectGithubProps {
    title?: string;
    description?: string;
    className?: string;
}

export function ConnectGithub({
    title = "Connect your Github account",
    description = "Link your Github account to access your repositories.",
    className,
}: ConnectGithubProps) {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await linkSocial({
                provider: "github",
                callbackURL: window.location.href,
            });
        } catch (error) {
            console.error("Failed to connect to Github:", error);
            setIsConnecting(false);
        }
    };
    return (
        <Card className={cn(className)}>
            <CardContent className="py-12 text-center">
                <div className="mx-auto size-14 rounded-full bg-muted flex items-center justify-center">
                    <FaGithub className="text-muted-foreground size-7" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{description}</p>
                <Button className="mt-6 cursor-pointer"
                    onClick={handleConnect}
                    disabled={isConnecting}
                   
                >
                    {isConnecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <FaGithub className="size-4" />
                            Connect Github
                        </>
                    )}
                </Button>
            </CardContent>

        </Card>

    )

}
