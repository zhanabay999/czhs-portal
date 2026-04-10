import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sportsApplications } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lastName, firstName, patronymic, employeeId, branch, sportType, phone } = body;

    if (!lastName || !firstName || !branch || !sportType || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(sportsApplications).values({
      lastName,
      firstName,
      patronymic: patronymic || null,
      employeeId: employeeId || null,
      branch,
      sportType,
      phone,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sports apply error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
