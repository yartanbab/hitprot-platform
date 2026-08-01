import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import { Hint } from './components/ui/Hint';
import './index.css';

const STATUS = {
  0: { label: 'Taslak', cls: 'bg-neutral-100 text-neutral-700' },
  1: { label: 'Yayında', cls: 'bg-positive-100 text-positive-700' },
  2: { label: 'Arşiv', cls: 'bg-warning-100 text-warning-700' },
};
const fmtDate = (s) => { try { return new Date(s).toLocaleDateString('tr-TR'); } catch { return s; } };
const abpAuth = (p) => window?.abp?.auth?.isGranted(p);

/* Kategori rengi KULLANICI VERİSİDİR (renk seçiciyle belirlenir); yalnız
   varsayılanı tasarım sisteminden okunur — sabit '#94a3b8'/'#4f46e5' yerine.
   Runtime okuma: token dark temada değişir, yeni kategori rozeti de değişsin. */
const token = (n, fb) =>
  (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim() || fb;
const FALLBACK_CAT_COLOR = () => token('--apya-neutral-400', '#9CA3AF');
const DEFAULT_NEW_CAT_COLOR = () => token('--apya-accent-500', '#4F46E5');

function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);
  const canManageCategories = abpAuth('Platform.DynamicAssets.ManageCategories');

  const load = async (catId) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ MaxResultCount: '200', SkipCount: '0' });
      if (catId) qs.set('CategoryId', catId);
      const res = await api.get(`/api/app/form?${qs.toString()}`);
      setForms(res.items || []);
    } catch (e) {
      notify('error', e?.message || 'Formlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };
  const loadCategories = () => {
    api.get('/api/app/form-category?MaxResultCount=100').then((res) => setCategories(res.items || [])).catch(() => {});
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { load(categoryFilter); }, [categoryFilter]);

  const catById = (id) => categories.find((c) => c.id === id);

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

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCategoryFilter('')}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === '' ? 'bg-accent text-white' : 'bg-surface-sunken text-text-secondary hover:opacity-80'}`}
        >Tümü</button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === c.id ? 'text-white' : 'text-text-secondary hover:opacity-80'}`}
            style={categoryFilter === c.id ? { backgroundColor: c.color || DEFAULT_NEW_CAT_COLOR() } : { backgroundColor: `${c.color || FALLBACK_CAT_COLOR()}20` }}
          >{c.icon ? `${c.icon} ` : ''}{c.name}</button>
        ))}
        {canManageCategories && (
          <button onClick={() => setShowCatModal(true)} className="ml-1 rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary">
            ⚙ Kategoriler
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-text-tertiary">Formlar yükleniyor…</div>
      ) : forms.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-default py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl">📝</div>
          <h3 className="text-lg font-bold text-text-primary">{categoryFilter ? 'Bu kategoride form yok' : 'Henüz formun yok'}</h3>
          <p className="mt-1 text-sm text-text-tertiary">{categoryFilter ? 'Başka bir kategori seç veya yeni form oluştur.' : 'İlk formunu oluşturmak için başla.'}</p>
          <a href="/DynamicAssets/Builder" className="mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600">
            + Yeni Form Oluştur
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {forms.map((f) => {
            const cat = f.categoryId ? catById(f.categoryId) : null;
            return (
            <div key={f.id} className="flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 font-bold text-text-primary">{f.title}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[f.status]?.cls}`}>{STATUS[f.status]?.label}</span>
              </div>
              {cat && (
                <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${cat.color || FALLBACK_CAT_COLOR()}20`, color: cat.color || 'var(--apya-text-secondary)' }}>
                  {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                </span>
              )}
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
                <button onClick={() => remove(f)} className="shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50">🗑</button>
                <Hint placement="left" text="Formu siler ama mevcut yanıtları SİLMEZ — yanıtlar veritabanında kalır, sahipsiz kalır ve bir daha hiçbir ekrandan erişilemez." />
              </div>
            </div>
            );
          })}
        </div>
      )}

      {showCatModal && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setShowCatModal(false)}
          onChanged={loadCategories}
        />
      )}
    </div>
  );
}

function CategoryManagerModal({ categories, onClose, onChanged }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_NEW_CAT_COLOR());
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const add = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await api.post('/api/app/form-category', { name: name.trim(), color, icon: null, order: categories.length });
      setName('');
      onChanged();
    } catch (e) {
      notify('error', e?.message || 'Kategori eklenemedi.');
    } finally {
      setBusy(false);
    }
  };

  const rename = async (cat) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/api/app/form-category/${cat.id}`, { name: editName.trim(), color: cat.color, icon: cat.icon, order: cat.order });
      setEditingId(null);
      onChanged();
    } catch (e) {
      notify('error', e?.message || 'Güncellenemedi.');
    }
  };

  const remove = async (cat) => {
    if (!window.confirm(`"${cat.name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/api/app/form-category/${cat.id}`);
      onChanged();
    } catch (e) {
      notify('error', e?.message || 'Silinemedi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Kategoriler</h2>
          <button onClick={onClose} className="rounded p-1 text-text-tertiary hover:bg-surface-sunken">✕</button>
        </div>

        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
          {categories.length === 0 && <p className="text-sm text-text-tertiary">Henüz kategori yok.</p>}
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-lg border border-subtle px-3 py-2">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.color || FALLBACK_CAT_COLOR() }} />
              {editingId === c.id ? (
                <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && rename(c)} className="min-w-0 flex-1 rounded border border-default bg-surface-base px-2 py-1 text-sm text-text-primary" />
              ) : (
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-secondary">{c.name}</span>
              )}
              {editingId === c.id ? (
                <button onClick={() => rename(c)} className="shrink-0 text-xs font-semibold text-accent hover:text-accent-600">Kaydet</button>
              ) : (
                <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="shrink-0 text-xs text-text-tertiary hover:text-text-primary">Düzenle</button>
              )}
              <button onClick={() => remove(c)} className="shrink-0 text-xs text-negative hover:opacity-80">Sil</button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-subtle pt-4">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-9 shrink-0 cursor-pointer rounded border border-default" />
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Yeni kategori adı…" className="min-w-0 flex-1 rounded-lg border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none" />
          <button onClick={add} disabled={busy || !name.trim()} className="shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50">Ekle</button>
        </div>
      </div>
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
