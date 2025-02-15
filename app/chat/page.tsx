import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChatPage as ChatPageClient } from "./chat-client";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ChatPageClient user={user} />;
} 