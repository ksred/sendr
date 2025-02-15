export function formatCurrency(amount: number | string | undefined | null, currency: string = 'USD'): string {
  try {
    // Handle undefined or null
    if (amount == null) {
      return '-';
    }

    // Convert string to number if needed
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Check if we have a valid number
    if (isNaN(numericAmount)) {
      return '-';
    }

    // Validate currency code (must be 3 letters)
    const validCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '-';
  }
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
