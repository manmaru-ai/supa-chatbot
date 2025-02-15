import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg border animate-fade-up">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">パスワードの再設定</h1>
          <p className="text-sm text-muted-foreground">
            新しいパスワードを設定してください
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                新しいパスワード
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2 transition-colors focus:ring-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                パスワードは6文字以上で設定してください
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                パスワードの確認
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 transition-colors focus:ring-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <SubmitButton
              className="w-full py-2.5 font-medium transition-all hover:shadow-md"
              formAction={resetPasswordAction}
              pendingText="パスワードを変更中..."
            >
              パスワードを変更
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-sm text-primary hover:text-primary/90 font-medium underline underline-offset-4"
            >
              サインイン画面に戻る
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 