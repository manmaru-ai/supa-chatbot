import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="bg-muted/30 backdrop-blur-sm px-6 py-4 border rounded-lg shadow-sm flex gap-4 transition-all hover:bg-muted/40">
      <InfoIcon size={18} className="text-primary/70 flex-shrink-0 mt-0.5" />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          <strong className="font-medium text-foreground">注意:</strong>{" "}
          メール送信には制限があります。制限を解除するにはカスタムSMTPを設定してください。
        </p>
        <Link
          href="https://supabase.com/docs/guides/auth/auth-smtp"
          target="_blank"
          className="text-primary/70 hover:text-primary flex items-center text-sm gap-1 transition-colors"
        >
          詳しく見る <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
