import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { experienceData } from "@/lib/data";

export async function GET() {
  try {
    let experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    if (experiences.length === 0) {
      await prisma.experience.createMany({
        data: experienceData.map(({ id: _id, ...e }) => e),
      });
      experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    }
    return NextResponse.json(experiences);
  } catch {
    return NextResponse.json(experienceData);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const exp = await prisma.experience.create({ data: body });
    return NextResponse.json(exp);
  } catch {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const exp = await prisma.experience.update({ where: { id }, data });
    return NextResponse.json(exp);
  } catch {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
