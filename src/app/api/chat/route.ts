import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamCoachResponse } from "@/lib/coaching-ai";
import type { UserProfile } from "@/lib/coaching-ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ messages: [] });

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { message } = await request.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
  }

  // Fetch profile for personalization
  const { data: profile } = await supabase
    .from("profiles")
    .select("addiction_type, severity, triggers, motivation, frequency, duration_label")
    .eq("id", user.id)
    .single();

  const userProfile: UserProfile | null = profile
    ? {
        addictionType: profile.addiction_type ?? "",
        severity: profile.severity ?? "",
        triggers: profile.triggers ?? [],
        motivation: profile.motivation ?? "",
        frequency: profile.frequency ?? "",
        durationLabel: profile.duration_label ?? "",
      }
    : null;

  // Fetch recent conversation history (last 20 messages)
  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(20);

  const conversationHistory = (history ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Add the new user message
  conversationHistory.push({ role: "user", content: message.trim() });

  // Save user message to DB
  await supabase.from("messages").insert({
    user_id: user.id,
    role: "user",
    content: message.trim(),
  });

  // Stream response from Anthropic
  const stream = await streamCoachResponse(conversationHistory, userProfile);

  let fullResponse = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const text = chunk.delta.text;
            fullResponse += text;
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`)
            );
          }
        }

        // Save assistant response to DB
        if (fullResponse) {
          await supabase.from("messages").insert({
            user_id: user.id,
            role: "assistant",
            content: fullResponse,
          });
        }

        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
