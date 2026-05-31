import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import './index.css';

/* ============================================================
 * BlockType enum — MUST mirror Apya.Platform.DynamicAssets.BlockType
 * (integer values are persisted; do not renumber)
 * ============================================================ */
const BT = {
  ShortText: 0, LongText: 1, Select: 2, MultiSelect: 3, DatePicker: 4,
  FilePicker: 5, TableGrid: 6, RichText: 7, Number: 8, Email: 9, Phone: 10,
  TimePicker: 11, Rating: 12, Nps: 13, Signature: 14, Address: 15,
  SectionHeader: 16, Paragraph: 17, Dropdown: 18,
};

const HAS_OPTIONS = new Set([BT.Select, BT.MultiSelect, BT.Dropdown]);
const LAYOUT_ONLY = new Set([BT.SectionHeader, BT.Paragraph]); // no answer input

/* Palette grouped by category */
const PALETTE = [
  {
    group: 'Metin & Sayı',
    items: [
      { type: BT.ShortText, label: 'Kısa Metin', icon: '✏️' },
      { type: BT.LongText, label: 'Uzun Metin', icon: '📝' },
      { type: BT.Number, label: 'Sayısal', icon: '🔢' },
      { type: BT.Email, label: 'E-Posta', icon: '✉️' },
      { type: BT.Phone, label: 'Telefon', icon: '📞' },
    ],
  },
  {
    group: 'Seçim',
    items: [
      { type: BT.Select, label: 'Tekli Seçim', icon: '🔘' },
      { type: BT.MultiSelect, label: 'Çoklu Seçim', icon: '☑️' },
      { type: BT.Dropdown, label: 'Açılır Liste', icon: '⬇️' },
    ],
  },
  {
    group: 'Tarih & Zaman',
    items: [
      { type: BT.DatePicker, label: 'Tarih', icon: '📅' },
      { type: BT.TimePicker, label: 'Saat', icon: '🕐' },
    ],
  },
  {
    group: 'Özel',
    items: [
      { type: BT.FilePicker, label: 'Dosya Yükleme', icon: '📎' },
      { type: BT.Rating, label: 'Derecelendirme', icon: '⭐' },
      { type: BT.Nps, label: 'NPS (0-10)', icon: '📊' },
      { type: BT.Signature, label: 'İmza', icon: '✍️' },
      { type: BT.Address, label: 'Adres', icon: '📍' },
    ],
  },
  {
    group: 'Düzen',
    items: [
      { type: BT.SectionHeader, label: 'Bölüm Başlığı', icon: '🏷️' },
      { type: BT.Paragraph, label: 'Açıklama', icon: '💬' },
    ],
  },
];

const LABELS = Object.fromEntries(
  PALETTE.flatMap((g) => g.items.map((i) => [i.type, i.label])),
);

const uid = () => Math.random().toString(36).slice(2, 10);

function defaultBlock(type) {
  const base = { id: uid(), type, content: LABELS[type] || 'Soru', settings: { required: false } };
  if (HAS_OPTIONS.has(type)) base.settings.options = ['Seçenek 1', 'Seçenek 2'];
  if (type === BT.SectionHeader) base.content = 'Bölüm Başlığı';
  if (type === BT.Paragraph) base.content = 'Açıklama metni…';
  return base;
}

/* ---------- small UI atoms (Tailwind, self-contained) ---------- */
const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  </label>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

/* ---------- preview renderer for a block (read-only) ---------- */
function BlockPreview({ block }) {
  const s = block.settings || {};
  switch (block.type) {
    case BT.LongText:
      return <textarea disabled rows={3} className={inputCls} placeholder={s.placeholder || 'Uzun yanıt…'} />;
    case BT.Number:
      return <input disabled type="number" className={inputCls} placeholder={s.placeholder || '0'} />;
    case BT.Email:
      return <input disabled type="email" className={inputCls} placeholder={s.placeholder || 'ornek@firma.com'} />;
    case BT.Phone:
      return <input disabled type="tel" className={inputCls} placeholder={s.placeholder || '+90 5xx xxx xx xx'} />;
    case BT.DatePicker:
      return <input disabled type="date" className={inputCls} />;
    case BT.TimePicker:
      return <input disabled type="time" className={inputCls} />;
    case BT.FilePicker:
      return <div className="rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400">📎 Dosya seç / sürükle</div>;
    case BT.Select:
    case BT.MultiSelect:
      return (
        <div className="flex flex-col gap-2">
          {(s.options || []).map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`inline-block h-4 w-4 border border-slate-300 ${block.type === BT.Select ? 'rounded-full' : 'rounded'}`} />
              {o}
            </label>
          ))}
        </div>
      );
    case BT.Dropdown:
      return (
        <select disabled className={inputCls}>
          {(s.options || []).map((o, i) => <option key={i}>{o}</option>)}
        </select>
      );
    case BT.Rating:
      return <div className="flex gap-1 text-2xl text-amber-400">{'★★★★★'}</div>;
    case BT.Nps:
      return (
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500">{i}</span>
          ))}
        </div>
      );
    case BT.Signature:
      return <div className="rounded-xl border-2 border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400">✍️ İmza alanı</div>;
    case BT.Address:
      return (
        <div className="grid grid-cols-2 gap-2">
          <input disabled className={inputCls} placeholder="Adres satırı" />
          <input disabled className={inputCls} placeholder="İlçe" />
          <input disabled className={inputCls} placeholder="İl" />
          <input disabled className={inputCls} placeholder="Posta kodu" />
        </div>
      );
    case BT.SectionHeader:
      return <div className="border-b border-slate-200 pb-1 text-lg font-bold text-slate-700">{block.content}</div>;
    case BT.Paragraph:
      return <p className="text-sm text-slate-500">{block.content}</p>;
    case BT.TableGrid:
      return <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-400">▦ Tablo ızgarası</div>;
    case BT.RichText:
      return <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-400">𝐁 Zengin metin</div>;
    default:
      return <input disabled className={inputCls} placeholder={s.placeholder || 'Kısa yanıt…'} />;
  }
}

/* ============================================================
 * Main builder
 * ============================================================ */
function FormBuilder() {
  const initialId = useMemo(() => new URLSearchParams(window.location.search).get('id'), []);
  const [formId, setFormId] = useState(initialId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!initialId);
  const dragIndex = useRef(null);

  /* Load existing form for editing */
  useEffect(() => {
    if (!initialId) return;
    (async () => {
      try {
        const dto = await api.get(`/api/app/form/${initialId}`);
        setTitle(dto.title || '');
        setDescription(dto.description || '');
        setBlocks(
          (dto.blocks || [])
            .sort((a, b) => a.order - b.order)
            .map((b) => ({
              id: b.id || uid(),
              type: b.type,
              content: b.content,
              settings: safeParse(b.settings),
            })),
        );
      } catch (e) {
        notify('error', e?.message || 'Form yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [initialId]);

  const selected = blocks.find((b) => b.id === selectedId) || null;

  const addBlock = (type) => {
    const b = defaultBlock(type);
    setBlocks((prev) => [...prev, b]);
    setSelectedId(b.id);
  };
  const removeBlock = (id) =>
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  const duplicateBlock = (id) =>
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i < 0) return prev;
      const copy = { ...prev[i], id: uid(), settings: { ...prev[i].settings } };
      const next = [...prev];
      next.splice(i + 1, 0, copy);
      return next;
    });
  const move = (i, dir) =>
    setBlocks((prev) => {
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const patch = (id, partial) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...partial } : b)));
  const patchSettings = (id, partial) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, settings: { ...b.settings, ...partial } } : b)));

  /* native drag & drop reorder */
  const onDrop = (i) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === i) return;
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
  };

  const buildPayloadBlocks = () =>
    blocks.map((b, idx) => ({
      type: b.type,
      order: idx + 1,
      content: b.content || LABELS[b.type] || 'Soru',
      settings: JSON.stringify(b.settings || {}),
    }));

  const save = async () => {
    if (!title.trim()) return notify('warn', 'Lütfen forma bir başlık verin.');
    setSaving(true);
    try {
      if (!formId) {
        const dto = await api.post('/api/app/form', {
          title: title.trim(),
          description: description.trim() || null,
          categoryId: null,
          themeJson: null,
          blocks: buildPayloadBlocks(),
        });
        setFormId(dto.id);
        const url = new URL(window.location.href);
        url.searchParams.set('id', dto.id);
        window.history.replaceState({}, '', url);
        notify('success', 'Form oluşturuldu.');
      } else {
        await api.put(`/api/app/form/${formId}`, {
          title: title.trim(),
          description: description.trim() || null,
          categoryId: null,
          themeJson: null,
          blocks: [],
        });
        await api.put(`/api/app/form/${formId}/blocks`, { blocks: buildPayloadBlocks() });
        notify('success', 'Form kaydedildi.');
      }
    } catch (e) {
      notify('error', e?.message || 'Kaydetme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-slate-400">Form yükleniyor…</div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-800">
      {/* ---------- LEFT: palette ---------- */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500">Soru Bileşenleri</h3>
        <div className="flex flex-col gap-4">
          {PALETTE.map((g) => (
            <div key={g.group}>
              <p className="mb-1.5 text-[11px] font-semibold uppercase text-slate-400">{g.group}</p>
              <div className="flex flex-col gap-1.5">
                {g.items.map((it) => (
                  <button
                    key={it.type}
                    onClick={() => addBlock(it.type)}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <span>{it.icon}</span>
                    {it.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ---------- CENTER: canvas ---------- */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">{blocks.length} alan</span>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor…' : (formId ? 'Kaydet' : 'Oluştur')}
          </button>
        </div>

        <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form başlığı…"
            className="w-full border-none p-0 text-3xl font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-0"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Form açıklaması (opsiyonel)…"
            className="mt-2 w-full border-none p-0 text-sm text-slate-500 placeholder-slate-300 focus:outline-none focus:ring-0"
          />

          {blocks.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400">
              Soldan bir bileşen ekleyin
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              {blocks.map((b, i) => {
                const isSel = b.id === selectedId;
                return (
                  <div
                    key={b.id}
                    draggable
                    onDragStart={() => (dragIndex.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(i)}
                    onClick={() => setSelectedId(b.id)}
                    className={`group relative cursor-pointer rounded-xl border p-4 transition ${isSel ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                        {LABELS[b.type] || 'Alan'}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); move(i, 'up'); }} className="rounded p-1 text-slate-400 hover:bg-slate-100" title="Yukarı">▲</button>
                        <button onClick={(e) => { e.stopPropagation(); move(i, 'down'); }} className="rounded p-1 text-slate-400 hover:bg-slate-100" title="Aşağı">▼</button>
                        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(b.id); }} className="rounded p-1 text-slate-400 hover:bg-slate-100" title="Kopyala">⧉</button>
                        <button onClick={(e) => { e.stopPropagation(); removeBlock(b.id); }} className="rounded p-1 text-red-400 hover:bg-red-50" title="Sil">🗑</button>
                      </div>
                    </div>
                    {!LAYOUT_ONLY.has(b.type) && (
                      <input
                        value={b.content}
                        onChange={(e) => patch(b.id, { content: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Soru metni…"
                        className="mb-3 w-full border-none p-0 text-base font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0"
                      />
                    )}
                    <BlockPreview block={b} />
                    {b.settings?.required && <span className="mt-2 inline-block text-xs font-medium text-rose-500">* Zorunlu</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ---------- RIGHT: properties ---------- */}
      <aside className="w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500">Alan Özellikleri</h3>
        {!selected ? (
          <p className="text-sm text-slate-400">Düzenlemek için bir alan seçin.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <Field label={LAYOUT_ONLY.has(selected.type) ? 'İçerik' : 'Soru / Etiket'}>
              <input className={inputCls} value={selected.content} onChange={(e) => patch(selected.id, { content: e.target.value })} />
            </Field>

            {!LAYOUT_ONLY.has(selected.type) && (
              <>
                <Field label="Placeholder">
                  <input className={inputCls} value={selected.settings.placeholder || ''} onChange={(e) => patchSettings(selected.id, { placeholder: e.target.value })} />
                </Field>
                <Field label="Yardım Metni">
                  <input className={inputCls} value={selected.settings.helpText || ''} onChange={(e) => patchSettings(selected.id, { helpText: e.target.value })} />
                </Field>
                <Toggle label="Zorunlu alan" checked={!!selected.settings.required} onChange={(v) => patchSettings(selected.id, { required: v })} />
              </>
            )}

            {HAS_OPTIONS.has(selected.type) && (
              <Field label="Seçenekler">
                <div className="flex flex-col gap-2">
                  {(selected.settings.options || []).map((opt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        className={inputCls}
                        value={opt}
                        onChange={(e) => {
                          const options = [...selected.settings.options];
                          options[i] = e.target.value;
                          patchSettings(selected.id, { options });
                        }}
                      />
                      <button
                        className="rounded p-1.5 text-red-400 hover:bg-red-50"
                        onClick={() => patchSettings(selected.id, { options: selected.settings.options.filter((_, k) => k !== i) })}
                        title="Sil"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    className="rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                    onClick={() => patchSettings(selected.id, { options: [...(selected.settings.options || []), `Seçenek ${(selected.settings.options || []).length + 1}`] })}
                  >+ Seçenek ekle</button>
                </div>
              </Field>
            )}

            {(selected.type === BT.Number || selected.type === BT.Rating) && (
              <div className="grid grid-cols-2 gap-2">
                <Field label="Min"><input type="number" className={inputCls} value={selected.settings.min ?? ''} onChange={(e) => patchSettings(selected.id, { min: e.target.value === '' ? null : Number(e.target.value) })} /></Field>
                <Field label="Max"><input type="number" className={inputCls} value={selected.settings.max ?? ''} onChange={(e) => patchSettings(selected.id, { max: e.target.value === '' ? null : Number(e.target.value) })} /></Field>
              </div>
            )}

            <button onClick={() => removeBlock(selected.id)} className="mt-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
              Alanı sil
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ---------- helpers ---------- */
function safeParse(json) {
  if (!json) return { required: false };
  try { return typeof json === 'string' ? JSON.parse(json) : json; } catch { return { required: false }; }
}
function notify(kind, msg) {
  const abp = window.abp;
  if (abp?.notify && (kind === 'success' || kind === 'info')) abp.notify[kind === 'success' ? 'success' : 'info'](msg);
  else if (abp?.message) abp.message[kind === 'error' ? 'error' : kind === 'warn' ? 'warn' : 'info'](msg);
  else console.log(`[${kind}] ${msg}`);
}

const root = document.getElementById('dynamic-assets-app-root');
if (root) createRoot(root).render(<FormBuilder />);
