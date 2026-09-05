import React from 'react';
import { Button } from '../../components/ui';
import { fmtShortDate } from '../v3/tabPrimitives';
import { canLinkDocuments, useExpenseCandidates, useMatchActions } from '../hooks/useExpenseDocuments';

function fmtAmount(value) {
    if (value == null) return '—';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(value);
}

/**
 * Bir giderin evrakları — satırın altında açılan şerit.
 *
 * Modal İÇİNDE ikinci bir modal AÇMIYORUZ: görev detayı zaten bir diyalog,
 * üstüne binen küçük seçici hem yığın bağlamı hem odak tuzağı sorunu çıkarır.
 *
 * YÜKLEME YOK, BAĞLAMA VAR: evrak sisteme Belgeler modülünden girer (yükleme
 * akışı tam sayfa ve belge türü/dönem meta verisi ister). Burada yalnız var olan
 * evrak gidere bağlanır — Belgeler'deki eşleştirme tezgâhıyla aynı bağ.
 */
export function ExpenseDocumentsPanel({ expenseId, projectId, matches }) {
    const { candidates, isLoading } = useExpenseCandidates(expenseId, true);
    const { link, unlink, isBusy } = useMatchActions(projectId);
    const canLink = canLinkDocuments();

    const linkedIds = new Set(matches.map((m) => m.documentFileId));
    const available = candidates.filter((c) => !linkedIds.has(c.documentFileId));

    const notify = (err, fallback) => window?.abp?.notify?.error?.(err?.message || fallback);

    return (
        <div className="flex flex-col gap-3 px-4 pb-3.5 pt-1 bg-surface-raised">
            {matches.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary">
                        Bağlı evraklar
                    </span>
                    {matches.map((m) => (
                        <div key={m.id} className="flex items-center gap-2.5">
                            <i className="fa-solid fa-paperclip text-[11px] text-text-tertiary" />
                            <span className="flex-1 min-w-0 truncate text-[12px] text-text-primary">
                                {m.documentFileName}
                            </span>
                            {m.annexNumber && (
                                <span className="shrink-0 font-mono text-[11px] text-text-tertiary">EK-{m.annexNumber}</span>
                            )}
                            {canLink && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={isBusy}
                                    onClick={() => unlink.mutate(
                                        { matchId: m.id, expenseId },
                                        { onError: (err) => notify(err, 'Evrak bağı kaldırılamadı.') },
                                    )}
                                >
                                    Kaldır
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary">
                    Aday evraklar
                </span>

                {isLoading && <span className="text-[12px] text-text-tertiary">Adaylar aranıyor…</span>}

                {!isLoading && available.length === 0 && (
                    <span className="text-[12px] text-text-tertiary">
                        Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır.
                    </span>
                )}

                {available.map((c) => (
                    <div key={c.documentFileId} className="flex items-center gap-2.5">
                        <i className="fa-solid fa-file-lines text-[11px] text-text-tertiary" />
                        <span className="flex-1 min-w-0 truncate text-[12px] text-text-primary">{c.displayName}</span>
                        <span className="shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden">
                            {fmtAmount(c.amount)} · {fmtShortDate(c.documentDate)}
                        </span>
                        {/* Skor bir ÖNERİ: 100 puanlık aday bile kullanıcı onayı olmadan bağlanmaz. */}
                        <span className={`shrink-0 font-mono text-[11px] font-bold ${c.isStrong ? 'text-success' : 'text-text-tertiary'}`}>
                            %{c.score}
                        </span>
                        {canLink && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => link.mutate(
                                    { documentFileId: c.documentFileId, expenseId, score: c.score },
                                    { onError: (err) => notify(err, 'Evrak bağlanamadı.') },
                                )}
                            >
                                Bağla
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
