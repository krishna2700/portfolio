import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { heroData } from "@/lib/data";

export async function GET() {
  try {
    let hero = await prisma.hero.findFirst();
    if (!hero) {
      hero = await prisma.hero.create({ data: heroData });
    }
    return NextResponse.json(hero);
  } catch {
    return NextResponse.json(heroData);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const existing = await prisma.hero.findFirst();
    let hero;
    if (existing) {
      hero = await prisma.hero.update({ where: { id: existing.id }, data: body });
    } else {
      hero = await prisma.hero.create({ data: body });
    }
    return NextResponse.json(hero);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}
