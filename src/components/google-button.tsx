"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function GoogleButton() {
  return (
    <div className="w-full flex justify-end px-4 sm:px-8 py-4">
      <Button
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
          })
        }
      >
        Entrar com Google
      </Button>
    </div>
  );
}
