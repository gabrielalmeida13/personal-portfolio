import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;

  if (!redis) {
    return NextResponse.json({ views: null });
  }

  const views = (await redis.get<number>(`views:${slug}`)) ?? 0;
  return NextResponse.json({ views });
}

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;

  if (!redis) {
    return NextResponse.json({ views: null });
  }

  const views = await redis.incr(`views:${slug}`);
  return NextResponse.json({ views });
}
