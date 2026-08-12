import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import './index.css';

/* BlockType enum — mirrors backend (stable ints) */
const BT = {
  ShortText: 0, LongText: 1, Select: 2, MultiSelect: 3, DatePicker: 4,
  FilePicker: 5, TableGrid: 6, RichText: 7, Number: 8, Email: 9, Phone: 10,
  TimePicker: 11, Rating: 12, Nps: 13, Signature: 14, Address: 15,
  SectionHeader: 16, Paragraph: 17, Dropdown: 18,
};
const LAYOUT_ONLY = new Set([BT.SectionHeader, BT.Paragraph]);

const parse = (j) => { try { return typeof j === 'string' ? JSON.parse(j) : (j || {}); } catch { return {}; } };

/* text-base (16px), text-sm (14px) DEĞİL: misafir kullanıcı bu formu iOS Safari'de
   dolduruyor, 16px altı input odaklanınca sayfayı otomatik büyütüyordu
   (2026-08 tasarım denetimi — herkese açık form standardı en yüksek olmalı). */
const fieldCls =
  'w-full rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-base text-text-primary placeholder:text-text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-accent-soft';

/* one answerable field */
function Field({ block, value, onChange }) {
  const s = parse(block.settings);
  const set = (v) => onChange(block.id, v);
  switch (block.type) {
    case BT.LongText:
      return <textarea rows={4} className={fieldCls} placeholder={s.placeholder || ''} value={value || ''} onChange={(e) => set(e.target.value)} />;
    case BT.Number:
      return <input type="number" min={s.min ?? undefined} max={s.max ?? undefined} className={fieldCls} placeholder={s.placeholder || ''} value={value || ''} onChange={(e) => set(e.target.value)} />;
    case BT.Email:
      return <input type="email" className={fieldCls} placeholder={s.placeholder || 'ornek@firma.com'} value={value || ''} onChange={(e) => set(e.target.value)} />;
    case BT.Phone:
      return <input type="tel" className={fieldCls} placeholder={s.placeholder || ''} value={value || ''} onChange={(e) => set(e.target.value)} />;
    case BT.DatePicker:
      return <input type="date" className={fieldCls} value={value || ''} onChange={(e) => set(e.target.value)} />;
    case BT.TimePicker:
      return <input type="time" className={fieldCls} value={value || ''} onChange={(e) => set(e.target.value)} />;
    case BT.Dropdown:
      return (
        <select className={fieldCls} value={value || ''} onChange={(e) => set(e.target.value)}>
          <option value="">Seçiniz…</option>
          {(s.options || []).map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    case BT.Select:
      return (
        <div className="flex flex-col gap-2">
          {(s.options || []).map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-text-primary">
              <input type="radio" name={block.id} checked={value === o} onChange={() => set(o)} className="h-4 w-4 text-accent" />
              {o}
            </label>
          ))}
        </div>
      );
    case BT.MultiSelect: {
      const arr = Array.isArray(value) ? value : [];
      const toggle = (o) => set(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
      return (
        <div className="flex flex-col gap-2">
          {(s.options || []).map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" checked={arr.includes(o)} onChange={() => toggle(o)} className="h-4 w-4 rounded text-accent" />
              {o}
            </label>
          ))}
        </div>
      );
    }
    case BT.Rating:
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => set(n)} className={`flex h-11 w-11 items-center justify-center text-3xl ${(value || 0) >= n ? 'text-warning' : 'text-text-tertiary'}`}>★</button>
          ))}
        </div>
      );
    case BT.Nps:
      return (
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 11 }, (_, i) => (
            <button type="button" key={i} onClick={() => set(i)} className={`h-11 w-11 rounded-lg border text-sm font-medium ${value === i ? 'border-focus bg-accent text-white' : 'border-default text-text-secondary'}`}>{i}</button>
          ))}
        </div>
      );
    case BT.Address:
      return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {['line', 'district', 'city', 'zip'].map((k, i) => (
            <input key={k} className={fieldCls} placeholder={['Adres', 'İlçe', 'İl', 'Posta kodu'][i]} value={(value || {})[k] || ''} onChange={(e) => set({ ...(value || {}), [k]: e.target.value })} />
          ))}
        </div>
      );
    case BT.FilePicker:
      return <input type="file" className="block w-full text-sm text-text-secondary" onChange={(e) => set(e.target.files?.[0]?.name || '')} />;
    default:
      return <input type="text" className={fieldCls} placeholder={s.placeholder || ''} value={value || ''} onChange={(e) => set(e.target.value)} />;
  }
}

function PublicForm({ slug }) {
  const [doc, setDoc] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('loading'); // loading | ready | error | submitting | done
  const [errorMsg, setErrorMsg] = useState('');
  const startedAt = useRef(Date.now());

  useEffect(() => {
    (async () => {
      try {
        const dto = await api.get(`/api/app/public-document/by-slug?slug=${encodeURIComponent(slug)}`);
        setDoc(dto);
        setStatus('ready');
        startedAt.current = Date.now();
      } catch (e) {
        setErrorMsg(e?.message || 'Form yüklenemedi.');
        setStatus('error');
      }
    })();
  }, [slug]);

  const fields = useMemo(
    () => (doc?.blocks || []).slice().sort((a, b) => a.order - b.order),
    [doc],
  );
  const answerable = fields.filter((b) => !LAYOUT_ONLY.has(b.type));
  const filledCount = answerable.filter((b) => {
    const v = answers[b.id];
    return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '' && v !== null;
  }).length;
  const progress = answerable.length ? Math.round((filledCount / answerable.length) * 100) : 0;

  const onChange = (id, v) => setAnswers((p) => ({ ...p, [id]: v }));

  const submit = async () => {
    // required validation
    for (const b of answerable) {
      const s = parse(b.settings);
      if (s.required) {
        const v = answers[b.id];
        const empty = Array.isArray(v) ? v.length === 0 : v === undefined || v === '' || v === null;
        if (empty) { setErrorMsg('Lütfen tüm zorunlu alanları doldurun.'); return; }
      }
    }
    setErrorMsg('');
    setStatus('submitting');
    try {
      await api.post('/api/app/response/submit', {
        documentSlug: slug,
        answers: JSON.stringify(answers),
        completionSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
      setStatus('done');
    } catch (e) {
      setErrorMsg(e?.message || 'Gönderim başarısız.');
      setStatus('ready');
    }
  };

  if (status === 'loading') return <Centered>Form yükleniyor…</Centered>;
  if (status === 'error') return <Centered><span className="text-negative-500">{errorMsg}</span></Centered>;
  if (status === 'done')
    return (
      <Centered>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive-100 text-3xl">✓</div>
          <h2 className="text-2xl font-bold text-text-primary">Teşekkürler!</h2>
          <p className="mt-2 text-text-secondary">Yanıtınız başarıyla gönderildi.</p>
        </div>
      </Centered>
    );

  const theme = parse(doc?.themeJson);

  return (
    <div className="min-h-screen bg-surface-app-bg py-8">
      {/* progress */}
      <div className="fixed inset-x-0 top-0 z-10 h-1.5 bg-neutral-200">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto max-w-2xl px-4">
        <div className="overflow-hidden rounded-2xl bg-surface-raised shadow-sm">
          <div className="border-b border-subtle p-6" style={theme.primary ? { borderTopColor: theme.primary, borderTopWidth: 4 } : undefined}>
            <h1 className="text-2xl font-bold text-text-primary">{doc.title}</h1>
            {doc.description && <p className="mt-1 text-sm text-text-secondary">{doc.description}</p>}
          </div>

          <div className="flex flex-col gap-6 p-6">
            {fields.map((b) => {
              const s = parse(b.settings);
              if (b.type === BT.SectionHeader)
                return <h2 key={b.id} className="border-b border-default pb-1 text-lg font-bold text-text-primary">{b.content}</h2>;
              if (b.type === BT.Paragraph)
                return <p key={b.id} className="text-sm text-text-secondary">{b.content}</p>;
              return (
                <div key={b.id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">
                    {b.content}
                    {s.required && <span className="ml-1 text-negative-500">*</span>}
                  </label>
                  {s.helpText && <p className="text-xs text-text-tertiary">{s.helpText}</p>}
                  <Field block={b} value={answers[b.id]} onChange={onChange} />
                </div>
              );
            })}

            {errorMsg && <p className="text-sm font-medium text-negative-500">{errorMsg}</p>}

            <button
              onClick={submit}
              disabled={status === 'submitting'}
              className="mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-50"
              style={theme.primary ? { backgroundColor: theme.primary } : undefined}
            >
              {status === 'submitting' ? 'Gönderiliyor…' : 'Gönder'}
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-text-tertiary">Apya Platform ile oluşturuldu</p>
      </div>
    </div>
  );
}

const Centered = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-surface-app-bg p-6 text-text-secondary">{children}</div>
);

const root = document.getElementById('public-form-root');
if (root) {
  const slug = root.getAttribute('data-slug');
  createRoot(root).render(<PublicForm slug={slug} />);
}
