"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthsOfYear = exports.formatPaymentDate = exports.getMonthName = exports.getCurrentYear = exports.getCurrentMonth = void 0;
// Get current month in "YYYY-MM" format from server date
const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};
exports.getCurrentMonth = getCurrentMonth;
// Get current year
const getCurrentYear = () => {
    return new Date().getFullYear();
};
exports.getCurrentYear = getCurrentYear;
// Get month name in English or Urdu
const getMonthName = (month, language = "en") => {
    const monthNum = parseInt(month.split("-")[1]);
    const monthsEn = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthsUr = [
        "جنوری",
        "فروری",
        "مارچ",
        "اپریل",
        "مئی",
        "جون",
        "جولائی",
        "اگست",
        "ستمبر",
        "اکتوبر",
        "نومبر",
        "دسمبر",
    ];
    if (language === "ur") {
        return monthsUr[monthNum - 1] || "";
    }
    return monthsEn[monthNum - 1] || "";
};
exports.getMonthName = getMonthName;
// Format date as "14 Aug 2026" or "14 اگست 2026"
const formatPaymentDate = (date, language = "en") => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = language === "ur"
        ? ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"][month]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month];
    return `${day} ${monthName} ${year}`;
};
exports.formatPaymentDate = formatPaymentDate;
// Get list of months for a specific year
const getMonthsOfYear = (year) => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
        const month = String(i).padStart(2, "0");
        months.push(`${year}-${month}`);
    }
    return months;
};
exports.getMonthsOfYear = getMonthsOfYear;
//# sourceMappingURL=date.js.map