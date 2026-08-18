/**
 * Teslimler & arşiv — sunucu köprüsü.
 * Documents modülüyle aynı desen: Razor Page handler'ları, abp.ajax üzerinden.
 */

export const abpAuth = (p) => window?.abp?.auth?.isGranted(p);
export const abpNotify = (type, msg) => window?.abp?.notify?.[type]?.(msg);
export const abpAppPath = () => window?.abp?.appPath ?? '/';

function abpAjax(options) {
  return new Promise((resolve, reject) => {
    window.abp.ajax(options).done(resolve).fail(reject);
  });
}

const handler = (name, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const qs = query.toString();
  return `${abpAppPath()}Documents/Deliveries?handler=${name}${qs ? '&' + qs : ''}`;
};

const postJson = (url, body) =>
  abpAjax({ url, type: 'POST', contentType: 'application/json', data: JSON.stringify(body) });

export const getPackages = (projectId) => abpAjax({ url: handler('Packages', { projectId }), type: 'GET' });
export const getPackage = (id) => abpAjax({ url: handler('Package', { id }), type: 'GET' });
export const createPackage = (dto) => postJson(handler('CreatePackage'), dto);
export const updatePackage = (id, dto) => postJson(handler('UpdatePackage', { id }), dto);
export const deletePackage = (id) => abpAjax({ url: handler('DeletePackage', { id }), type: 'POST' });

export const addItems = (packageId, documentFileIds) =>
  postJson(handler('AddItems'), { packageId, documentFileIds });
export const removeItem = (itemId) => abpAjax({ url: handler('RemoveItem', { itemId }), type: 'POST' });
export const reorderItems = (packageId, itemIds) =>
  postJson(handler('ReorderItems'), { packageId, itemIds });

export const getPreflight = (packageId) => abpAjax({ url: handler('Preflight', { packageId }), type: 'GET' });
export const generate = (packageId) => abpAjax({ url: handler('Generate', { packageId }), type: 'POST' });

export const getTemplates = () => abpAjax({ url: handler('Templates'), type: 'GET' });
export const getRuns = (projectId) => abpAjax({ url: handler('Runs', { projectId }), type: 'GET' });

export const getShareLinks = (packageId) => abpAjax({ url: handler('ShareLinks', { packageId }), type: 'GET' });
export const createShareLink = (dto) => postJson(handler('CreateShareLink'), dto);
export const revokeShareLink = (id) => abpAjax({ url: handler('RevokeShareLink', { id }), type: 'POST' });

/* Belge seçici, Dokümanlar sayfasının liste ucunu yeniden kullanır. */
export const searchDocuments = (projectId, filterText) =>
  abpAjax({
    url: `${abpAppPath()}Documents?handler=Files&projectId=${projectId}&maxResultCount=50&skipCount=0`
      + (filterText ? `&filterText=${encodeURIComponent(filterText)}` : ''),
    type: 'GET',
  });
