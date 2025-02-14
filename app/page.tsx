import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Book, Calculator } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-6xl">
          高専ChatBot
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          高専生の学習・研究・学生生活をサポートする専門的なAIアシスタント。
          専門科目から実験レポートまで、あなたの学びをサポートします。
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 max-w-4xl w-full">
        <div className="p-6 border rounded-lg bg-card">
          <Book className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">専門知識のサポート</h3>
          <p className="text-muted-foreground">
            数学、物理、専門科目など、高専特有の学習内容について分かりやすく解説します。
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <Calculator className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">実験・レポートのアシスト</h3>
          <p className="text-muted-foreground">
            実験データの分析や考察、レポートの作成方法についてアドバイスを提供します。
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
