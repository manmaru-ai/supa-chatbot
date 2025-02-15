import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { KeyRound, Mail } from "lucide-react";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg border animate-fade-up">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">パスワードをお忘れですか？</h1>
          <p className="text-sm text-muted-foreground">
            登録したメールアドレスにパスワード再設定用のリンクを送信します
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
          </div>

          <div className="space-y-4">
            <SubmitButton
              className="w-full py-2.5 font-medium transition-all hover:shadow-md"
              formAction={forgotPasswordAction}
              pendingText="送信中..."
            >
              再設定リンクを送信
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
