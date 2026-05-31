import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import './index.css';

const STATUS = {
  0: { label: 'Taslak', cls: 'bg-slate-100 text-slate-600' },
  1: { label: 'Yayında', cls: 'bg-emerald-100 text-emerald-700' },
  2: { label: 'Arşiv', cls: 'bg-amber-100 text-amber-700' },
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

  if (loading) return <div className="py-16 text-center text-slate-400">Formlar yükleniyor…</div>;

  return (
    <div className="text-slate-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Formlarım</h1>
          <p className="text-sm text-slate-500">{forms.length} form</p>
        </div>
        <a href="/DynamicAssets/Builder" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700">
          + Yeni Form
        </a>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl">📝</div>
          <h3 className="text-lg font-bold text-slate-700">Henüz formun yok</h3>
          <p className="mt-1 text-sm text-slate-400">İlk formunu oluşturmak için başla.</p>
          <a href="/DynamicAssets/Builder" className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
            + Yeni Form Oluştur
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {forms.map((f) => (
            <div key={f.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 font-bold text-slate-800">{f.title}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[f.status]?.cls}`}>{STATUS[f.status]?.label}</span>
              </div>
              {f.description && <p className="mb-3 line-clamp-2 text-sm text-slate-500">{f.description}</p>}

              <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                <span className="whitespace-nowrap">📊 {f.responseCount} yanıt</span>
                <span className="whitespace-nowrap">👁 {f.viewCount}</span>
                <span className="ml-auto whitespace-nowrap">{fmtDate(f.creationTime)}</span>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <a href={`/DynamicAssets/Builder?id=${f.id}`} className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">Düzenle</a>
                <a href={`/DynamicAssets/Responses?formId=${f.id}`} className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">Yanıtlar</a>
                {f.status === 1 && (
                  <a href={`/f/${f.slug}`} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs hover:bg-slate-50" title="Formu aç">↗</a>
                )}
                <button onClick={() => remove(f)} className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50" title="Sil">🗑</button>
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
