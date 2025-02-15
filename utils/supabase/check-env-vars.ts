// This check can be removed
// it is just for tutorial purposes

export const hasEnvVars = 
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!hasEnvVars) {
  console.error(
    "環境変数が設定されていません。.env.localファイルを確認してください。"
  );
}
