import axios from 'axios';

// (افتراض) عند فتح index.html من file:// لن يكون هناك origin صالح للـ API
const FALLBACK_ORIGIN = 'http://localhost:4001';

// (افتراض) إذا كان التطبيق مخدومًا من نفس origin (مثلاً عبر Express static) نستخدمه
const origin =
  typeof window !== 'undefined' &&
  window.location &&
  typeof window.location.origin === 'string' &&
  window.location.origin.startsWith('http')
    ? window.location.origin
    : FALLBACK_ORIGIN;

export const api = axios.create({
  baseURL: `${origin}/api`,

});
