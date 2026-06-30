import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildExportText, buildExportPdf, type ExportEntry } from "@/lib/export";

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const format = new URL(request.url).searchParams.get("format") === "pdf" ? "pdf" : "txt";

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("id, created_at, mood_score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const entryIds = (entries ?? []).map((e) => e.id);
  const { data: allMessages } = entryIds.length
    ? await supabase
        .from("entry_messages")
        .select("entry_id, role, content, created_at")
        .in("entry_id", entryIds)
        .order("created_at", { ascending: true })
    : { data: [] as { entry_id: string; role: "user" | "assistant"; content: string }[] };

  const exportEntries: ExportEntry[] = (entries ?? []).map((e) => ({
    createdAt: e.created_at,
    moodScore: e.mood_score,
    messages: (allMessages ?? [])
      .filter((m) => m.entry_id === e.id)
      .map((m) => ({ role: m.role, content: m.content })),
  }));

  if (format === "pdf") {
    const pdfBytes = await buildExportPdf(exportEntries);
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="mon-journal-ancrage.pdf"',
      },
    });
  }

  const text = buildExportText(exportEntries);
  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mon-journal-ancrage.txt"',
    },
  });
}
