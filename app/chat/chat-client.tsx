"use client";

import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText, MessageSquare, Upload, X, PlusCircle, ChevronLeft, ClipboardCopy, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: UploadedFile[];
}

interface ChatSession {
  id: string;
  messages: Message[];
  files: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
}

interface Conversation {
  id: string;
  name: string;
  updated_at: number;
}

export function ChatPage({ user }: { user: User }) {
  const [currentChat, setCurrentChat] = useState<ChatSession>({
    id: "",
    messages: [],
    files: [],
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

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
      // トークン使用量をチェック
      const tokenCheckResponse = await fetch("/api/check-token-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          estimatedTokens: Math.ceil(userMessage.length / 4), // 簡易的なトークン数推定
        }),
      });

      if (!tokenCheckResponse.ok) {
        const errorData = await tokenCheckResponse.json();
        throw new Error(errorData.message || "トークン制限に達しました");
      }

      const files = currentChat.files.map(file => ({
        type: file.type.startsWith("image/") ? "image" : "document",
        transfer_method: "local_file",
        upload_file_id: file.id
      }));

      const response = await fetch("https://api.dify.ai/v1/chat-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: userMessage,
          response_mode: "blocking",
          conversation_id: currentChat.id || "",
          user: user.id,
          files: files || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Dify APIエラー: ${errorData.message || '不明なエラー'}`);
      }

      const data = await response.json();
      const answer = data.answer as string;
      const newConversationId = data.conversation_id as string;

      // トークン使用量を更新
      const usedTokens = Math.ceil((userMessage.length + answer.length) / 4); // 簡易的なトークン数計算
      await fetch("/api/update-token-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          tokens: usedTokens,
        }),
      });
      
      setCurrentChat(prev => ({
        id: newConversationId,
        messages: [...prev.messages, { role: "assistant", content: answer }],
        files: [],
      }));
    } catch (error) {
      console.error("Error:", error);
      setCurrentChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: error instanceof Error ? error.message : "申し訳ありません。エラーが発生しました。",
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
    setIsSidebarOpen(false);
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
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadedFiles: UploadedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user", user.id);

        const response = await fetch("https://api.dify.ai/v1/files/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("ファイルのアップロードに失敗しました");

        const data = await response.json();
        uploadedFiles.push({
          id: data.id,
          name: data.name,
          type: data.mime_type,
        });
      }

      setCurrentChat(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles],
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setCurrentChat(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId),
    }));
  };

  const handleCopyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(index);
      setTimeout(() => setCopiedMessageId(null), 2000); // 2秒後に非表示
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white">
      {/* サイドバー */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-gray-50 transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">チャット履歴</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4">
            <Button 
              onClick={handleNewChat}
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
                  variant={currentChat.id === conversation.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left flex items-center gap-2 px-3"
                  onClick={() => handleSelectChat(conversation.id)}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-sm">
                    {conversation.name || "新しいチャット"}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col h-screen w-full">
        {/* ヘッダー */}
        <div className="flex items-center border-b px-4 py-2 bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="mr-2"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {currentChat.id ? "チャット" : "新規チャット"}
          </h1>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto pb-36">
          <div className="max-w-3xl mx-auto py-8 px-4">
            {currentChat.messages.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2">お手伝いできることはありますか？</h2>
                <p className="text-gray-500">
                  メッセージを入力してチャットを開始してください
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentChat.messages.map((message, i) => (
                  <div key={i} className="group">
                    <div className={cn(
                      "relative rounded-lg px-4 py-2 transition-colors max-w-[85%] shadow-sm",
                      message.role === "assistant" 
                        ? "bg-gray-100 mr-auto" 
                        : "bg-blue-500 text-white ml-auto"
                    )}>
                      <div className={cn(
                        "prose max-w-none",
                        message.role === "user" && "prose-invert"
                      )}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus as any}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.files.map((file) => (
                            <div
                              key={file.id}
                              className={cn(
                                "flex items-center gap-1 rounded-md px-2 py-1",
                                message.role === "assistant" 
                                  ? "bg-white" 
                                  : "bg-blue-400"
                              )}
                            >
                              <FileText className={cn(
                                "h-3 w-3",
                                message.role === "assistant"
                                  ? "text-gray-500"
                                  : "text-white"
                              )} />
                              <span className={cn(
                                "text-xs truncate max-w-[120px]",
                                message.role === "assistant"
                                  ? "text-gray-600"
                                  : "text-white"
                              )}>
                                {file.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.role === "assistant" && (
                        <div className="flex gap-2 mt-2 items-center justify-end text-xs text-gray-500">
                          <button
                            onClick={() => handleCopyMessage(message.content, i)}
                            className="flex items-center gap-1 hover:text-gray-700"
                          >
                            <ClipboardCopy className="h-3 w-3" />
                            {copiedMessageId === i ? "コピーしました" : "コピー"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 入力エリア */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-3xl mx-auto p-4">
            {/* ファイルプレビュー */}
            {currentChat.files.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {currentChat.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1"
                  >
                    <FileText className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative rounded-xl border shadow-sm bg-white">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="min-h-[60px] max-h-[200px] flex-1 resize-none border-0 bg-transparent py-3 px-4 focus:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />

                {/* アクションボタン */}
                <div className="flex items-center justify-between border-t px-3 py-2">
                  <div className="flex gap-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      disabled={isUploading}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Plus className="h-5 w-5 text-gray-500" />
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".txt,.md,.pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.gif"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()} 
                    className="h-8 rounded-lg bg-black text-white hover:bg-gray-800 px-3 py-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            {isUploading && (
              <div className="mt-2 text-sm text-gray-500 text-center">
                ファイルをアップロード中...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 