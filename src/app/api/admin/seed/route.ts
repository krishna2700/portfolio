import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { heroData, aboutData, experienceData, projectsData, skillsData } from "@/lib/data";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Seed Hero
    const existingHero = await prisma.hero.findFirst();
    if (!existingHero) {
      await prisma.hero.create({ data: heroData });
    }

    // Seed About
    const existingAbout = await prisma.about.findFirst();
    if (!existingAbout) {
      await prisma.about.create({ data: aboutData });
    }

    // Seed Experience
    const expCount = await prisma.experience.count();
    if (expCount === 0) {
      await prisma.experience.createMany({
        data: experienceData.map(({ id: _id, ...e }) => e),
      });
    }

    // Seed Projects
    const projCount = await prisma.project.count();
    if (projCount === 0) {
      await prisma.project.createMany({
        data: projectsData.map(({ id: _id, ...p }) => p),
      });
    }

    // Seed Skills
    const skillCount = await prisma.skill.count();
    if (skillCount === 0) {
      await prisma.skill.createMany({
        data: skillsData.map(({ id: _id, ...s }) => s),
      });
    }

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || "krishnaruparelia0207@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@2026";
    const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 12);
      await prisma.adminUser.create({
        data: { email: adminEmail, password: hashed, name: "Krishna Ruparelia" },
      });
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (e) {
    return NextResponse.json({ error: "Seed failed", details: String(e) }, { status: 500 });
  }
}
