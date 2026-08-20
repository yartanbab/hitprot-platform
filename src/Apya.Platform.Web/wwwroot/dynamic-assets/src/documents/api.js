/**
 * Documents — sunucu köprüsü.
 *
 * Klasör/sayfa CRUD'u ABP dinamik proxy'siyle (window.apya.platform.documents.document),
 * belge (DocumentFile) uçları Razor Page handler'larıyla konuşur. Bu ayrım modülün
 * mevcut deseni: özel metodların dinamik proxy route'ları belirsiz olduğu için
 * ek/indirme uçları da handler üzerinden gidiyordu. Yetkilendirme her iki yolda da
 * AppService'teki [Authorize] ile uygulanır.
 */

export const abpDocument = () => window?.apya?.platform?.documents?.document;
export const abpAuth = (p) => window?.abp?.auth?.isGranted(p);
export const abpNotify = (type, msg) => window?.abp?.notify?.[type]?.(msg);
export const abpAppPath = () => window?.abp?.appPath ?? '/';

/** abp.ajax jQuery Deferred döner; React'te await edebilmek için Promise'e sarılır. */
function abpAjax(options) {
  return new Promise((resolve, reject) => {
    window.abp.ajax(options).done(resolve).fail(reject);
  });
}

const handler = (name, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    // Diziler TEKRARLI anahtar olarak yazılır ("ids=a&ids=b"); virgülle
    // birleştirilse ASP.NET Core listeye bağlayamaz.
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
      return;
    }

    query.append(key, value);
  });
  const qs = query.toString();
  return `${abpAppPath()}Documents?handler=${name}${qs ? '&' + qs : ''}`;
};

const postJson = (url, body) =>
  abpAjax({ url, type: 'POST', contentType: 'application/json', data: JSON.stringify(body) });

/* ─── Belge listesi ve detayı ─────────────────────────────────────────── */

export const getFiles = (input) => abpAjax({ url: handler('Files', input), type: 'GET' });

export const getFile = (id) => abpAjax({ url: handler('File', { id }), type: 'GET' });

export const updateFileMeta = (id, dto) => postJson(handler('UpdateFileMeta', { id }), dto);

export const moveFile = (id, targetDocumentId) =>
  abpAjax({ url: handler('MoveFile', { id, targetDocumentId }), type: 'POST' });

export const bulkMoveFiles = (documentFileIds, targetDocumentId) =>
  postJson(handler('BulkMove'), { documentFileIds, targetDocumentId });

export const bulkTagFiles = (documentFileIds, tags, remove = false) =>
  postJson(handler('BulkTag'), { documentFileIds, tags, remove });

export const deleteFile = (id) => abpAjax({ url: handler('DeleteFile', { id }), type: 'POST' });

/** Çöp kutusundan geri alma — belge ekleri ve etiketleriyle birlikte döner. */
export const restoreFile = (id) => abpAjax({ url: handler('RestoreFile', { id }), type: 'POST' });

/* ─── Yardımcı kaynaklar ──────────────────────────────────────────────── */

export const getDocumentTypes = () => abpAjax({ url: handler('DocumentTypes'), type: 'GET' });

export const getWorkSteps = (projectId) => abpAjax({ url: handler('WorkSteps', { projectId }), type: 'GET' });

export const getTagList = () => abpAjax({ url: handler('TagList'), type: 'GET' });

/* ─── Uygunluk (Faz B) ────────────────────────────────────────────────── */

export const getCompliancePackages = (projectId) =>
  abpAjax({ url: handler('CompliancePackages', { projectId }), type: 'GET' });

export const getComplianceOverview = (projectId, periodCode) =>
  abpAjax({ url: handler('ComplianceOverview', { projectId, periodCode }), type: 'GET' });

export const applyCompliancePackage = (projectId, packageId, periodCode) =>
  postJson(handler('ApplyCompliancePackage'), { projectId, packageId, periodCode });

export const removeComplianceAssignment = (assignmentId) =>
  abpAjax({ url: handler('RemoveComplianceAssignment', { assignmentId }), type: 'POST' });

export const waiveComplianceItem = (payload) => postJson(handler('WaiveComplianceItem'), payload);

export const linkComplianceDocument = (payload) => postJson(handler('LinkComplianceDocument'), payload);

/* ─── Öneriler (Faz D) ────────────────────────────────────────────────── */

export const getSuggestions = (projectId) =>
  abpAjax({ url: handler('Suggestions', { projectId }), type: 'GET' });

export const applySuggestions = (suggestions) => postJson(handler('ApplySuggestions'), { suggestions });

export const dismissSuggestions = (suggestions) => postJson(handler('DismissSuggestions'), { suggestions });

/* --- Kiracının kendi paketi (katalog) --- */

export const getProjectTasks = (projectId) =>
  abpAjax({ url: handler('ProjectTasks', { projectId }), type: 'GET' });

export const getComplianceRequirements = (packageId) =>
  abpAjax({ url: handler('ComplianceRequirements', { packageId }), type: 'GET' });

export const createCompliancePackage = (dto) => postJson(handler('CreateCompliancePackage'), dto);

export const updateCompliancePackage = (id, dto) => postJson(handler('UpdateCompliancePackage', { id }), dto);

export const deleteCompliancePackage = (id) =>
  abpAjax({ url: handler('DeleteCompliancePackage', { id }), type: 'POST' });

export const addComplianceRequirement = (packageId, dto) =>
  postJson(handler('AddComplianceRequirement', { packageId }), dto);

export const updateComplianceRequirement = (id, dto) =>
  postJson(handler('UpdateComplianceRequirement', { id }), dto);

export const deleteComplianceRequirement = (id) =>
  abpAjax({ url: handler('DeleteComplianceRequirement', { id }), type: 'POST' });

/* ─── Etkinlik / denetim izi (Faz B) ──────────────────────────────────── */

export const getActivity = (input) => abpAjax({ url: handler('Activity', input), type: 'GET' });

/* ─── Ekler (mevcut uçlar, değişmedi) ─────────────────────────────────── */

export const uploadAttachment = (documentId, file) => {
  const formData = new FormData();
  formData.append('documentId', documentId);
  formData.append('file', file);
  return abpAjax({
    url: handler('UploadFile'),
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
  });
};
