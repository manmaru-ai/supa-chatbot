import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
}

export function FileUpload({ 
  onFileUpload,
  currentFiles = [],
  userId
}: { 
  onFileUpload: (files: UploadedFile[]) => void;
  currentFiles?: UploadedFile[];
  userId: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

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
        formData.append("user", userId);

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

      onFileUpload(uploadedFiles);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    onFileUpload(currentFiles.filter(file => file.id !== fileId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {currentFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1"
          >
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={() => removeFile(file.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isUploading}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "アップロード中..." : "ファイルを選択"}
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
    </div>
  );
} 