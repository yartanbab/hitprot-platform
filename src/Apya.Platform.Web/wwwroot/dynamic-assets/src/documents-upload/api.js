/** Yukleme kuyrugu — sunucu koprusu. */

export const abpNotify = (type, msg) => window?.abp?.notify?.[type]?.(msg);
export const abpAppPath = () => window?.abp?.appPath ?? '/';
export const abpDocument = () => window?.apya?.platform?.documents?.document;

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
  return `${abpAppPath()}Documents/Upload?handler=${name}${qs ? '&' + qs : ''}`;
};

export const getDocumentTypes = () => abpAjax({ url: handler('DocumentTypes'), type: 'GET' });

export const setMeta = (id, dto) =>
  abpAjax({
    url: handler('SetMeta', { id }),
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(dto),
  });

/* ─── Sunucu doğrulamasının İSTEMCİ AYNASI ───────────────────────────────
   Yetkili olan sunucudur (LocalDiskUploadedFileStorage); buradaki kopya
   yalnızca 25 MB'lık bir dosyayı yükleyip sonunda reddedilmeyi önlemek için.
   Sunucudaki liste değişirse burası da güncellenmeli.                     */
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = [
  '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt',
  '.png', '.jpg', '.jpeg', '.gif', '.txt', '.csv', '.zip', '.rar',
];

/** Dosyayı yüklemeden önce dener; sorun varsa Türkçe sebep, temizse null döner. */
export function validate(file) {
  const dot = file.name.lastIndexOf('.');
  const ext = dot < 0 ? '' : file.name.slice(dot).toLowerCase();

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return 'Desteklenmeyen dosya türü';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Dosya 25 MB sınırını aşıyor';
  }
  return null;
}

/**
 * Tek dosya yükler. fetch yerine XHR: yalnız XHR yükleme ilerlemesi veriyor,
 * kuyrukta dosya başına yüzde göstermek istiyoruz.
 *
 * ABP'nin antiforgery başlığı elle eklenir — abp.ajax bunu kendi yapardı ama
 * o da ilerleme olayı vermiyor.
 */
export function uploadFile(documentId, file, { onProgress, signal } = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('documentId', documentId);
    form.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', handler('Upload'), true);

    const token = window?.abp?.security?.antiForgery?.getToken?.()
      ?? document.querySelector('input[name="__RequestVerificationToken"]')?.value;
    if (token) xhr.setRequestHeader('RequestVerificationToken', token);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { resolve(null); }
      } else {
        reject(new Error(serverMessage(xhr) || `Sunucu ${xhr.status} döndü`));
      }
    };

    xhr.onerror = () => reject(new Error('Ağ hatası'));
    xhr.onabort = () => reject(new Error('İptal edildi'));

    if (signal) signal.addEventListener('abort', () => xhr.abort(), { once: true });

    xhr.send(form);
  });
}

/** ABP hata gövdesinden kullanıcıya gösterilebilir mesajı çıkarır. */
function serverMessage(xhr) {
  try {
    const body = JSON.parse(xhr.responseText);
    return body?.error?.message || body?.error?.details || null;
  } catch {
    return xhr.responseText?.slice(0, 160) || null;
  }
}

export const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
