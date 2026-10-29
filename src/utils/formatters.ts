// Utility functions for normalizing Egyptian numbers, phones and text

export function normalizeArabicDigits(str: string | number): string {
  if (typeof str === 'number') return str.toString();
  if (!str) return '0';
  
  const arabicIndicMap: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };

  return str.replace(/[٠-٩۰-۹]/g, (char) => arabicIndicMap[char] || char);
}

export function parseNumberField(val: string | number | undefined | null, fallback = 0): number {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  
  const normalized = normalizeArabicDigits(val).trim();
  
  // Specific word representations in the dataset
  if (normalized.includes('عشرون')) return 20;
  if (normalized.includes('فصل واحد') || normalized === 'واحد') return 1;
  
  // Extract first sequence of digits
  const match = normalized.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return isNaN(num) ? fallback : num;
  }
  
  return fallback;
}

export function cleanPhoneNumber(raw: string | number): string {
  if (!raw) return '';
  let str = normalizeArabicDigits(raw).toString().trim();
  
  // Remove non-digit characters except +
  str = str.replace(/[^\d+]/g, '');
  
  // Remove country code +20 if present
  if (str.startsWith('+20')) {
    str = str.substring(3);
  } else if (str.startsWith('0020')) {
    str = str.substring(4);
  } else if (str.startsWith('20') && str.length === 12) {
    str = str.substring(2);
  }
  
  // If starts with 1 and length is 10 (e.g. 1158652818), add leading 0 -> 01158652818
  if (str.startsWith('1') && (str.length === 10 || str.length === 9)) {
    str = '0' + str;
  }
  
  return str;
}

export function formatWhatsAppUrl(phone: string): string {
  let cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return '#';
  if (cleaned.startsWith('0')) {
    cleaned = '2' + cleaned;
  }
  return `https://wa.me/${cleaned}`;
}

export function formatCallUrl(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned ? `tel:${cleaned}` : '#';
}
