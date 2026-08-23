import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { BossMapPosition } from "@/lib/boss-positions";

// Local-only dev convenience: writes straight to a JSON file on disk. Won't
// work on a read-only filesystem (e.g. most serverless production hosts),
// which is fine — this is a data-entry tool for populating map positions,
// not a runtime feature.
const DATA_PATH = path.join(process.cwd(), "src/data/boss-positions.json");

async function readPositions(): Promise<BossMapPosition[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function GET() {
  const positions = await readPositions();
  return NextResponse.json(positions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { bossId, killed } = body as {
    bossId?: string;
    killed?: boolean;
  };

  if (!bossId || typeof killed !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const positions = await readPositions();
  const existing = positions.find((p) => p.bossId === bossId);
  if (!existing) {
    return NextResponse.json({ error: "Unknown bossId" }, { status: 404 });
  }
  existing.killed = killed;

  await fs.writeFile(
    DATA_PATH,
    JSON.stringify(positions, null, 2) + "\n",
    "utf-8",
  );

  return NextResponse.json({ ok: true, positions });
}
