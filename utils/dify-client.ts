"use server";

interface DifyFile {
  type: string;
  transfer_method: string;
  upload_file_id: string;
}

export async function sendDifyRequest(
  message: string, 
  conversationId?: string,
  files?: DifyFile[],
  userId?: string
): Promise<any> {
  try {
    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: "blocking",
        conversation_id: conversationId || "",
        user: userId,
        files: files || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Dify API Error:", errorData);
      throw new Error(`Dify APIエラー: ${errorData.message || '不明なエラー'}`);
    }

    const data = await response.json();
    console.log("Dify API Response:", data);
    return data;
  } catch (error) {
    console.error("Dify APIリクエストエラー:", error);
    throw error;
  }
} 