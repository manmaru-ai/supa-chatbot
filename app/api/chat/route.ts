import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, conversationId, userId, files } = await request.json();

    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: "blocking",
        conversation_id: conversationId || "",
        user: userId,
        files: files || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Dify APIエラー" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "チャットの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 