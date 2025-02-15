import { Footer } from "@/components/footer";
import { Github } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">About</h1>
            <p className="text-muted-foreground">
              当サービスについて
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="space-y-4">
              <h2>サービス概要</h2>
              <p>
                当サービスは、AIを活用したチャットボットサービスです。
                ユーザーは、月間トークン制限内で、AIとの対話を通じて様々なタスクを実行することができます。
              </p>
            </section>

            <section className="space-y-4">
              <h2>主な機能</h2>
              <ul>
                <li>AIとのインタラクティブな対話</li>
                <li>自然言語による質問応答</li>
                <li>タスク自動化のサポート</li>
                <li>ユーザーごとのトークン使用量管理</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2>トークン制限について</h2>
              <p>
                当サービスでは、月間100,000トークンの制限を設けています。
                これは、サービスの安定的な運営とリソースの公平な分配を目的としています。
                トークン使用量は、プロフィールページで確認することができます。
              </p>
            </section>

            <section className="space-y-4">
              <h2>セキュリティとプライバシー</h2>
              <p>
                ユーザーの情報保護は当サービスの最優先事項です。
                強固なセキュリティ対策を実施し、個人情報の適切な管理を行っています。
                詳細については、プライバシーポリシーをご確認ください。
              </p>
            </section>

            <section className="space-y-4">
              <h2>開発者プロフィール</h2>
              <div className="flex flex-col items-center py-8">
                <div className="relative w-40 h-40 mb-6">
                  <Image
                    src="/icon.png"
                    alt="manmaru"
                    fill
                    className="rounded-full border-4 border-primary/20"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">manmaru</h3>
                <p className="text-muted-foreground mb-4">高専生 / プログラマー</p>
                <a
                  href="https://github.com/manmaru-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/90"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <div className="w-full max-w-2xl mt-8 space-y-4">
                  <p>
                    大阪公立大学工業高等専門学校の知能情報コースに所属する学生です。
                    プログラミングと新しい技術の探求に情熱を持って取り組んでいます。
                  </p>
                  <p>
                    特にAI技術に強い関心を持っており、このプラットフォームの開発を通じて、
                    より多くの人々が学習にアクセスできる環境を作ることを目指しています。
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 