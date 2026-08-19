import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui';
import { api } from '../lib/api/httpClient';
import { cn } from '../lib/utils';

/**
 * Toplantıdan görev — dış takvim etkinliği tek yönlü kalmasın, çıktı üretsin.
 *
 * Etkinliğin NOTLARI mevcut AI görev üreticisine gönderilir
 * (/api/ai-task-generator/parse) ve öneriler onay kutularıyla göreve çevrilir.
 * Yeni bir AI ucu yazılmadı: bu akış zaten var olan, kullanımdaki uçtur —
 * takvim yalnız kendi metnini ona veriyor.
 *
 * Proje SEÇİLİR: bir toplantının projesi yoktur, görev ise bir projeye doğar.
 * Seçtirmeden varsayılan bir projeye yazmak, görevleri yanlış yere koyardı.
 */
export function MeetingActions({ item }) {
    const [projectId, setProjectId] = useState('');
    const [approved, setApproved] = useState(() => new Set());
    const notes = item.description ?? item.subtitle ?? '';

    const projects = useQuery({
        queryKey: ['calendar', 'projects-lookup'],
        queryFn: () => api.get('/api/app/task/projects-lookup'),
        staleTime: 10 * 60_000,
    });

    const parse = useMutation({
        mutationFn: async () => {
            /* Notlar bir "belge" olarak gönderilir — uç dosya bekler. */
            const form = new FormData();
            form.append('file', new Blob([`${item.title}\n\n${notes}`], { type: 'text/plain' }), 'toplanti-notlari.txt');
            const response = await fetch(`/api/ai-task-generator/parse?projectId=${projectId}`, {
                method: 'POST',
                body: form,
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!response.ok) throw new Error('Notlardan görev çıkarılamadı.');
            return response.json();
        },
        onSuccess: (data) => setApproved(new Set((data?.suggestions ?? []).map((_, i) => i))),
    });

    const create = useMutation({
        mutationFn: () => api.post('/api/ai-task-generator/create-tasks', {
            projectId,
            approvedTasks: (parse.data?.suggestions ?? []).filter((_, i) => approved.has(i)),
        }),
    });

    const suggestions = parse.data?.suggestions ?? [];

    return (
        <section className="border-t border-subtle px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Toplantıdan görev
            </p>

            {!notes && (
                <p className="mt-1 text-[11.5px] text-text-tertiary">
                    Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz.
                </p>
            )}

            {notes && (
                <>
                    <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        aria-label="Görevlerin ekleneceği proje"
                        className="mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary"
                    >
                        <option value="">Proje seçin…</option>
                        {(projects.data ?? []).map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        disabled={!projectId || parse.isPending}
                        onClick={() => parse.mutate()}
                    >
                        {parse.isPending ? 'Notlar okunuyor…' : 'Notlardan aksiyon çıkar'}
                    </Button>

                    {parse.isError && (
                        <p className="mt-1.5 text-[11px] text-negative-700">{parse.error.message}</p>
                    )}

                    {suggestions.length > 0 && (
                        <div className="mt-2">
                            {suggestions.map((s, index) => (
                                <label key={`${s.title}-${index}`} className="flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0">
                                    <input
                                        type="checkbox"
                                        checked={approved.has(index)}
                                        onChange={() => setApproved((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(index)) next.delete(index); else next.add(index);
                                            return next;
                                        })}
                                        className="mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                                    />
                                    <span className="min-w-0 flex-1 text-[12px] text-text-primary">{s.title}</span>
                                </label>
                            ))}

                            <Button
                                size="sm"
                                variant="primary"
                                className={cn('mt-2')}
                                disabled={approved.size === 0 || create.isPending || create.isSuccess}
                                onClick={() => create.mutate()}
                            >
                                {create.isSuccess
                                    ? `${create.data} görev eklendi`
                                    : create.isPending ? 'Ekleniyor…' : `${approved.size} görev olarak ekle`}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
