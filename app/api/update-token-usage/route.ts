import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, tokens } = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('update_token_usage', {
      p_user_id: userId,
      p_tokens: tokens
    });

    if (error) {
      console.error("Token usage update error:", error);
      return NextResponse.json(
        { message: "トークン使用量の更新中にエラーが発生しました" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "トークン使用量の更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token usage update error:", error);
    return NextResponse.json(
      { message: "リクエストの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 