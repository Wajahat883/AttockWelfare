"use client";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";

export type PdfRow = { label: string; value: string };
export function PdfDownloadButton({ title, filename, rows }: { title: string; filename: string; rows: PdfRow[] }) { const download = () => { const pdf = new jsPDF(); pdf.setFontSize(20); pdf.setTextColor(36, 95, 77); pdf.text("Attock Welfare", 20, 24); pdf.setFontSize(15); pdf.setTextColor(35, 61, 55); pdf.text(title, 20, 36); pdf.setDrawColor(210, 220, 211); pdf.line(20, 43, 190, 43); pdf.setFontSize(11); let y = 56; rows.forEach((row) => { pdf.setTextColor(105, 120, 111); pdf.text(row.label, 20, y); pdf.setTextColor(35, 61, 55); pdf.text(row.value, 85, y); y += 10; if (y > 275) { pdf.addPage(); y = 20; } }); pdf.setFontSize(9); pdf.setTextColor(130, 140, 133); pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 285); pdf.save(filename); }; return <button type="button" onClick={download} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"><FileDown size={16} />Download PDF</button>; }
