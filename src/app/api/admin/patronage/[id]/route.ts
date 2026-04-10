import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { patronageBranches } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await req.json();

  try {
    await db.update(patronageBranches)
      .set({
        childrenCount: data.childrenCount,
        curators: data.curators,
        subBranchChildrenCount: data.subBranchChildrenCount ?? null,
        subBranchCurators: data.subBranchCurators ?? null,
        updatedAt: new Date(),
      })
      .where(eq(patronageBranches.id, id));

    revalidatePath("/ru/zhyly-zhurekpen/patronage");
    revalidatePath("/kk/zhyly-zhurekpen/patronage");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Patronage update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
