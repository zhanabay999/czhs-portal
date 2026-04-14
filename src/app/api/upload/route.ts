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

  const allowedTypes = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "image/heic", "image/heif", "image/bmp", "image/tiff",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
  }

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  // Compress image with sharp
  const bytes = new Uint8Array(await file.arrayBuffer());
  let compressed: Buffer;
  try {
    const sharp = (await import("sharp")).default;
    compressed = await sharp(bytes)
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toBuffer();
  } catch {
    // If sharp fails (e.g. unsupported format), use original bytes
    compressed = Buffer.from(bytes);
  }

  // Vercel Blob (cloud) or local filesystem
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { createRequire } = await import("module");
    const r = createRequire(import.meta.url);
    const blobModuleName = ["@vercel", "blob"].join("/");
    const { put } = r(blobModuleName) as typeof import("@vercel/blob");
    const blob = await put(`${folder}/${safeName}`, compressed, { access: "public", contentType: "image/jpeg" });
    return NextResponse.json({ url: blob.url });
  }

  const { writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const uploadDir = path.join(process.cwd(), "public", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), compressed);
  return NextResponse.json({ url: `/${folder}/${safeName}` });
}
