"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
const datePattern = /\d{1,2}\/\d{1,2}\/\d{2,4}/g;
const invalid = new Set(["", "........", ".......", ".........", "..........", ".............", ".....", "......"]);
const clean = (value) => invalid.has(value.trim()) ? "" : value.trim();
const phone = (value) => clean(value).replace(/[^\d+]/g, "");
function parseDate(value) { const [day, month, rawYear] = value.split("/").map(Number); const year = rawYear < 100 ? 2000 + rawYear : rawYear; return new Date(year, month - 1, day); }
function parsePayments(fields) {
    const text = fields.join(" ");
    const dates = [...text.matchAll(datePattern)];
    const payments = [];
    dates.forEach((match, index) => { const start = (match.index ?? 0) + match[0].length; const end = index + 1 < dates.length ? dates[index + 1].index ?? text.length : text.length; const chunk = text.slice(start, end); const amountMatch = chunk.match(/\b(\d+(?:\.\d+)?)\b/); if (!amountMatch)
        return; const amount = Number(amountMatch[1]); const notes = chunk.toLowerCase(); const countMatch = notes.match(/(\d+)\s*(?:for\s*)?month/); const namedMonths = notes.match(/(jul|aug|sep|oct|nov|dec)/g)?.length; const count = countMatch ? Number(countMatch[1]) : namedMonths && namedMonths > 1 ? namedMonths : 1; const each = count > 1 ? amount / count : amount; for (let offset = 0; offset < count; offset += 1) {
        const date = parseDate(match[0]);
        date.setMonth(date.getMonth() + offset);
        payments.push({ date, amount: each });
    } });
    return payments;
}
function parseRows(text) {
    const rows = [];
    let adminSection = true;
    for (const line of text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
        if (line.includes("COMMITTIE PERSONS")) {
            adminSection = false;
            continue;
        }
        if (!line.includes(" | ") || line.startsWith("---") || line.startsWith("Name |"))
            continue;
        const fields = line.split(" | ").map((item) => item.trim());
        if (fields.length < 5)
            continue;
        const [name, fatherName, address, rawPhone, ...paymentFields] = fields;
        if (!name || name === "ATTOCK WELFARE")
            continue;
        rows.push({ name, fatherName: clean(fatherName) || null, address: clean(address) || null, phone: phone(rawPhone), admin: adminSection, payments: parsePayments(paymentFields) });
    }
    rows.push({ name: "Tariq Aziz", fatherName: null, address: null, phone: "0583035869", admin: true, payments: [] });
    return rows;
}
async function main() { const dryRun = process.argv.includes("--dry-run"); const text = await promises_1.default.readFile(node_path_1.default.resolve(process.cwd(), "pdf-extracted.txt"), "utf8"); const rows = parseRows(text); const passwordHash = await (0, password_1.hashPassword)("password123"); let added = 0; let skipped = 0; let payments = 0; let adminRows = 0; let userRows = 0; const seen = new Set(); for (const row of rows) {
    const key = `${row.name.toLowerCase()}|${row.fatherName?.toLowerCase() ?? ""}|${row.phone}`;
    if (seen.has(key)) {
        skipped += 1;
        continue;
    }
    seen.add(key);
    if (dryRun) {
        row.admin ? adminRows += 1 : userRows += 1;
        payments += row.payments.length;
        continue;
    }
    const existing = await prisma_1.prisma.user.findFirst({ where: { name: row.name, fatherName: row.fatherName, phone: row.phone } });
    if (existing) {
        skipped += 1;
        continue;
    }
    const base = row.name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") || "member";
    const email = `${base}.${added + 1}@import.attockwelfare.local`;
    const user = await prisma_1.prisma.user.create({ data: { name: row.name, email, fatherName: row.fatherName, address: row.address, phone: row.phone, passwordHash, role: row.admin ? "ADMIN" : "USER", monthlyAmount: 0 } });
    if (row.admin)
        adminRows += 1;
    else
        userRows += 1;
    added += 1;
    for (const payment of row.payments) {
        const month = `${payment.date.getFullYear()}-${String(payment.date.getMonth() + 1).padStart(2, "0")}`;
        await prisma_1.prisma.payment.create({ data: { userId: user.id, month, year: payment.date.getFullYear(), amount: payment.amount, status: "PAID", paidDate: payment.date, addedBy: user.id } }).catch(() => undefined);
        payments += 1;
    }
} console.log(JSON.stringify({ dryRun, rows: rows.length, added, skipped, adminRows, userRows, payments }, null, 2)); }
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma_1.prisma.$disconnect());
//# sourceMappingURL=import-pdf.js.map