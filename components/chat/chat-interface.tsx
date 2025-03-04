"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { FileUpload } from "@/components/chat/file-upload";
import { sendDifyRequest } from "@/utils/dify-client";
import { Message, ChatSession, UploadedFile } from "@/types/chat";

export function ChatInterface({ user }: { user: User }) {
  const [currentChat, setCurrentChat] = useState<ChatSession>({
    id: "",
    messages: [],
    files: [],
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessage: Message = { 
      role: "user", 
      content: userMessage,
      files: currentChat.files 
    };
    const newHistory = [...currentChat.messages, newMessage];
    setCurrentChat(prev => ({
      ...prev,
      messages: newHistory
    }));
    setIsLoading(true);

    try {
      const files = currentChat.files.map(file => ({
        type: file.type.startsWith("image/") ? "image" : "document",
        transfer_method: "local_file",
        upload_file_id: file.id
      }));

      const result = await sendDifyRequest(userMessage, currentChat.id, files, user.id);
      const answer = result.answer as string;
      const newConversationId = result.conversation_id as string;
      
      setCurrentChat(prev => ({
        id: newConversationId,
        messages: [...prev.messages, { role: "assistant", content: answer }],
        files: [], // メッセージ送信後はファイルをクリア
      }));
    } catch (error) {
      console.error("Error:", error);
      setCurrentChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: "申し訳ありません。エラーが発生しました。",
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChat({
      id: "",
      messages: [],
      files: [],
    });
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      const response = await fetch(`https://api.dify.ai/v1/messages?conversation_id=${chatId}&user=${user.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
      });
      
      if (!response.ok) throw new Error("メッセージの取得に失敗しました");
      
      const data = await response.json();
      const messages: Message[] = [];
      
      // データを順番に処理して、ユーザーのクエリとアシスタントの回答を交互に追加
      data.data.forEach((msg: any) => {
        if (msg.query) {
          messages.push({
            role: "user",
            content: msg.query,
            files: msg.message_files || [],
          });
        }
        if (msg.answer) {
          messages.push({
            role: "assistant",
            content: msg.answer,
          });
        }
      });
      
      setCurrentChat({
        id: chatId,
        messages,
        files: [],
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleFileUpload = (files: UploadedFile[]) => {
    setCurrentChat(prev => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };

  const handleEditMessage = (index: number, newContent: string) => {
    if (currentChat.messages[index].role !== 'user') return;
    
    setCurrentChat(prev => ({
      ...prev,
      messages: prev.messages.map((msg, i) => 
        i === index ? { ...msg, content: newContent } : msg
      )
    }));
    setEditingMessageIndex(null);
  };

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* モバイル用のサイドバートグルボタン */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full p-2 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* サイドバー */}
      <div className={`
        fixed md:relative
        w-[280px] md:w-64
        h-screen
        transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        z-40
      `}>
        <ChatSidebar
          user={user}
          currentConversationId={currentChat.id}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col h-screen w-full">
        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 md:p-6">
          {currentChat.messages.map((message, i) => (
            <div key={i} className="space-y-2 group">
              <div className="relative">
                {editingMessageIndex === i ? (
                  <div className="flex gap-2">
                    <Textarea
                      value={message.content}
                      onChange={(e) => handleEditMessage(i, e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => setEditingMessageIndex(null)}
                    >
                      保存
                    </Button>
                  </div>
                ) : (
                  <>
                    <ChatMessage message={message} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.role === 'user' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMessageIndex(i)}
                        >
                          編集
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        コピー
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {message.files && message.files.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-4">
                  {message.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1"
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {currentChat.messages.length === 0 && (
            <div className="text-center text-muted-foreground pt-20">
              メッセージを入力してチャットを開始してください
            </div>
          )}
        </div>

        {/* 入力エリア */}
        <div className="p-4 md:p-6 space-y-4 border-t bg-white">
          <div className="space-y-2">
            <FileUpload 
              onFileUpload={handleFileUpload}
              currentFiles={currentChat.files}
              userId={user.id}
            />
            {currentChat.files.length > 0 && (
              <p className="text-sm text-gray-500">
                ※ 次のメッセージに {currentChat.files.length} 個のファイルが添付されます
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              className="min-h-[60px] max-h-[200px]"
              onKeyDown={(e) => {
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
      </div>
    </div>
  );
} 