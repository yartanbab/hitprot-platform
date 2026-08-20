/** Rapor derleyici — sunucu koprusu. */

export const abpNotify = (type, msg) => window?.abp?.notify?.[type]?.(msg);
export const abpAppPath = () => window?.abp?.appPath ?? '/';

function abpAjax(options) {
  return new Promise((resolve, reject) => {
    window.abp.ajax(options).done(resolve).fail(reject);
  });
}

export const handlerUrl = (name, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString();
  return `${abpAppPath()}Documents/ReportBuilder?handler=${name}${qs ? '&' + qs : ''}`;
};

const post = (url, body) =>
  abpAjax({ url, type: 'POST', contentType: 'application/json', data: JSON.stringify(body) });

/* Bolumler */
export const getTemplates = () => abpAjax({ url: handlerUrl('Templates'), type: 'GET' });
export const updateSections = (dto) => post(handlerUrl('UpdateSections'), dto);
export const createTemplate = (dto) => post(handlerUrl('CreateTemplate'), dto);
export const updateTemplate = (id, dto) => post(handlerUrl('UpdateTemplate', { id }), dto);
export const duplicateTemplate = (id) => abpAjax({ url: handlerUrl('DuplicateTemplate', { id }), type: 'POST' });
export const deleteTemplate = (id) => abpAjax({ url: handlerUrl('DeleteTemplate', { id }), type: 'POST' });

/* Onizleme */
export const getProjects = () => abpAjax({ url: handlerUrl('Projects'), type: 'GET' });
export const getPreview = (projectId, templateId, periodCode) =>
  abpAjax({ url: handlerUrl('Preview', { projectId, templateId, periodCode }), type: 'GET' });
export const previewPdfUrl = (projectId, templateId, periodCode) =>
  handlerUrl('PreviewPdf', { projectId, templateId, periodCode });

/* Dagitim */
export const getPackages = (projectId) => abpAjax({ url: handlerUrl('Packages', { projectId }), type: 'GET' });
export const getShareLinks = (packageId) => abpAjax({ url: handlerUrl('ShareLinks', { packageId }), type: 'GET' });
export const createShareLink = (dto) => post(handlerUrl('CreateShareLink'), dto);
export const revokeShareLink = (id) => abpAjax({ url: handlerUrl('RevokeShareLink', { id }), type: 'POST' });

/* Bicimleyiciler */
export const fmtMoney = (v, currency = 'TRY') =>
  v === null || v === undefined
    ? '—'
    : new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
      + ' ' + ({ TRY: '₺', USD: '$', EUR: '€' }[currency] || currency);

export const fmtDate = (iso) =>
  iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso)) : '—';

/** Bolum anahtari -> Turkce ad. Sunucu enum'u sayi doner. */
export const SECTION_LABEL = {
  1: 'Proje özeti',
  2: 'İş adımı ilerlemesi',
  3: 'Zaman çizelgesi',
  4: 'Harcama ↔ belge eşleşmesi',
  5: 'Ekip katkısı',
  6: 'Eksik belgeler',
  7: 'Uygunluk durumu',
  8: 'Ek dizini',
  9: 'Riskler',
  10: 'Denetim izi',
  11: 'Kilometre taşları',
  12: 'Kapak sayfası',
};

export const RECIPIENT_LABEL = {
  1: 'Kurum',
  2: 'Banka / finans',
  3: 'Müşteri',
  4: 'Denetçi · YMM',
  5: 'İç kullanım',
};

/* ─── Zamanlanmış üretim + aboneler (Faz E) ──────────────────────────────── */

export const getSchedules = (projectId) =>
  abpAjax({ url: handlerUrl('Schedules', { projectId }), type: 'GET' });

export const createSchedule = (dto) => post(handlerUrl('CreateSchedule'), dto);

export const updateSchedule = (id, dto) => post(handlerUrl('UpdateSchedule', { id }), dto);

export const setScheduleEnabled = (id, isEnabled) =>
  abpAjax({ url: handlerUrl('SetScheduleEnabled', { id, isEnabled }), type: 'POST' });

export const deleteSchedule = (id) =>
  abpAjax({ url: handlerUrl('DeleteSchedule', { id }), type: 'POST' });

export const addSubscriber = (scheduleId, dto) =>
  post(handlerUrl('AddSubscriber', { scheduleId }), dto);

export const removeSubscriber = (subscriberId) =>
  abpAjax({ url: handlerUrl('RemoveSubscriber', { subscriberId }), type: 'POST' });
