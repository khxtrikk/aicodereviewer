"use client";


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        console.log("submitting:", { name, email, password });
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signUp.email({
            name,
            email,
            password,
        });

        if (result.error) {
            console.log("full error:", result.error);
            setError(result.error.message || "An error occurred during sign-in.");
            setLoading(false);
            //return;
        } else {
            router.push("/repos");
        }
    };

    const handleGithubSignIn = async () => {
        setLoading(true);
        setError("");

        await signIn.social({
            provider: "github",
            callbackURL: "/repos",
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Sign up  using your email or GitHub.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGithubSignIn}
                        disabled={loading}
                    >
                        <FaGithub className="mr-2 size-4" />
                        Sign up with GitHub
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                OR CONTINUE WITH EMAIL
                            </span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleEmailSignIn}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="***********"
                                disabled={loading}
                                />
                            </div>

                            {error && <p className="text-red-500">{error}</p>}

                            <Button className="w-full cursor-pointer" type="submit" disabled={loading}>
                                    {loading ? "Loading..." : "Sign Up"}
                            </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?<Link href="/sign-in"> Sign In</Link> 

                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

