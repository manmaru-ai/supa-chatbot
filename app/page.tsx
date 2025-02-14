import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-6xl">
          AI Chat Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          あなたの質問に24時間365日お答えする、スマートなAIアシスタント。
          ビジネス、学習、日常生活のあらゆる場面でサポートします。
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 max-w-4xl w-full">
        <div className="p-6 border rounded-lg bg-card">
          <MessageCircle className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">インテリジェントな会話</h3>
          <p className="text-muted-foreground">
            自然な会話でコミュニケーション。あなたの意図を理解し、的確な回答を提供します。
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <MessageCircle className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">24時間対応</h3>
          <p className="text-muted-foreground">
            いつでもどこでも、必要な時にサポートを受けることができます。
          </p>
        </div>
      </div>

      <Link href="/chat" className="mt-8">
        <Button size="lg" className="px-8">
          チャットを始める
          <MessageCircle className="ml-2 w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
}
