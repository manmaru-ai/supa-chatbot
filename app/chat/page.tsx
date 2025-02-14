import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
      <iframe
        src="https://uqhgdpdkhyimlomugafw.dify.ai"
        className="w-full h-[85vh] border-0"
        allow="microphone"
      />
    </div>
  );
} 