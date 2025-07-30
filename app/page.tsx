"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <>
      <Authenticated>
        <div className="h-screen flex flex-col items-center justify-center">
          <p>Loading...</p>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="h-screen flex flex-col items-center justify-center bg-background">
          <div className="absolute top-4 right-4">
            <SignInButton />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Story Studio</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Sign in to create and manage your story timelines.
          </p>
        </div>
      </Unauthenticated>
    </>
  );
}
