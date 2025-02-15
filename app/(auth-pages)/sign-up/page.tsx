import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg border animate-fade-up">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">アカウントを作成</h1>
          <p className="text-sm text-muted-foreground">
            すでにアカウントをお持ちの方は{" "}
            <Link className="text-primary hover:text-primary/90 font-medium underline underline-offset-4" href="/sign-in">
              サインイン
            </Link>
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                メールアドレス
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full px-4 py-2 transition-colors focus:ring-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                minLength={6}
                required
                className="w-full px-4 py-2 transition-colors focus:ring-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                パスワードは6文字以上で設定してください
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="terms" required />
              <Label htmlFor="terms" className="text-sm leading-none">
                <span className="text-muted-foreground">
                  <Link href="/terms" className="text-primary hover:text-primary/90 font-medium underline underline-offset-4">
                    利用規約
                  </Link>
                  に同意します
                </span>
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <SubmitButton
              className="w-full py-2.5 font-medium transition-all hover:shadow-md"
              formAction={signUpAction}
              pendingText="アカウント作成中..."
            >
              アカウントを作成
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
