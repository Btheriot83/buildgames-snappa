import { NextResponse } from "next/server";
import {
  hasAssistProvider,
  runAssist,
  type AssistRequest,
} from "@/lib/ai/assist";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    configured: hasAssistProvider(),
    providers: [
      "BUILD_GAMES_LLM_API_KEY",
      "XAI_API_KEY",
      "GROK_API_KEY",
      "OPENAI_API_KEY",
    ],
  });
}

export async function POST(req: Request) {
  let body: AssistRequest;
  try {
    body = (await req.json()) as AssistRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.brief?.trim() || !body?.canvas?.width || !body?.canvas?.height) {
    return NextResponse.json(
      { error: "brief and canvas width/height required" },
      { status: 400 }
    );
  }
  try {
    const suggestion = await runAssist({
      mode: body.mode ?? "both",
      canvas: body.canvas,
      brief: body.brief,
      currentTexts: body.currentTexts,
    });
    return NextResponse.json(suggestion);
  } catch (e) {
    const status = (e as { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Assist failed" },
      { status }
    );
  }
}
