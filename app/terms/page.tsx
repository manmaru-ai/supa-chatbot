import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">利用規約</h1>
            <p className="text-muted-foreground">
              最終更新日: 2024年2月15日
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="space-y-4">
              <h2>1. はじめに</h2>
              <p>
                本利用規約は、当サービスの利用条件を定めるものです。
                ユーザーは、本規約に同意した上で当サービスを利用するものとします。
              </p>
            </section>

            <section className="space-y-4">
              <h2>2. サービスの利用</h2>
              <p>当サービスの利用にあたり、以下の点に同意するものとします：</p>
              <ul>
                <li>ユーザー登録時に正確な情報を提供すること</li>
                <li>アカウント情報の管理責任を負うこと</li>
                <li>不正アクセスや不正利用を行わないこと</li>
                <li>月間トークン制限を遵守すること</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2>3. 利用制限</h2>
              <p>
                当サービスは、以下の場合にユーザーのサービス利用を制限または停止することがあります：
              </p>
              <ul>
                <li>本規約に違反した場合</li>
                <li>不正利用が確認された場合</li>
                <li>月間トークン制限を超過した場合</li>
                <li>その他、当サービスが必要と判断した場合</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2>4. 知的財産権</h2>
              <p>
                当サービスに関する知的財産権は、当サービスまたはライセンサーに帰属します。
                ユーザーは、当サービスの内容を無断で複製、転載、改変することはできません。
              </p>
            </section>

            <section className="space-y-4">
              <h2>5. 免責事項</h2>
              <p>
                当サービスは、以下の事項について一切の責任を負いません：
              </p>
              <ul>
                <li>サービスの中断や停止</li>
                <li>データの消失や破損</li>
                <li>第三者による不正アクセス</li>
                <li>その他、当サービスの利用に関連して生じた損害</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2>6. 規約の変更</h2>
              <p>
                当サービスは、必要に応じて本規約を変更することがあります。
                変更後の規約は、当サービス上で公開された時点で効力を生じるものとします。
              </p>
            </section>

            <section className="space-y-4">
              <h2>7. 準拠法と管轄裁判所</h2>
              <p>
                本規約の解釈および適用は日本法に準拠するものとし、
                本規約に関する紛争については、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 