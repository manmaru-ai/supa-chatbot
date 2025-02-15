import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversation_id");
    const userId = searchParams.get("user");

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "会話IDとユーザーIDが必要です" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.dify.ai/v1/messages?conversation_id=${conversationId}&user=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "メッセージの取得に失敗しました" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Messages API Error:", error);
    return NextResponse.json(
      { error: "メッセージの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 