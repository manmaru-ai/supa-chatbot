import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, estimatedTokens } = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('check_token_usage', {
      p_user_id: userId,
      p_tokens: estimatedTokens
    });

    if (error) {
      return NextResponse.json(
        { message: "トークン使用量の確認中にエラーが発生しました" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "月間トークン制限（100,000トークン）に達しました" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "リクエストの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 