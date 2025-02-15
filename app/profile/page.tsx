import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, User, Clock } from "lucide-react";
import Link from "next/link";

async function getTokenUsage(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('token_usage')
    .select('tokens_used')
    .eq('user_id', userId)
    .eq('month_start', new Date().toISOString().slice(0, 7) + '-01')
    .single();

  if (error) {
    console.error('Error fetching token usage:', error);
    return 0;
  }

  return data?.tokens_used || 0;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const tokenUsage = await getTokenUsage(user.id);
  const monthlyLimit = 100000;
  const usagePercentage = (tokenUsage / monthlyLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">プロフィール</h1>
          <p className="text-muted-foreground">
            アカウント情報とトークン使用状況を確認できます
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ユーザー情報カード */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">アカウント情報</h2>
                <p className="text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </Card>

          {/* トークン使用状況カード */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">トークン使用状況</h2>
                <p className="text-sm text-muted-foreground">
                  今月の使用量
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{tokenUsage.toLocaleString()} トークン</span>
                <span>{monthlyLimit.toLocaleString()} トークン</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}の使用状況
              </p>
            </div>
          </Card>
        </div>

        {/* リンク一覧 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link 
            href="/privacy-policy"
            className="p-4 bg-card hover:bg-muted transition-colors rounded-lg border text-center"
          >
            プライバシーポリシー
          </Link>
          <Link 
            href="/terms"
            className="p-4 bg-card hover:bg-muted transition-colors rounded-lg border text-center"
          >
            利用規約
          </Link>
          <Link 
            href="/about"
            className="p-4 bg-card hover:bg-muted transition-colors rounded-lg border text-center"
          >
            サービスについて
          </Link>
        </div>
      </div>
    </div>
  );
} 