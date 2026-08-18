/** Doküman yönetimi — sunucu köprüsü (/Documents/Admin?handler=...). */

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
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString();
  return `${abpAppPath()}Documents/Admin?handler=${name}${qs ? '&' + qs : ''}`;
};

const postJson = (url, body) =>
  abpAjax({ url, type: 'POST', contentType: 'application/json', data: JSON.stringify(body) });

/* Meta şema */
export const getTypes = () => abpAjax({ url: handler('Types'), type: 'GET' });
export const createType = (dto) => postJson(handler('CreateType'), dto);
export const updateType = (id, dto) => postJson(handler('UpdateType', { id }), dto);
export const deleteType = (id) => abpAjax({ url: handler('DeleteType', { id }), type: 'POST' });
export const createField = (dto) => postJson(handler('CreateField'), dto);
export const updateField = (id, dto) => postJson(handler('UpdateField', { id }), dto);
export const deleteField = (id) => abpAjax({ url: handler('DeleteField', { id }), type: 'POST' });

/* Kural motoru */
export const getRules = () => abpAjax({ url: handler('Rules'), type: 'GET' });
export const createRule = (dto) => postJson(handler('CreateRule'), dto);
export const updateRule = (id, dto) => postJson(handler('UpdateRule', { id }), dto);
export const deleteRule = (id) => abpAjax({ url: handler('DeleteRule', { id }), type: 'POST' });
export const setRuleEnabled = (id, isEnabled) =>
  abpAjax({ url: handler('SetRuleEnabled', { id, isEnabled }), type: 'POST' });
export const dryRun = (ruleId) => abpAjax({ url: handler('DryRun', { ruleId }), type: 'POST' });
export const runRule = (ruleId) => abpAjax({ url: handler('RunRule', { ruleId }), type: 'POST' });

/* İzin matrisi */
export const getFieldPermissions = (documentTypeId) =>
  abpAjax({ url: handler('FieldPermissions', { documentTypeId }), type: 'GET' });
export const setFieldPermission = (dto) => postJson(handler('SetFieldPermission'), dto);

/* Entegrasyonlar + şablonlar + konsolide */
export const getIntegrations = () => abpAjax({ url: handler('Integrations'), type: 'GET' });
export const saveIntegration = (id, dto) => postJson(handler('SaveIntegration', { id }), dto);
export const deleteIntegration = (id) => abpAjax({ url: handler('DeleteIntegration', { id }), type: 'POST' });
export const getTemplates = () => abpAjax({ url: handler('Templates'), type: 'GET' });
export const getConsolidated = () => abpAjax({ url: handler('Consolidated'), type: 'GET' });
