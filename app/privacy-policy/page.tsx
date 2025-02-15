import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">プライバシーポリシー</h1>
            <p className="text-muted-foreground">
              最終更新日: 2024年2月15日
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="space-y-4">
              <h2>1. はじめに</h2>
              <p>
                当サービスは、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                本プライバシーポリシーでは、当サービスにおける個人情報の取り扱いについて説明します。
              </p>
            </section>

            <section className="space-y-4">
              <h2>2. 収集する情報</h2>
              <p>当サービスでは、以下の情報を収集する場合があります：</p>
              <ul>
                <li>メールアドレス</li>
                <li>利用状況データ（トークン使用量など）</li>
                <li>その他サービス利用に関するデータ</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2>3. 情報の利用目的</h2>
              <p>収集した情報は、以下の目的で利用します：</p>
              <ul>
                <li>サービスの提供・運営</li>
                <li>ユーザーサポート</li>
                <li>サービスの改善・新機能の開発</li>
                <li>利用状況の分析</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2>4. 情報の保護</h2>
              <p>
                当サービスは、収集した個人情報の安全管理のために、適切な措置を講じています。
                また、法令に基づく場合を除き、収集した情報を第三者に提供することはありません。
              </p>
            </section>

            <section className="space-y-4">
              <h2>5. Cookieの使用</h2>
              <p>
                当サービスでは、ユーザー認証やサービス向上のためにCookieを使用しています。
                ブラウザの設定でCookieを無効にすることも可能ですが、一部の機能が利用できなくなる場合があります。
              </p>
            </section>

            <section className="space-y-4">
              <h2>6. お問い合わせ</h2>
              <p>
                プライバシーポリシーに関するお問い合わせは、サービス内のお問い合わせフォームよりご連絡ください。
              </p>
            </section>

            <section className="space-y-4">
              <h2>7. プライバシーポリシーの変更</h2>
              <p>
                当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                重要な変更がある場合は、サービス内で通知いたします。
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 