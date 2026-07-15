import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import './index.css';

const STATUS = {
  0: { label: 'Taslak', cls: 'bg-neutral-100 text-neutral-700' },
  1: { label: 'Yayında', cls: 'bg-positive-100 text-positive-700' },
  2: { label: 'Arşiv', cls: 'bg-warning-100 text-warning-700' },
};
const fmtDate = (s) => { try { return new Date(s).toLocaleDateString('tr-TR'); } catch { return s; } };

function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/api/app/form?MaxResultCount=200&SkipCount=0');
      setForms(res.items || []);
    } catch (e) {
      notify('error', e?.message || 'Formlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (form) => {
    const ok = await confirmDelete(form.title);
    if (!ok) return;
    try {
      await api.delete(`/api/app/form/${form.id}`);
      setForms((prev) => prev.filter((f) => f.id !== form.id));
      notify('success', 'Form silindi.');
    } catch (e) {
      notify('error', e?.message || 'Silme başarısız.');
    }
  };

  if (loading) return <div className="py-16 text-center text-text-tertiary">Formlar yükleniyor…</div>;

  return (
    <div className="text-text-primary">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Formlarım</h1>
          <p className="text-sm text-text-secondary">{forms.length} form</p>
        </div>
        <a href="/DynamicAssets/Builder" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600">
          + Yeni Form
        </a>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-default py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl">📝</div>
          <h3 className="text-lg font-bold text-text-primary">Henüz formun yok</h3>
          <p className="mt-1 text-sm text-text-tertiary">İlk formunu oluşturmak için başla.</p>
          <a href="/DynamicAssets/Builder" className="mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600">
            + Yeni Form Oluştur
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {forms.map((f) => (
            <div key={f.id} className="flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 font-bold text-text-primary">{f.title}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[f.status]?.cls}`}>{STATUS[f.status]?.label}</span>
              </div>
              {f.description && <p className="mb-3 line-clamp-2 text-sm text-text-secondary">{f.description}</p>}

              <div className="mt-auto flex items-center gap-3 border-t border-subtle pt-3 text-xs text-text-tertiary">
                <span className="whitespace-nowrap">📊 {f.responseCount} yanıt</span>
                <span className="whitespace-nowrap">👁 {f.viewCount}</span>
                <span className="ml-auto whitespace-nowrap">{fmtDate(f.creationTime)}</span>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <a href={`/DynamicAssets/Builder?id=${f.id}`} className="min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken">Düzenle</a>
                <a href={`/DynamicAssets/Responses?formId=${f.id}`} className="min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken">Yanıtlar</a>
                {f.status === 1 && (
                  <a href={`/f/${f.slug}`} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs hover:bg-surface-sunken" title="Formu aç">↗</a>
                )}
                <button onClick={() => remove(f)} className="shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50" title="Sil">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function notify(kind, msg) {
  const abp = window.abp;
  if (abp?.notify && kind === 'success') abp.notify.success(msg);
  else if (abp?.message) abp.message[kind === 'error' ? 'error' : 'info'](msg);
  else console.log(`[${kind}] ${msg}`);
}
function confirmDelete(title) {
  const abp = window.abp;
  if (abp?.message?.confirm) {
    return new Promise((resolve) => {
      abp.message.confirm(`"${title}" formunu silmek istediğinize emin misiniz?`, 'Onay', (r) => resolve(!!r));
    });
  }
  return Promise.resolve(window.confirm(`"${title}" formunu sil?`));
}

const root = document.getElementById('forms-list-root');
if (root) createRoot(root).render(<FormsList />);
