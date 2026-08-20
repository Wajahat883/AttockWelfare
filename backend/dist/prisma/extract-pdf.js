"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
async function main() {
    const pdfjs = await Promise.resolve().then(() => __importStar(require("pdfjs-dist/legacy/build/pdf.mjs")));
    const file = await promises_1.default.readFile(node_path_1.default.resolve(process.cwd(), "../alllist.pdf"));
    const document = await pdfjs.getDocument({ data: new Uint8Array(file), useSystemFonts: true }).promise;
    const lines = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        const rows = new Map();
        for (const item of content.items) {
            if (!("str" in item) || !item.str.trim() || !("transform" in item))
                continue;
            const y = Math.round(item.transform[5]);
            const row = rows.get(y) ?? [];
            row.push({ x: item.transform[4], text: item.str.trim() });
            rows.set(y, row);
        }
        lines.push(`--- PAGE ${pageNumber} ---`);
        [...rows.entries()].sort(([a], [b]) => b - a).forEach(([, row]) => lines.push(row.sort((a, b) => a.x - b.x).map((item) => item.text).join(" | ")));
    }
    await promises_1.default.writeFile(node_path_1.default.resolve(process.cwd(), "pdf-extracted.txt"), lines.join("\n"), "utf8");
    console.log(`Extracted ${lines.length} lines to backend/pdf-extracted.txt`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
//# sourceMappingURL=extract-pdf.js.map