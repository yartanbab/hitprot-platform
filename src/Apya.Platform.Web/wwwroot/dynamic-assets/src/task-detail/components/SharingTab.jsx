import React, { useState } from 'react';
import { useTaskShareLinks } from '../hooks/useTaskShareLinks';
import { isGranted } from '../hooks/useTaskDetail';

const DEFAULT_FORM = {
    recipientName: '',
    recipientEmail: '',
    lifetimeDays: 14,
    allowComment: true,
    allowUpload: true,
    allowDownload: true,
};

function fmtDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('tr-TR');
}

/**
 * Dış paylaşım sekmesi — görevi ekipte olmayan birine süreli link ile açar.
 *
 * Üretilen link kutusu bilerek ısrarcıdır: token sunucuda SAKLANMAZ, yalnız bu yanıtta
 * döner. Kullanıcı kopyalamadan kapatırsa link kalıcı olarak kaybolur ve yenisini üretmek
 * gerekir — kutu bu yüzden "kapat" ile açıkça kapatılana kadar durur.
 */
export function SharingTab({ taskId }) {
    const { links, isPending, create, revoke, isCreating } = useTaskShareLinks(taskId);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [justCreated, setJustCreated] = useState(null);

    const canShare = isGranted('Platform.Tasks.ShareExternally');

    if (!canShare) {
        return (
            <p className="m-0 text-[12.5px] text-text-tertiary">
                Görevi ekip dışıyla paylaşma yetkiniz yok.
            </p>
        );
    }

    const set = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.recipientName.trim()) return;
        try {
            const created = await create({
                ...form,
                lifetimeDays: Number(form.lifetimeDays) || 14,
            });
            setJustCreated(created);
            setForm(DEFAULT_FORM);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Paylaşım linki üretilemedi.');
        }
    };

    const absoluteUrl = (url) => `${window.location.origin}${url}`;

    const copy = (url) => {
        navigator.clipboard?.writeText(absoluteUrl(url));
        window?.abp?.notify?.info?.('Bağlantı kopyalandı.');
    };

    const onRevoke = async (id) => {
        try {
            await revoke(id);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Bağlantı iptal edilemedi.');
        }
    };

    return (
        <div className="flex flex-col gap-3.5">
            {justCreated && (
                <div className="flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5">
                    <div className="text-[12.5px] font-bold text-text-primary">
                        Bağlantı hazır — <span className="font-normal">şimdi kopyalayın, bir daha gösterilmeyecek.</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <code className="min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary">
                            {absoluteUrl(justCreated.url)}
                        </code>
                        <button
                            type="button"
                            onClick={() => copy(justCreated.url)}
                            className="rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer"
                        >
                            Kopyala
                        </button>
                        <button
                            type="button"
                            onClick={() => setJustCreated(null)}
                            className="rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5">
                <div className="text-[12.5px] font-bold text-text-primary">Yeni paylaşım bağlantısı</div>

                <div className="flex flex-wrap gap-2.5">
                    <input
                        type="text"
                        required
                        value={form.recipientName}
                        onChange={set('recipientName')}
                        placeholder="Kime? (ad soyad)"
                        className="min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
                    />
                    <input
                        type="email"
                        value={form.recipientEmail}
                        onChange={set('recipientEmail')}
                        placeholder="E-posta (isteğe bağlı)"
                        className="min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
                    />
                    <input
                        type="number"
                        min="1"
                        max="90"
                        value={form.lifetimeDays}
                        onChange={set('lifetimeDays')}
                        title="Geçerlilik (gün)"
                        className="w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
                    />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.allowComment} onChange={set('allowComment')} />
                        Yorum yazabilsin
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.allowUpload} onChange={set('allowUpload')} />
                        Dosya yükleyebilsin
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.allowDownload} onChange={set('allowDownload')} />
                        Dosya indirebilsin
                    </label>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-[11.5px] text-text-tertiary">
                        Bağlantı bu görevi ve alt görevlerini açar. Ekip içi yorumlar gösterilmez.
                    </span>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60"
                    >
                        {isCreating ? 'Üretiliyor…' : 'Bağlantı üret'}
                    </button>
                </div>
            </form>

            {isPending ? (
                <p className="m-0 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
            ) : links.length === 0 ? (
                <p className="m-0 text-[12.5px] text-text-tertiary">Bu görev henüz kimseyle paylaşılmadı.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3"
                        >
                            <div className="min-w-0">
                                <div className="truncate text-[12.5px] font-bold text-text-primary">
                                    {link.recipientName}
                                    {link.recipientEmail ? (
                                        <span className="font-normal text-text-tertiary"> · {link.recipientEmail}</span>
                                    ) : null}
                                </div>
                                <div className="text-[11.5px] text-text-tertiary">
                                    {link.isActive
                                        ? `${fmtDate(link.expiresAt)} tarihine kadar geçerli`
                                        : link.revokedAt
                                            ? 'İptal edildi'
                                            : 'Süresi doldu'}
                                    {' · '}{link.accessCount} erişim
                                    {' · '}{link.uploadCount} dosya
                                </div>
                            </div>

                            {link.isActive && (
                                <button
                                    type="button"
                                    onClick={() => onRevoke(link.id)}
                                    className="shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle"
                                >
                                    İptal et
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
