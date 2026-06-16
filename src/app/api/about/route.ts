import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aboutData } from "@/lib/data";

export async function GET() {
  try {
    let about = await prisma.about.findFirst();
    if (!about) {
      about = await prisma.about.create({ data: aboutData });
    }
    return NextResponse.json(about);
  } catch {
    return NextResponse.json(aboutData);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const existing = await prisma.about.findFirst();
    let about;
    if (existing) {
      about = await prisma.about.update({ where: { id: existing.id }, data: body });
    } else {
      about = await prisma.about.create({ data: body });
    }
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}
