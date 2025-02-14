import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
      <ChatInterface user={user} />
    </div>
  );
} 