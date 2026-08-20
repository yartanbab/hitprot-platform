/** Zaman cizelgesi + eslestirme — sunucu koprusu. */

export const abpAuth = (p) => window?.abp?.auth?.isGranted(p);
export const abpNotify = (type, msg) => window?.abp?.notify?.[type]?.(msg);
export const abpAppPath = () => window?.abp?.appPath ?? '/';

function abpAjax(options) {
  return new Promise((resolve, reject) => {
    window.abp.ajax(options).done(resolve).fail(reject);
  });
}

const handler = (page, name, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString();
  return `${abpAppPath()}Documents/${page}?handler=${name}${qs ? '&' + qs : ''}`;
};

const postJson = (url, body) =>
  abpAjax({ url, type: 'POST', contentType: 'application/json', data: JSON.stringify(body) });

/* Zaman cizelgesi */
export const getTimeline = (projectId) =>
  abpAjax({ url: handler('Timeline', 'Timeline', { projectId }), type: 'GET' });
export const createRisk = (dto) => postJson(handler('Timeline', 'CreateRisk'), dto);
export const setRiskClosed = (id, isClosed) =>
  abpAjax({ url: handler('Timeline', 'SetRiskClosed', { id, isClosed }), type: 'POST' });
export const deleteRisk = (id) =>
  abpAjax({ url: handler('Timeline', 'DeleteRisk', { id }), type: 'POST' });

/* Eslestirme */
export const getBoard = (projectId) =>
  abpAjax({ url: handler('Matching', 'Board', { projectId }), type: 'GET' });
export const getCandidates = (expenseId) =>
  abpAjax({ url: handler('Matching', 'Candidates', { expenseId }), type: 'GET' });
export const getMatches = (projectId) =>
  abpAjax({ url: handler('Matching', 'Matches', { projectId }), type: 'GET' });
export const createMatch = (dto) => postJson(handler('Matching', 'CreateMatch'), dto);
export const removeMatch = (matchId) =>
  abpAjax({ url: handler('Matching', 'RemoveMatch', { matchId }), type: 'POST' });

/* Proje kapsami — agac TEMBEL yuklenir: once proje satirlari, sonra dal. */
export const getScopeOverview = () =>
  abpAjax({ url: handler('Scope', 'Overview'), type: 'GET' });
export const getScopeBranch = (projectId) =>
  abpAjax({ url: handler('Scope', 'Branch', { projectId }), type: 'GET' });

/* Ortak bicimleyiciler */
export const fmtMoney = (v, currency = 'TRY') =>
  v === null || v === undefined
    ? '—'
    : new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
      + ' ' + ({ TRY: '₺', USD: '$', EUR: '€' }[currency] || currency);

/** Ondalik sayi (adam-gun vb.) — TR ayraci; para birimi yok. */
export const fmtNum = (v, digits = 1) =>
  v === null || v === undefined
    ? '—'
    : new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(v);

export const fmtDate = (iso) =>
  iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso)) : '—';
