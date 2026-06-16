import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectsData } from "@/lib/data";

export async function GET() {
  try {
    let projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    if (projects.length === 0) {
      await prisma.project.createMany({
        data: projectsData.map(({ id: _id, ...p }) => p),
      });
      projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    }
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(projectsData);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = await prisma.project.create({ data: body });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const project = await prisma.project.update({ where: { id }, data });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
