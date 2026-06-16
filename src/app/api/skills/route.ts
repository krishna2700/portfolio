import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { skillsData } from "@/lib/data";

export async function GET() {
  try {
    let skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    if (skills.length === 0) {
      await prisma.skill.createMany({
        data: skillsData.map(({ id: _id, ...s }) => s),
      });
      skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    }
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json(skillsData);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const skill = await prisma.skill.create({ data: body });
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const skill = await prisma.skill.update({ where: { id }, data });
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
