/**
 * httpClient — fetch wrapper with ABP-aware defaults.
 * - Cookie-based auth (same-site session); no manual token plumbing.
 * - RequestVerificationToken eklenir (ABP anti-forgery; <meta> tag'inden).
 * - JSON normalization + ABP error envelope parse.
 *
 * Dış bağımlılık YOK (axios eklemekten kaçındık).
 */

const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

class ApiError extends Error {
    constructor(message, { status, code, details, validationErrors } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
        this.validationErrors = validationErrors;
    }
}

function readAntiForgeryToken() {
    if (typeof document === 'undefined') return null;
    const meta = document.querySelector('meta[name="__RequestVerificationToken"]');
    if (meta) return meta.getAttribute('content');
    const input = document.querySelector('input[name="__RequestVerificationToken"]');
    return input ? input.value : null;
}

async function parseError(response) {
    let body = null;
    try { body = await response.json(); } catch (_) { /* not JSON */ }
    const env = body?.error;
    return new ApiError(
        env?.message || `HTTP ${response.status}`,
        {
            status: response.status,
            code: env?.code,
            details: env?.details,
            validationErrors: env?.validationErrors,
        },
    );
}

export async function apiFetch(path, { method = 'GET', body, signal, headers = {} } = {}) {
    const isMutation = method !== 'GET' && method !== 'HEAD';
    const finalHeaders = { ...DEFAULT_HEADERS, ...headers };

    if (isMutation) {
        const token = readAntiForgeryToken();
        if (token) finalHeaders['RequestVerificationToken'] = token;
    }

    const response = await fetch(path, {
        method,
        credentials: 'include', /* ABP cookie session */
        signal,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) throw await parseError(response);

    if (response.status === 204) return null;
    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) return response.json();
    return response.text();
}

export const api = {
    get:    (path, opts) => apiFetch(path, { ...opts, method: 'GET' }),
    post:   (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body }),
    put:    (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body }),
    patch:  (path, body, opts) => apiFetch(path, { ...opts, method: 'PATCH', body }),
    delete: (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' }),
};

export { ApiError };
