import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { BossMapPosition } from "@/lib/boss-positions";

// Local-only dev convenience: reads straight from a JSON file on disk that's
// hand-edited when adding boss map positions — there's no write path here,
// this is purely so the client doesn't need a static import (new positions
// show up without a rebuild).
const DATA_PATH = path.join(process.cwd(), "src/data/boss-positions.json");

export async function GET() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const positions = JSON.parse(raw) as BossMapPosition[];
  return NextResponse.json(positions);
}
