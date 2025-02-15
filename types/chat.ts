export interface UploadedFile {
  id: string;
  name: string;
  type: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  files?: UploadedFile[];
}

export interface ChatSession {
  id: string;
  messages: Message[];
  files: UploadedFile[];
} 