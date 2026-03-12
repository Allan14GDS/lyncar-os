import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar no Lyncar</CardTitle>
          <CardDescription className="text-zinc-400">
            Bem-vindo de volta! Acesse o seu portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="border-zinc-700 bg-zinc-950 text-zinc-50 placeholder:text-zinc-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-zinc-200">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              required
              className="border-zinc-700 bg-zinc-950 text-zinc-50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
            Entrar
          </Button>
          <div className="text-sm text-zinc-400 text-center w-full">
            Não tem uma conta?{" "}
            <a href="#" className="text-zinc-50 hover:underline">
              Registre-se
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
