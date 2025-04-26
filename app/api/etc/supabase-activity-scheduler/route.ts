import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Supabaseプロジェクトが停止しないようにデータを取得
    const { data, error } = await supabase.from("conversations").select("id").limit(1);
    
    if (error) throw new Error(error.message);
    
    return Response.json({ 
      success: true, 
      message: "Supabase activity ping successful",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    const message = (error as Error).message ?? "エラーが発生しました。";
    return Response.json({ error: message }, { status: 400 });
  }
} 