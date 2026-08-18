// Get current month in "YYYY-MM" format from server date
export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Get month name in English or Urdu
export const getMonthName = (
  month: string,
  language: "en" | "ur" = "en"
): string => {
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

// Format date as "14 Aug 2026" or "14 اگست 2026"
export const formatPaymentDate = (
  date: Date,
  language: "en" | "ur" = "en"
): string => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthName = language === "ur"
    ? ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"][month]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month];

  return `${day} ${monthName} ${year}`;
};

// Get list of months for a specific year
export const getMonthsOfYear = (year: number): string[] => {
  const months: string[] = [];
  for (let i = 1; i <= 12; i++) {
    const month = String(i).padStart(2, "0");
    months.push(`${year}-${month}`);
  }
  return months;
};
