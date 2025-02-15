import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">サービス</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  サービスについて
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground">
                  プロフィール
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-foreground">
                  チャット
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">サポート</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">開発者</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/manmaru-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 高専ChatBot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 