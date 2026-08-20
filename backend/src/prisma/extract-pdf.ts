import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const file = await fs.readFile(path.resolve(process.cwd(), "../alllist.pdf"));
  const document = await pdfjs.getDocument({ data: new Uint8Array(file), useSystemFonts: true }).promise;
  const lines: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const rows = new Map<number, { x: number; text: string }[]>();
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim() || !("transform" in item)) continue;
      const y = Math.round(item.transform[5]);
      const row = rows.get(y) ?? [];
      row.push({ x: item.transform[4], text: item.str.trim() });
      rows.set(y, row);
    }
    lines.push(`--- PAGE ${pageNumber} ---`);
    [...rows.entries()].sort(([a], [b]) => b - a).forEach(([, row]) => lines.push(row.sort((a, b) => a.x - b.x).map((item) => item.text).join(" | ")));
  }
  await fs.writeFile(path.resolve(process.cwd(), "pdf-extracted.txt"), lines.join("\n"), "utf8");
  console.log(`Extracted ${lines.length} lines to backend/pdf-extracted.txt`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
