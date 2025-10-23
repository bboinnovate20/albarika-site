export function currencyConvert(amount: number): string {
  if (isNaN(amount)) return '₦0';
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
