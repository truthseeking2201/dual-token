import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number for display with appropriate decimal places
 */
export function formatNumber(
  value: number | string,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    compact?: boolean;
  } = {}
): string {
  const {
    decimals = 2,
    prefix = '',
    suffix = '',
    compact = false
  } = options;

  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0.00';

  if (compact && num >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(1)}M${suffix}`;
  }
  
  if (compact && num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(1)}K${suffix}`;
  }

  return `${prefix}${num.toFixed(decimals)}${suffix}`;
}

/**
 * Formats currency values
 */
export function formatCurrency(value: number | string, currency = 'USD'): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Formats token amounts with proper decimal handling
 */
export function formatTokenAmount(
  amount: number | string,
  decimals: number = 18,
  displayDecimals: number = 6
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0';

  // Handle very small numbers
  if (num > 0 && num < Math.pow(10, -displayDecimals)) {
    return `< ${Math.pow(10, -displayDecimals)}`;
  }

  return num.toFixed(displayDecimals);
}

/**
 * Parses input string to number with validation
 */
export function parseTokenInput(input: string): number {
  if (!input || input.trim() === '') return 0;
  
  // Remove any non-numeric characters except decimal point
  const cleaned = input.replace(/[^0-9.]/g, '');
  
  // Handle multiple decimal points
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parseFloat(parts[0] + '.' + parts.slice(1).join(''));
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Validates if a string is a valid number input
 */
export function isValidNumberInput(input: string): boolean {
  if (!input || input.trim() === '') return true; // Empty is valid
  
  const num = parseTokenInput(input);
  return !isNaN(num) && num >= 0;
}

/**
 * Truncates an address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Generates a random transaction hash for demo purposes
 */
export function generateMockTxHash(): string {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Calculates percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Formats time elapsed since a timestamp
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

/**
 * Validates Ethereum-like address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
} 