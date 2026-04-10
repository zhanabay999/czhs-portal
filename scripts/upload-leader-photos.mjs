import { put } from "@vercel/blob";
import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";
import pg from "pg";

const { Client } = pg;

const PHOTO_DIR = "C:/Users/n3131/OneDrive/Рабочий стол/портрет 2024 г";
const DATABASE_URL = "postgresql://neondb_owner:npg_SIrE4uPJZG7K@ep-rapid-mouse-ag08aod8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const BLOB_TOKEN = "vercel_blob_rw_kyt5WraZGiQO75BN_IEEX5ybHm4VBxMSIaGgK1rdZOToI8W";

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".JPG": "image/jpeg",
  ".JPEG": "image/jpeg",
  ".webp": "image/webp",
  ".WEBP": "image/webp",
  ".png": "image/png",
};

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  // Get all leaders without photo
  const { rows: leaders } = await client.query(
    "SELECT id, name_ru, photo_url FROM leaders ORDER BY level, sort_order"
  );
  console.log(`Found ${leaders.length} leaders in DB\n`);

  // Get all photo files
  const files = await readdir(PHOTO_DIR);
  console.log(`Found ${files.length} photo files\n`);

  // Build map: lastname (lowercase) → filename
  const photoMap = new Map();
  for (const file of files) {
    // Skip "2" duplicates (e.g. "Кирович А.С. 2.WEBP")
    if (file.includes(" 2.")) continue;
    const lastName = file.split(/[\s\.]/)[0].toLowerCase();
    photoMap.set(lastName, file);
  }

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const leader of leaders) {
    const lastName = leader.name_ru.split(" ")[0].toLowerCase();
    const photoFile = photoMap.get(lastName);

    if (!photoFile) {
      console.log(`  ✗ No photo: ${leader.name_ru}`);
      noMatch++;
      continue;
    }

    if (leader.photo_url) {
      console.log(`  ~ Already has photo: ${leader.name_ru}`);
      skipped++;
      continue;
    }

    const filePath = join(PHOTO_DIR, photoFile);
    const buffer = await readFile(filePath);
    const ext = extname(photoFile).toLowerCase();
    const mimeType = MIME[extname(photoFile)] || "image/jpeg";
    const blobName = `leadership/${lastName}${ext}`;

    try {
      const blob = await put(blobName, buffer, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: mimeType,
      });

      await client.query("UPDATE leaders SET photo_url = $1 WHERE id = $2", [blob.url, leader.id]);
      console.log(`  ✓ Uploaded: ${leader.name_ru} → ${blob.url}`);
      updated++;
    } catch (err) {
      console.error(`  ✗ Error uploading ${leader.nameRu}:`, err.message);
    }
  }

  await client.end();
  console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${noMatch} no match`);
}

main().catch(console.error);
