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
  }, [user.id]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`https://api.dify.ai/v1/conversations?user=${user.id}`, {
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
    <div className="w-full h-full bg-gray-50 border-r overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <Button 
          onClick={onNewChat}
          className="w-full flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          新規チャット
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={currentConversationId === conversation.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left flex items-center gap-2 px-3"
              onClick={() => onSelectChat(conversation.id)}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-sm">{conversation.name || "新しいチャット"}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 