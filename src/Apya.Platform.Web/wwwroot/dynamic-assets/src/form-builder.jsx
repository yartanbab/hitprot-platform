import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import { Hint } from './components/ui/Hint';
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

/* Type catalog grouped for the type dropdown */
const TYPE_GROUPS = [
  { group: 'Metin & Sayı', items: [
    { type: BT.ShortText, label: 'Kısa Metin', icon: '✏️' },
    { type: BT.LongText, label: 'Uzun Metin', icon: '📝' },
    { type: BT.Number, label: 'Sayısal', icon: '🔢' },
    { type: BT.Email, label: 'E-Posta', icon: '✉️' },
    { type: BT.Phone, label: 'Telefon', icon: '📞' },
  ]},
  { group: 'Seçim', items: [
    { type: BT.Select, label: 'Tekli Seçim', icon: '🔘' },
    { type: BT.MultiSelect, label: 'Çoklu Seçim', icon: '☑️' },
    { type: BT.Dropdown, label: 'Açılır Liste', icon: '⬇️' },
  ]},
  { group: 'Tarih & Zaman', items: [
    { type: BT.DatePicker, label: 'Tarih', icon: '📅' },
    { type: BT.TimePicker, label: 'Saat', icon: '🕐' },
  ]},
  { group: 'Özel', items: [
    { type: BT.FilePicker, label: 'Dosya Yükleme', icon: '📎' },
    { type: BT.Rating, label: 'Derecelendirme', icon: '⭐' },
    { type: BT.Nps, label: 'NPS (0-10)', icon: '📊' },
    { type: BT.Signature, label: 'İmza', icon: '✍️' },
    { type: BT.Address, label: 'Adres', icon: '📍' },
  ]},
  { group: 'Düzen', items: [
    { type: BT.SectionHeader, label: 'Bölüm Başlığı', icon: '🏷️' },
    { type: BT.Paragraph, label: 'Açıklama', icon: '💬' },
  ]},
];
const LABELS = Object.fromEntries(TYPE_GROUPS.flatMap((g) => g.items.map((i) => [i.type, i.label])));

const uid = () => Math.random().toString(36).slice(2, 10);

function defaultBlock(type) {
  const base = { id: uid(), type, content: LABELS[type] || 'Soru', settings: { required: false } };
  if (HAS_OPTIONS.has(type)) base.settings.options = ['Seçenek 1', 'Seçenek 2'];
  if (type === BT.SectionHeader) base.content = 'Bölüm Başlığı';
  if (type === BT.Paragraph) base.content = 'Açıklama metni…';
  return base;
}

const inputCls =
  'w-full rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft';

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <span className="text-sm font-medium text-text-secondary">{label}</span>
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-neutral-200'}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  </label>
);

/* type dropdown */
function TypeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(Number(e.target.value))}
      className="shrink-0 rounded-xl border border-default bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary focus:border-focus focus:outline-none"
    >
      {TYPE_GROUPS.map((g) => (
        <optgroup key={g.group} label={g.group}>
          {g.items.map((it) => <option key={it.type} value={it.type}>{it.icon} {it.label}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

/* read-only preview of how the field looks to a respondent */
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
      return <div className="rounded-xl border-2 border-dashed border-default px-3 py-6 text-center text-sm text-text-tertiary">📎 Dosya seç / sürükle</div>;
    case BT.Dropdown:
      return <select disabled className={inputCls}>{(s.options || []).map((o, i) => <option key={i}>{o}</option>)}</select>;
    case BT.Rating:
      return <div className="flex gap-1 text-2xl text-warning">{'★★★★★'}</div>;
    case BT.Nps:
      return (
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 11 }, (_, i) => <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-default text-xs text-text-secondary">{i}</span>)}
        </div>
      );
    case BT.Signature:
      return <div className="rounded-xl border-2 border-dashed border-default px-3 py-8 text-center text-sm text-text-tertiary">✍️ İmza alanı</div>;
    case BT.Address:
      return (
        <div className="grid grid-cols-2 gap-2">
          {['Adres satırı', 'İlçe', 'İl', 'Posta kodu'].map((p) => <input key={p} disabled className={inputCls} placeholder={p} />)}
        </div>
      );
    case BT.TableGrid:
      return <div className="rounded-xl border border-default p-3 text-sm text-text-tertiary">▦ Tablo ızgarası</div>;
    case BT.RichText:
      return <div className="rounded-xl border border-default p-3 text-sm text-text-tertiary">𝐁 Zengin metin</div>;
    default:
      return <input disabled className={inputCls} placeholder={s.placeholder || 'Kısa yanıt…'} />;
  }
}

/* ============================================================
 * Question card — all editing happens inline (Google Forms style)
 * ============================================================ */
function QuestionCard({ block, index, selected, onSelect, onPatch, onPatchSettings, onChangeType, onDuplicate, onRemove, onAddAfter, onMove, dragRef }) {
  const s = block.settings || {};
  const isLayout = LAYOUT_ONLY.has(block.type);

  return (
    <div
      draggable
      onDragStart={() => (dragRef.current = index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onMove(index)}
      onClick={() => onSelect(block.id)}
      className={`group relative rounded-2xl border bg-surface-raised p-5 transition ${selected ? 'border-focus shadow-md ring-1 ring-accent-soft' : 'border-default hover:border-strong'}`}
    >
      {/* left accent when selected (Google Forms) */}
      {selected && <span className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-accent" />}

      {/* drag handle */}
      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 cursor-grab text-text-tertiary transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} title="Sürükle">⠿</div>

      {/* header: question text + type */}
      <div className="flex items-start gap-3">
        {isLayout ? (
          <input
            value={block.content}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onPatch(block.id, { content: e.target.value })}
            placeholder={block.type === BT.SectionHeader ? 'Bölüm başlığı' : 'Açıklama metni'}
            className={`flex-1 border-none bg-transparent p-0 focus:outline-none focus:ring-0 ${block.type === BT.SectionHeader ? 'text-xl font-bold text-text-primary' : 'text-sm text-text-secondary'}`}
          />
        ) : (
          <input
            value={block.content}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onPatch(block.id, { content: e.target.value })}
            placeholder="Soru metni…"
            className="flex-1 border-b border-transparent bg-transparent p-0 pb-1 text-base font-semibold text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-0"
          />
        )}
        {selected && <TypeSelect value={block.type} onChange={(t) => onChangeType(block.id, t)} />}
        {!selected && <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">{LABELS[block.type]}</span>}
      </div>

      {/* options editor (selected, choice types) */}
      {selected && HAS_OPTIONS.has(block.type) && (
        <div className="mt-4 flex flex-col gap-2">
          {(s.options || []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-text-tertiary">{block.type === BT.MultiSelect ? '☐' : '○'}</span>
              <input
                className="flex-1 border-b border-subtle bg-transparent px-1 py-1 text-sm focus:border-focus focus:outline-none"
                value={opt}
                onChange={(e) => {
                  const options = [...s.options];
                  options[i] = e.target.value;
                  onPatchSettings(block.id, { options });
                }}
              />
              <button className="rounded p-1 text-text-tertiary hover:text-negative-500" onClick={() => onPatchSettings(block.id, { options: s.options.filter((_, k) => k !== i) })}>✕</button>
            </div>
          ))}
          <button
            className="self-start text-sm font-medium text-accent hover:text-accent-600"
            onClick={(e) => { e.stopPropagation(); onPatchSettings(block.id, { options: [...(s.options || []), `Seçenek ${(s.options || []).length + 1}`] }); }}
          >+ Seçenek ekle</button>
        </div>
      )}

      {/* preview for non-choice, non-layout */}
      {!isLayout && !HAS_OPTIONS.has(block.type) && (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}><BlockPreview block={block} /></div>
      )}

      {/* inline properties (selected, answerable) */}
      {selected && !isLayout && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-subtle pt-4 sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Placeholder</label>
            <input className={inputCls} value={s.placeholder || ''} onChange={(e) => onPatchSettings(block.id, { placeholder: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Yardım Metni</label>
            <input className={inputCls} value={s.helpText || ''} onChange={(e) => onPatchSettings(block.id, { helpText: e.target.value })} />
          </div>
          {(block.type === BT.Number || block.type === BT.Rating) && (
            <>
              <div><label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Min</label><input type="number" className={inputCls} value={s.min ?? ''} onChange={(e) => onPatchSettings(block.id, { min: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div><label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Max</label><input type="number" className={inputCls} value={s.max ?? ''} onChange={(e) => onPatchSettings(block.id, { max: e.target.value === '' ? null : Number(e.target.value) })} /></div>
            </>
          )}
        </div>
      )}

      {/* action bar (selected) */}
      {selected && (
        <div className="mt-4 flex items-center justify-end gap-1 border-t border-subtle pt-3" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onMove(index - 1, index)} className="rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken" title="Yukarı">▲</button>
          <button onClick={() => onMove(index + 1, index)} className="rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken" title="Aşağı">▼</button>
          <button onClick={() => onDuplicate(block.id)} className="rounded-lg p-2 text-text-tertiary hover:bg-surface-sunken" title="Kopyala">⧉</button>
          <button onClick={() => onRemove(block.id)} className="rounded-lg p-2 text-negative-500 hover:bg-negative-50" title="Sil">🗑</button>
          <div className="mx-1 h-6 w-px bg-border-default" />
          {!isLayout && <Toggle label="Zorunlu" checked={!!s.required} onChange={(v) => onPatchSettings(block.id, { required: v })} />}
          <div className="mx-1 h-6 w-px bg-border-default" />
          <button onClick={() => onAddAfter(block.id)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600">+ Soru</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Main builder — single centered column
 * ============================================================ */
function FormBuilder() {
  const initialId = useMemo(() => new URLSearchParams(window.location.search).get('id'), []);
  const [formId, setFormId] = useState(initialId);
  const [slug, setSlug] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!initialId);
  const dragIndex = useRef(null);

  useEffect(() => {
    api.get('/api/app/form-category?MaxResultCount=100').then((res) => setCategories(res.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialId) return;
    (async () => {
      try {
        const dto = await api.get(`/api/app/form/${initialId}`);
        setTitle(dto.title || '');
        setSlug(dto.slug || '');
        setDescription(dto.description || '');
        setCategoryId(dto.categoryId || null);
        setBlocks((dto.blocks || []).slice().sort((a, b) => a.order - b.order).map((b) => ({
          id: b.id || uid(), type: b.type, content: b.content, settings: safeParse(b.settings),
        })));
      } catch (e) {
        notify('error', e?.message || 'Form yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [initialId]);

  const addBlock = (type = BT.ShortText) => {
    const b = defaultBlock(type);
    setBlocks((prev) => [...prev, b]);
    setSelectedId(b.id);
  };
  const addAfter = (id) => {
    const b = defaultBlock(BT.ShortText);
    setBlocks((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const next = [...prev];
      next.splice(i + 1, 0, b);
      return next;
    });
    setSelectedId(b.id);
  };
  const removeBlock = (id) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const duplicateBlock = (id) => setBlocks((prev) => {
    const i = prev.findIndex((b) => b.id === id);
    if (i < 0) return prev;
    const copy = { ...prev[i], id: uid(), settings: { ...prev[i].settings } };
    const next = [...prev];
    next.splice(i + 1, 0, copy);
    return next;
  });
  const patch = (id, partial) => setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...partial } : b)));
  const patchSettings = (id, partial) => setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, settings: { ...b.settings, ...partial } } : b)));
  const changeType = (id, newType) => setBlocks((prev) => prev.map((b) => {
    if (b.id !== id) return b;
    const settings = { ...b.settings };
    if (HAS_OPTIONS.has(newType) && !settings.options) settings.options = ['Seçenek 1', 'Seçenek 2'];
    return { ...b, type: newType, settings };
  }));
  // move element from `from` to `to` (drag) OR swap when called as (target, current)
  const moveTo = (to, from) => setBlocks((prev) => {
    const src = from == null ? dragIndex.current : from;
    dragIndex.current = null;
    if (src == null || to < 0 || to >= prev.length || src === to) return prev;
    const next = [...prev];
    const [m] = next.splice(src, 1);
    next.splice(to, 0, m);
    return next;
  });

  const buildPayloadBlocks = () => blocks.map((b, idx) => ({
    type: b.type, order: idx + 1, content: b.content || LABELS[b.type] || 'Soru', settings: JSON.stringify(b.settings || {}),
  }));

  const save = async () => {
    if (!title.trim()) return notify('warn', 'Lütfen forma bir başlık verin.');
    setSaving(true);
    try {
      if (!formId) {
        const dto = await api.post('/api/app/form', { title: title.trim(), description: description.trim() || null, categoryId, themeJson: null, blocks: buildPayloadBlocks() });
        setFormId(dto.id);
        setSlug(dto.slug || '');
        const url = new URL(window.location.href);
        url.searchParams.set('id', dto.id);
        window.history.replaceState({}, '', url);
        notify('success', 'Form oluşturuldu.');
      } else {
        await api.put(`/api/app/form/${formId}`, { title: title.trim(), description: description.trim() || null, categoryId, themeJson: null, blocks: [] });
        await api.put(`/api/app/form/${formId}/blocks`, { blocks: buildPayloadBlocks() });
        notify('success', 'Form kaydedildi.');
      }
    } catch (e) {
      notify('error', e?.message || 'Kaydetme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center text-text-tertiary">Form yükleniyor…</div>;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-surface-sunken pb-24">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-default bg-surface-raised">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/DynamicAssets" className="text-sm font-semibold text-text-secondary hover:text-text-primary">← Formlar</a>
            <span className="text-xs font-semibold text-text-tertiary">{blocks.length} alan</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className="rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken disabled:opacity-50">
              {saving ? 'Kaydediliyor…' : (formId ? 'Kaydet' : 'Oluştur')}
            </button>
            {formId && <a href={`/DynamicAssets/Responses?formId=${formId}`} className="rounded-xl border border-default bg-surface-raised px-4 py-2 text-sm font-bold text-text-primary shadow-sm hover:bg-surface-sunken">Yanıtlar</a>}
            {formId && <button onClick={() => setShowPublish(true)} className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-600">Yayınla</button>}
          </div>
        </div>
      </div>

      {/* center column */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* form header */}
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-default bg-surface-raised p-6">
          <span className="absolute inset-x-0 top-0 h-1.5 bg-accent" />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Form başlığı…" className="w-full border-none bg-transparent p-0 text-3xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Form açıklaması (opsiyonel)…" className="mt-2 w-full border-none bg-transparent p-0 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:ring-0" />
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="mt-3 rounded-lg border border-default bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text-secondary focus:border-accent focus:outline-none"
          >
            <option value="">Kategorisiz</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>)}
          </select>
        </div>

        {/* questions */}
        <div className="flex flex-col gap-3">
          {blocks.map((b, i) => (
            <QuestionCard
              key={b.id}
              block={b}
              index={i}
              selected={b.id === selectedId}
              onSelect={setSelectedId}
              onPatch={patch}
              onPatchSettings={patchSettings}
              onChangeType={changeType}
              onDuplicate={duplicateBlock}
              onRemove={removeBlock}
              onAddAfter={addAfter}
              onMove={moveTo}
              dragRef={dragIndex}
            />
          ))}
        </div>

        {/* add question */}
        <button onClick={() => addBlock(BT.ShortText)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default py-4 text-sm font-bold text-text-secondary transition hover:border-focus hover:text-accent">
          + Soru Ekle
        </button>

        {blocks.length === 0 && (
          <p className="mt-3 text-center text-sm text-text-tertiary">Başlamak için bir soru ekleyin.</p>
        )}
      </div>

      {showPublish && <PublishModal formId={formId} slug={slug} onClose={() => setShowPublish(false)} />}
    </div>
  );
}

/* ============================================================
 * Publish modal
 * ============================================================ */
function PublishModal({ formId, slug, onClose }) {
  const [slugVal, setSlugVal] = useState(slug || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState(null);

  const doPublish = async () => {
    setPublishing(true);
    try {
      const dto = await api.post(`/api/app/form/${formId}/publish`, {
        slug: slugVal?.trim() || null,
        publishSettingsJson: JSON.stringify({ startDate: startDate || null, endDate: endDate || null, kvkk, captcha }),
      });
      setPublishedSlug(dto.slug || slugVal);
      notify('success', 'Form yayınlandı.');
    } catch (e) {
      notify('error', e?.message || 'Yayınlama başarısız.');
    } finally {
      setPublishing(false);
    }
  };

  const publicUrl = publishedSlug ? `${window.location.origin}/f/${publishedSlug}` : null;
  const copyLink = () => { if (publicUrl) navigator.clipboard?.writeText(publicUrl); notify('success', 'Bağlantı kopyalandı.'); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Formu Yayınla</h2>
          <button onClick={onClose} className="rounded p-1 text-text-tertiary hover:bg-surface-sunken">✕</button>
        </div>
        {!publicUrl ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Bağlantı adresi (slug)</label>
              <input className={inputCls} value={slugVal} onChange={(e) => setSlugVal(e.target.value)} placeholder="musteri-memnuniyet" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Başlangıç</label><input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div><label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Bitiş</label><input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            </div>
            <Toggle label="KVKK onayı iste" checked={kvkk} onChange={setKvkk} />
            <Toggle label="Bot koruması" checked={captcha} onChange={setCaptcha} />
            <div className="-mt-2 flex items-start gap-1 text-[11px] text-text-tertiary">
              <Hint text="Başlangıç/Bitiş tarihi form penceresini sınırlar (dışında form kapalı). KVKK onayı açıkken genel formda zorunlu onay kutusu çıkar ve rıza kaydı tutulur. Bot koruması honeypot + minimum doldurma süresiyle otomatik gönderimleri eler (üçüncü taraf servis kullanılmaz)." />
              <span>Bu ayarlar sunucu tarafında uygulanır</span>
            </div>
            <button onClick={doPublish} disabled={publishing} className="mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50">
              {publishing ? 'Yayınlanıyor…' : 'Yayınla'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-positive-50 p-3 text-sm text-positive-700">✓ Form yayında! Aşağıdaki bağlantıyı paylaşabilirsiniz.</div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase text-text-tertiary">Yayın bağlantısı</label>
              <div className="flex items-center gap-2">
                <input readOnly className={inputCls} value={publicUrl} onClick={(e) => e.target.select()} />
                <button onClick={copyLink} className="shrink-0 rounded-xl border border-default px-3 py-2 text-sm font-medium hover:bg-surface-sunken">Kopyala</button>
              </div>
            </div>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-600">Formu yeni sekmede aç</a>
          </div>
        )}
      </div>
    </div>
  );
}

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
