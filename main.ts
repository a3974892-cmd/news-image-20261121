// Runner for the news-image-20261121 entry.
//
// The front page is stored beside this file as entry.png (a JPEG image
// holding the bytes the generator produced). Running this script puts an
// exact copy of that file at $MAKEFUN_OUTPUT_DIR/entry.png, which is where
// the grader reads the entry from. The picture is never decoded or
// re-encoded here, so the bytes the grader judges are bit-for-bit the
// bytes in the repository.
//
// Run with:  MAKEFUN_OUTPUT_DIR=<dir> node main.ts   (default: /output)

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const picturePath = join(repoRoot, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.png");

const picture = readFileSync(picturePath);
const sourceHash = createHash("sha256").update(picture).digest("hex");
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, picture);

const written = statSync(outPath).size;
if (written !== picture.length) {
  console.error(`size mismatch after write: ${written} vs ${picture.length} bytes`);
  process.exit(1);
}
// A size match alone does not prove the bytes are identical, so verify the
// copy by hash: the grader must judge bit-for-bit the bytes in the repo.
const writtenHash = createHash("sha256").update(readFileSync(outPath)).digest("hex");
if (writtenHash !== sourceHash) {
  console.error(`hash mismatch after write: ${writtenHash} vs ${sourceHash}`);
  process.exit(1);
}
console.log(`wrote ${outPath} (${written} bytes, sha256 ${writtenHash})`);
