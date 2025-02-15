import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  name: string;
  updated_at: number;
}

export function ChatSidebar({ 
  user, 
  currentConversationId,
  onNewChat,
  onSelectChat 
}: { 
  user: User;
  currentConversationId?: string;
  onNewChat: () => void;
  onSelectChat: (conversationId: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("https://api.dify.ai/v1/conversations?user=abc-123", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
      });
      
      if (!response.ok) throw new Error("会話の取得に失敗しました");
      
      const data = await response.json();
      setConversations(data.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r p-4">
      <Button 
        onClick={onNewChat}
        className="w-full mb-4 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        新規チャット
      </Button>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant={currentConversationId === conversation.id ? "secondary" : "ghost"}
            className="w-full justify-start text-left flex items-center gap-2"
            onClick={() => onSelectChat(conversation.id)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="truncate">{conversation.name || "新しいチャット"}</span>
          </Button>
        ))}
      </div>
    </div>
  );
} 