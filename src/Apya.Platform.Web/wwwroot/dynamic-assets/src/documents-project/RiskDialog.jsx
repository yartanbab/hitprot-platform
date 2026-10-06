import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent } from '../components/ui';

/**
 * Risk kütüğüne kayıt penceresi (PRJ-09).
 *
 * Risk dört ARDIŞIK tarayıcı istem kutusuyla giriliyordu (başlık, olasılık, etki, önlem).
 * Herhangi birinde vazgeçilince önceki cevaplar kayboluyor, olasılık/etki serbest metin
 * olduğu için "3" yerine yazılan her şey sessizce 3 sayılıyor, risk puanı da ancak
 * kayıttan sonra görülebiliyordu. Burada dört alan birlikte durur ve puan yazarken görünür.
 *
 * Pencere her açılışta boş başlar: yarım bırakılmış bir kayıt sonraki riske taşınmaz.
 */

const LEVELS = [1, 2, 3, 4, 5];
// Sunucudaki sınırların aynısı (MatchingConsts.MaxRiskTitleLength / MaxRiskTextLength).
const MAX_TITLE = 200;
const MAX_MITIGATION = 1000;

const fieldLabel = 'mb-1 block text-[12px] font-semibold text-text-secondary';
const fieldInput = 'w-full rounded-md border border-default bg-surface px-3 py-2 text-[13px] text-text-primary ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

export function RiskDialog({ open, busy, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [likelihood, setLikelihood] = useState(3);
    const [impact, setImpact] = useState(3);
    const [mitigation, setMitigation] = useState('');

    useEffect(() => {
        if (open) {
            setTitle('');
            setLikelihood(3);
            setImpact(3);
            setMitigation('');
        }
    }, [open]);

    const trimmedTitle = title.trim();
    const canSubmit = trimmedTitle.length > 0 && !busy;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSubmit({
            title: trimmedTitle,
            likelihood,
            impact,
            mitigation: mitigation.trim() || null,
        });
    };

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next && !busy) onClose(); }}>
            <DialogContent title="Risk ekle" className="w-full max-w-[480px] p-0">
                <form onSubmit={handleSubmit}>
                    <header className="flex items-center justify-between border-b border-subtle px-5 py-3">
                        <h2 className="text-[15px] font-semibold text-text-primary">Risk ekle</h2>
                        <button
                            type="button" onClick={onClose} disabled={busy} aria-label="Kapat"
                            className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                        >
                            <i className="fa fa-xmark" aria-hidden="true" />
                        </button>
                    </header>

                    <div className="flex flex-col gap-3 px-5 py-4">
                        <div>
                            <label className={fieldLabel} htmlFor="risk-title">Risk başlığı</label>
                            <input
                                id="risk-title" type="text" className={fieldInput} autoFocus
                                maxLength={MAX_TITLE} value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={fieldLabel} htmlFor="risk-likelihood">Olasılık (1-5)</label>
                                <select
                                    id="risk-likelihood" className={fieldInput} value={likelihood}
                                    onChange={(e) => setLikelihood(Number(e.target.value))}
                                >
                                    {LEVELS.map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={fieldLabel} htmlFor="risk-impact">Etki (1-5)</label>
                                <select
                                    id="risk-impact" className={fieldInput} value={impact}
                                    onChange={(e) => setImpact(Number(e.target.value))}
                                >
                                    {LEVELS.map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Puan sunucudaki kuralın aynısı (olasılık × etki); kayıttan ÖNCE görünür. */}
                        <p className="text-[12px] text-text-tertiary" data-testid="risk-score">
                            Risk puanı: <strong className="text-text-primary">{likelihood * impact}</strong> / 25
                        </p>

                        <div>
                            <label className={fieldLabel} htmlFor="risk-mitigation">Önlem (boş bırakılabilir)</label>
                            <textarea
                                id="risk-mitigation" rows={3} className={fieldInput}
                                maxLength={MAX_MITIGATION} value={mitigation}
                                onChange={(e) => setMitigation(e.target.value)}
                            />
                        </div>
                    </div>

                    <footer className="flex justify-end gap-2 border-t border-subtle px-5 py-3">
                        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={onClose}>Vazgeç</Button>
                        <Button type="submit" size="sm" disabled={!canSubmit}>Riski ekle</Button>
                    </footer>
                </form>
            </DialogContent>
        </Dialog>
    );
}
