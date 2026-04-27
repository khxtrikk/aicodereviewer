import { HealthCheck } from "@/components/health-check";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div>
      <h1>Welcome to AiCodeReviewer!</h1>
      <p>Start reviewing your code!</p>
      </div>
      <div className="flex gap-4">
        <Link href="/sign-in" className={cn(buttonVariants({ variant: "default" }))}>
          Login
        </Link>
        <Link href="/sign-up" className={cn(buttonVariants({ variant: "outline" }))}>
          Sign Up
        </Link>
      </div>
      <HealthCheck />
    </div>
  );
}
