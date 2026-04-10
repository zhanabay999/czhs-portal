import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // If Vercel Blob token is configured — use cloud storage (Vercel deployment)
  // Otherwise — save to local filesystem (self-hosted server).
  // We use createRequire so neither webpack nor turbopack try to bundle @vercel/blob.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { createRequire } = await import("module");
    const req = createRequire(import.meta.url);
    const blobModuleName = ["@vercel", "blob"].join("/");
    const { put } = req(blobModuleName) as typeof import("@vercel/blob");
    const blob = await put(`${folder}/${safeName}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  }

  const { writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const uploadDir = path.join(process.cwd(), "public", folder);
  await mkdir(uploadDir, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, safeName), bytes);
  return NextResponse.json({ url: `/${folder}/${safeName}` });
}
