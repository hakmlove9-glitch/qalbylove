import { CASH_NETWORKS, PAYMENT_PHONE } from "@/lib/constants";

export const OFFICIAL_PAYMENT_PHONE = PAYMENT_PHONE;
export const ALLOWED_CASH_NETWORKS = new Set<string>(CASH_NETWORKS);

export function isValidCashNetwork(value: unknown) {
  return ALLOWED_CASH_NETWORKS.has(String(value || "").trim());
}

export function isValidEgyptianWalletPhone(value: unknown) {
  const normalized = String(value || "")
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/\D/g, "");

  return /^01[0125]\d{8}$/.test(normalized);
}
