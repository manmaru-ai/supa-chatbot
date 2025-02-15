import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.dify.ai/v1/conversations?user=${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "会話の取得に失敗しました" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Conversations API Error:", error);
    return NextResponse.json(
      { error: "会話履歴の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 