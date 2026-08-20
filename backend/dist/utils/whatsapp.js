"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWhatsAppMessage = generateWhatsAppMessage;
exports.buildWhatsAppUrl = buildWhatsAppUrl;
const date_1 = require("./date");
function generateWhatsAppMessage(member, month = (0, date_1.getCurrentMonth)(), language = "en") {
    const amount = Number(member.monthlyAmount).toLocaleString();
    if (language === "ur")
        return `محترم ${member.name}، ${(0, date_1.getMonthName)(month, "ur")} ${month.slice(0, 4)} کا ماہانہ چندہ (${amount} روپے) ابھی زیر التوا ہے۔ براہ کرم جلد ادا کریں۔`;
    return `Dear ${member.name}, your contribution of Rs. ${amount} for ${(0, date_1.getMonthName)(month)} ${month.slice(0, 4)} is pending. Please pay as soon as possible.`;
}
function buildWhatsAppUrl(phone, message) {
    const normalizedPhone = phone.replace(/[^\d]/g, "").replace(/^00/, "");
    const internationalPhone = normalizedPhone.startsWith("0") ? `92${normalizedPhone.slice(1)}` : normalizedPhone;
    return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}
//# sourceMappingURL=whatsapp.js.map