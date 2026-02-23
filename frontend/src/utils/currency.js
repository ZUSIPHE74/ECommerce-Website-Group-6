const BASE_CURRENCY = 'ZAR';

const currencyByRegion = {
  ZA: 'ZAR',
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  IE: 'EUR',
  FR: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  AU: 'AUD',
  NZ: 'NZD',
  JP: 'JPY',
  CN: 'CNY',
  IN: 'INR',
  BR: 'BRL',
  MX: 'MXN',
  NG: 'NGN',
  KE: 'KES'
};

const ratesFromZar = {
  ZAR: 1,
  USD: 0.053,
  EUR: 0.049,
  GBP: 0.042,
  CAD: 0.072,
  AUD: 0.082,
  NZD: 0.088,
  JPY: 7.9,
  CNY: 0.38,
  INR: 4.4,
  BRL: 0.27,
  MXN: 0.91,
  NGN: 79,
  KES: 8.4
};

export function detectCurrencyCode() {
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const region = lang && lang.includes('-') ? lang.split('-')[1] : 'US';
  return currencyByRegion[region] || 'USD';
}

export function getCurrencyCode() {
  return localStorage.getItem('currency_code') || detectCurrencyCode();
}

export function convertFromZar(amount, currencyCode) {
  const code = currencyCode || getCurrencyCode();
  const rate = ratesFromZar[code] || ratesFromZar.USD;
  const numeric = Number(amount);
  return isNaN(numeric) ? 0 : numeric * rate;
}

export function formatMoney(amount, currencyCode) {
  const code = currencyCode || getCurrencyCode();
  const value = convertFromZar(amount, code);
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2
    }).format(value);
  } catch (e) {
    return `${value.toFixed(2)} ${code}`;
  }
}

export { BASE_CURRENCY };
