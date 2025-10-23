
export default function convertToLongDate(dateString: string): string {
  const date = new Date(dateString.replace(' ', 'T')); // ensure ISO format
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
