/** Documents — ortak biçimleyiciler ve görsel eşlemeler (token-first). */

export const cn = (...c) => c.filter(Boolean).join(' ');

export const fmt = {
  date: (iso) => iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
    : '—',
  dateTime: (iso) => iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
    : '—',
  money: (amount, currency) => {
    if (amount === null || amount === undefined) return '—';
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .format(amount) + (currency ? ' ' + currencySymbol(currency) : '');
  },
  size: (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' MB';
  },
  daysLeft: (iso) => {
    if (!iso) return null;
    return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
  },
};

function currencySymbol(code) {
  return { TRY: '₺', USD: '$', EUR: '€', GBP: '£' }[code] || code;
}

/** DocumentFileStatus (Domain.Shared) → çip görünümü. Sayılar enum ile eşleşir. */
export const STATUS_META = {
  1: { text: 'Taslak', chip: 'apya-chip-neutral' },
  2: { text: 'Kesin', chip: 'apya-chip-positive' },
  3: { text: 'Eşleşti', chip: 'apya-chip-accent' },
  4: { text: 'Süre dolan', chip: 'apya-chip-negative' },
};

/** DocumentFieldType → detay panelindeki giriş tipi. */
export const FIELD_TYPE = {
  1: 'text', 2: 'date', 3: 'money', 4: 'number', 5: 'percent', 6: 'select', 7: 'relation',
};

/** DocumentFieldFillSource → rozet. Faz A'da yalnız Manual gerçekten çalışır. */
export const FILL_SOURCE_META = {
  1: { text: 'Manuel', variant: 'neutral' },
  2: { text: 'OCR', variant: 'brand' },
  3: { text: 'AI', variant: 'accent' },
  4: { text: 'Kural', variant: 'warning' },
};

export const ACCESS_ACTION_LABEL = {
  1: 'Yüklendi', 2: 'İndirildi', 3: 'Silindi',
  4: 'Görüntülendi', 5: 'Meta değişti', 6: 'Taşındı',
};

/** Dosya uzantısı → ikon + renk. Renkler tokenlara bağlı değil (marka renkleri). */
export function fileVisual(contentType, fileName) {
  const ext = (fileName || '').split('.').pop()?.toLowerCase() || '';
  if (contentType?.includes('pdf') || ext === 'pdf') return { icon: 'fa-file-pdf', color: '#EF4444', label: 'PDF' };
  if (contentType?.includes('sheet') || contentType?.includes('excel') || ['xlsx', 'xls', 'csv'].includes(ext)) return { icon: 'fa-file-excel', color: '#10B981', label: 'XLS' };
  if (contentType?.includes('word') || ['docx', 'doc'].includes(ext)) return { icon: 'fa-file-word', color: '#3B82F6', label: 'DOC' };
  if (contentType?.includes('presentation') || ['pptx', 'ppt'].includes(ext)) return { icon: 'fa-file-powerpoint', color: '#F59E0B', label: 'PPT' };
  if (contentType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return { icon: 'fa-file-image', color: '#8B5CF6', label: 'IMG' };
  if (['zip', 'rar', '7z'].includes(ext)) return { icon: 'fa-file-zipper', color: '#6B7280', label: 'ZIP' };
  return { icon: 'fa-file', color: '#6B7280', label: 'DOSYA' };
}

/** Etiket rengi isimden deterministik seçilir (Tasks.Tag ile aynı konvansiyon). */
export function tagChipClass(name) {
  const tones = ['apya-chip-accent', 'apya-chip-brand', 'apya-chip-positive', 'apya-chip-warning', 'apya-chip-neutral'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return tones[hash % tones.length];
}
