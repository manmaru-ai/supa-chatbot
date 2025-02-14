"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { sendDifyRequest } from "@/utils/dify-client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newHistory: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const result = await sendDifyRequest(userMessage, conversationId);
      const answer = result.answer as string;
      const newConversationId = result.conversation_id as string;
      
      setMessages([...newHistory, { role: "assistant" as const, content: answer }]);
      setConversationId(newConversationId);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "申し訳ありません。エラーが発生しました。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground pt-20">
            メッセージを入力してチャットを開始してください
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="min-h-[60px] max-h-[200px]"
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 