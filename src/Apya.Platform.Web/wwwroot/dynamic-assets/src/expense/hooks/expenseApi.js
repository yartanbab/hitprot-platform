import { api, readAntiForgeryToken } from '../../lib/api/httpClient';

/**
 * Saha harcama girişinin GERÇEK sunucu uçları.
 *
 * Bu dosyadan önce gönderim `fixtures.js`'e gidiyordu: kullanıcı "Masraf
 * kaydedildi" görüyor, ortada hiçbir kayıt olmuyordu. Sunucuda gider için fiş
 * okuma ucu YOK; bu yüzden form boş açılır (F-01). Fotoğraf, gider kaydedildikten
 * sonra fiş olarak eklenir (attachReceipt).
 */

/** Kayıt formunun bağlam seçicileri: proje ve kasa listesi. */
export async function fetchCaptureContext() {
    const [projects, accounts] = await Promise.all([
        api.get('/api/app/project?MaxResultCount=200&Sorting=name'),
        api.get('/api/app/cash-account?MaxResultCount=100'),
    ]);

    return {
        projects: (projects?.items ?? []).map(p => ({ id: p.id, name: p.name, currency: p.currency })),
        accounts: (accounts?.items ?? []).map(a => ({ id: a.id, name: a.name, currency: a.currency })),
    };
}

/**
 * Projenin bütçe kalemleri. Kalem tanımlıysa seçim ZORUNLUDUR — aynı kural
 * masaüstü kayıt formunda ve sunucuda da işliyor
 * (ProjectBudgetManager.EnsureBudgetLineIsValidAsync).
 */
export async function fetchBudgetLines(projectId) {
    if (!projectId) { return { lines: [], requiresBudgetLine: false }; }

    const lookup = await api.get(`/api/app/project-budget/record-form-lookup/${projectId}`);
    return {
        lines: (lookup?.lines ?? []).map(l => ({
            id: l.id,
            label: l.code ? `${l.code} · ${l.name}` : l.name,
            remaining: l.remainingAmount,
        })),
        requiresBudgetLine: !!lookup?.requiresBudgetLine,
    };
}

/** ExpenseCategory enum değeri; boş/bilinmeyen (ör. eski kuyruktaki metin) → Other (0). */
function toCategory(value) {
    const n = Number.parseInt(value, 10);
    return Number.isInteger(n) && n >= 0 ? n : 0;
}

/**
 * Gideri oluşturur. Sunucu sözleşmesi: CreateUpdateExpenseDto.
 * Formda ayrı başlık alanı yok: zorunlu Title = tedarikçi, not = açıklama.
 */
export function createExpense(payload) {
    return api.post('/api/app/expense', {
        title: payload.title || payload.vendor,
        amount: payload.amount,
        currency: payload.currency || 'TRY',
        expenseDate: payload.date,
        category: toCategory(payload.category),
        cashAccountId: payload.cashAccountId,
        projectId: payload.projectId || null,
        budgetLineId: payload.budgetLineId || null,
        description: payload.description || payload.note || null,
    });
}

const EXTENSION_BY_TYPE = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };

/**
 * Belge Merkezi'nde görünecek ad. Telefon kamerası her fotoğrafa "image.jpg" der;
 * "Fiş - Migros - 2026-11-11.jpg" listede neyin ne olduğunu söyler. Uzantı korunur:
 * sunucu dosya türünü uzantıdan doğrular.
 */
export function receiptFileName(file, payload) {
    const original = file?.name ?? '';
    const dot = original.lastIndexOf('.');
    const extension = dot > 0 ? original.slice(dot).toLowerCase() : (EXTENSION_BY_TYPE[file?.type] ?? '.jpg');
    const parts = ['Fiş', payload?.title || payload?.vendor, payload?.date]
        .map(p => String(p ?? '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
    return parts.join(' - ').slice(0, 120) + extension;
}

/**
 * Çekilen fişi, az önce kaydedilen gidere ekler (Belge Merkezi + gider bağı).
 * Sunucu yalnız kullanıcının KENDİ oluşturduğu gidere izin verir.
 * apiFetch gövdeyi JSON'a çevirdiği için çok parçalı istek burada elle kurulur.
 */
export async function attachReceipt(expenseId, file, payload) {
    const form = new FormData();
    form.append('expenseId', expenseId);
    form.append('file', file, receiptFileName(file, payload));

    const headers = {};
    const token = readAntiForgeryToken();
    if (token) headers.RequestVerificationToken = token;

    const response = await fetch('/Expenses/Capture?handler=AttachReceipt', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: form,
    });

    if (!response.ok) {
        let message = null;
        try { message = (await response.json())?.error?.message ?? null; } catch { /* gövdesiz yanıt */ }
        throw new Error(message || `Fiş eklenemedi (${response.status}).`);
    }
}
