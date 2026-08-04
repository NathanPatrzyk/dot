import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/google-button";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex pt-16 sm:pt-32 items-center max-w-md justify-center mx-auto">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl">
          <span className="font-semibold">dot</span> • Tarefas
        </h2>
        <p className="flex flex-col gap-2">
          <span>Um jeito simples de organizar suas tarefas do dia a dia.</span>
          <span>
            Entre com sua conta Google para acessar sua lista, sincronizada e
            disponível sempre que você precisar.
          </span>
        </p>
        <GoogleButton />
        <Separator />
        <div className="flex justify-center">
          <Button variant="link">
            <Link href="/privacy-policy">Política de Privacidade</Link>
          </Button>
          <Button variant="link">
            <Link href="/terms-of-use">Termos de Uso</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
