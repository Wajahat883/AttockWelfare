import { getCurrentMonth, getMonthName } from "./date";

export function generateWhatsAppMessage(member: { name: string; monthlyAmount: unknown }, month = getCurrentMonth(), language: "en" | "ur" = "en") {
  const amount = Number(member.monthlyAmount).toLocaleString();
  if (language === "ur") return `محترم ${member.name}، ${getMonthName(month, "ur")} ${month.slice(0, 4)} کا ماہانہ چندہ (${amount} روپے) ابھی زیر التوا ہے۔ براہ کرم جلد ادا کریں۔`;
  return `Dear ${member.name}, your contribution of Rs. ${amount} for ${getMonthName(month)} ${month.slice(0, 4)} is pending. Please pay as soon as possible.`;
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const normalizedPhone = phone.replace(/[^\d]/g, "").replace(/^00/, "");
  const internationalPhone = normalizedPhone.startsWith("0") ? `92${normalizedPhone.slice(1)}` : normalizedPhone;
  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}
