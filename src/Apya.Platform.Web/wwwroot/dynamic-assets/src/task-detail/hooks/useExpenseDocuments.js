import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isGranted } from './useTaskDetail';

/**
 * Gider ↔ evrak bağı — Belgeler modülünün MEVCUT eşleştirme uçları üzerinden.
 *
 * Yeni sunucu kodu YOK: `Documents/Matching` sayfasının handler'ları zaten
 * `IDocumentMatchingAppService`i açıyor ve proje ekranındaki eşleştirme tezgâhı
 * (documents-project/api.js) tam olarak bu köprüyü kullanıyor. Görev detayı da
 * aynı kapıdan geçer; böylece iki ekranda tek bağ modeli yaşar.
 *
 * Evrak GÖREVE değil, giderin kendisine bağlanır — DocumentFile proje kapsamlı
 * bir varlık; göreve kolon açmak yerine görevin gideri üzerinden bağlanıyor.
 */
function ajax(options) {
    const request = window?.abp?.ajax?.(options);
    if (!request) return Promise.reject(new Error('ABP köprüsü yüklenmedi.'));
    return new Promise((resolve, reject) => { request.done(resolve).fail(reject); });
}

function handlerUrl(name, params = {}) {
    const appPath = window?.abp?.appPath ?? '/';
    const query = new URLSearchParams({ handler: name });
    Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') query.append(k, v); });
    return `${appPath}Documents/Matching?${query.toString()}`;
}

/** Belgeleri görme yetkisi — yoksa hiçbir çağrı yapılmaz (sayfa 403 döner). */
export const canSeeDocuments = () => isGranted('Platform.Documents.Default');

/** Bağ kurma/kaldırma yetkisi — eşleştirme uçları ManageMeta istiyor. */
export const canLinkDocuments = () => isGranted('Platform.Documents.ManageMeta');

/**
 * Projedeki TÜM gider-evrak bağları, gider kimliğine göre gruplanmış.
 *
 * Gider başına ayrı uç YOK; proje bazlı tek çağrı sekmedeki bütün satırlara
 * yetiyor ve react-query onu satırlar arasında paylaşıyor.
 */
export function useExpenseMatches(projectId) {
    const enabled = Boolean(projectId) && canSeeDocuments();

    const query = useQuery({
        queryKey: ['task-detail', 'expense-matches', projectId],
        queryFn: () => ajax({ url: handlerUrl('Matches', { projectId }), type: 'GET' }),
        enabled,
        staleTime: 60_000,
        retry: false,
    });

    const byExpense = new Map();
    (query.data ?? []).forEach((m) => {
        if (!byExpense.has(m.expenseId)) byExpense.set(m.expenseId, []);
        byExpense.get(m.expenseId).push(m);
    });

    return { byExpense, enabled, isLoading: query.isLoading };
}

/** Bir gider için skorlanmış aday belgeler — panel açılınca çekilir. */
export function useExpenseCandidates(expenseId, enabled) {
    const query = useQuery({
        queryKey: ['task-detail', 'expense-candidates', expenseId],
        queryFn: () => ajax({ url: handlerUrl('Candidates', { expenseId }), type: 'GET' }),
        enabled: Boolean(expenseId) && enabled && canSeeDocuments(),
        staleTime: 30_000,
        retry: false,
    });

    return { candidates: query.data ?? [], isLoading: query.isLoading };
}

export function useMatchActions(projectId) {
    const queryClient = useQueryClient();

    const refresh = (expenseId) => {
        queryClient.invalidateQueries({ queryKey: ['task-detail', 'expense-matches', projectId] });
        queryClient.invalidateQueries({ queryKey: ['task-detail', 'expense-candidates', expenseId] });
    };

    const link = useMutation({
        mutationFn: ({ documentFileId, expenseId, score }) => ajax({
            url: handlerUrl('CreateMatch'),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ documentFileId, expenseId, score: score ?? 0 }),
        }),
        onSuccess: (_data, variables) => refresh(variables.expenseId),
    });

    const unlink = useMutation({
        mutationFn: ({ matchId }) => ajax({ url: handlerUrl('RemoveMatch', { matchId }), type: 'POST' }),
        onSuccess: (_data, variables) => refresh(variables.expenseId),
    });

    return { link, unlink, isBusy: link.isPending || unlink.isPending };
}
