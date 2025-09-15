/**
 * Formats a number or numeric string as a currency string.
 *
 * @param value - The numeric value to format (number or string).
 * @param currencyCode - The ISO currency code (e.g., "INR", "USD"). Defaults to "USD".
 * @returns The formatted currency string, or an empty string if input is invalid.
 */
export function formatCurrency(
    value: number | string,
    locale: string = "en-GB",
    currencyCode: string = "GBP"
): string {
    if (value == null || value === "") return "";

    // Ensure numeric string only
    const numeric = String(value).replace(/[^\d.-]/g, "");
    const num = parseFloat(numeric);
    if (isNaN(num)) return "";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}
