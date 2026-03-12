import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Entrar no Lyncar
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Bem-vindo de volta! Acesse o seu portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              className="border-zinc-700 bg-zinc-950 text-white focus-visible:ring-zinc-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200">
            Entrar
          </Button>
          <div className="text-center text-sm text-zinc-400">
            Não tem uma conta?{" "}
            <a href="#" className="font-medium text-white hover:underline">
              Registre-se
            </a>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
