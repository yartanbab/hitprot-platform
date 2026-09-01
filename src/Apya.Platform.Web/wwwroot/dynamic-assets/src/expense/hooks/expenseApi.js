import { api } from '../../lib/api/httpClient';

/**
 * Saha harcama girişinin GERÇEK sunucu uçları.
 *
 * Bu dosyadan önce gönderim `fixtures.js`'e gidiyordu: kullanıcı "Masraf
 * kaydedildi" görüyor, ortada hiçbir kayıt olmuyordu. OCR hâlâ fixture —
 * sunucuda gider için OCR ucu YOK — ama ekran bunu artık kullanıcıya söylüyor.
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

/** Gideri oluşturur. Sunucu sözleşmesi: CreateUpdateExpenseDto. */
export function createExpense(payload) {
    return api.post('/api/app/expense', {
        title: payload.title,
        amount: payload.amount,
        currency: payload.currency || 'TRY',
        expenseDate: payload.date,
        category: payload.category ?? 0,
        cashAccountId: payload.cashAccountId,
        projectId: payload.projectId || null,
        budgetLineId: payload.budgetLineId || null,
        description: payload.description || null,
    });
}
