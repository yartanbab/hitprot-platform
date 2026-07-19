import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import './index.css';

const abpAuth = (p) => window?.abp?.auth?.isGranted(p);

/* BlockType enum — mirrors backend (stable ints); only the chartable ones named here */
const BT = { Select: 2, MultiSelect: 3, Rating: 12, Nps: 13, Dropdown: 18 };
const CHARTABLE = new Set([BT.Select, BT.MultiSelect, BT.Rating, BT.Nps, BT.Dropdown]);

/* Response status — mirrors backend ResponseStatus enum */
const STATUS = {
  0: { label: 'Bekliyor', cls: 'bg-warning-100 text-warning-700' },
  1: { label: 'İnceleniyor', cls: 'bg-brand-100 text-brand-700' },
  2: { label: 'İncelendi', cls: 'bg-positive-100 text-positive-700' },
};
const STATUS_OPTIONS = [
  { v: '', label: 'Tüm durumlar' },
  { v: '0', label: 'Bekleyenler' },
  { v: '1', label: 'İncelenenler' },
  { v: '2', label: 'İncelendi' },
];

const parse = (j) => { try { return typeof j === 'string' ? JSON.parse(j) : (j || {}); } catch { return {}; } };
const fmtDate = (s) => { try { return new Date(s).toLocaleString('tr-TR'); } catch { return s; } };
const fmtDuration = (sec) => {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}sn`;
  return `${Math.floor(sec / 60)}dk ${sec % 60}sn`;
};

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-default bg-surface-raised p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || 'text-text-primary'}`}>{value}</p>
    </div>
  );
}

/* answer value -> readable string */
function renderAnswer(val) {
  if (val == null || val === '') return <span className="text-text-tertiary">—</span>;
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') return Object.values(val).filter(Boolean).join(' ');
  return String(val);
}

function ResponsesApp({ formId }) {
  const [stats, setStats] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // detail dto
  const [detailLoading, setDetailLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'table'

  const blockMap = useMemo(() => Object.fromEntries(blocks.map((b) => [b.id, b])), [blocks]);
  // Answerable blocks become spreadsheet columns (layout blocks 16/17 excluded)
  const columns = useMemo(() => blocks.filter((b) => b.type !== 16 && b.type !== 17), [blocks]);
  const chartableBlocks = useMemo(() => columns.filter((b) => CHARTABLE.has(b.type)), [columns]);

  const loadList = async (status) => {
    let url = `/api/app/response-management?DocumentId=${formId}&MaxResultCount=200&SkipCount=0`;
    if (status !== '') url += `&Status=${status}`;
    const res = await api.get(url);
    setRows(res.items || []);
  };

  useEffect(() => {
    (async () => {
      try {
        const [st, form] = await Promise.all([
          api.get(`/api/app/form/${formId}/statistics`),
          api.get(`/api/app/form/${formId}`),
        ]);
        setStats(st);
        setBlocks((form.blocks || []).slice().sort((a, b) => a.order - b.order));
        await loadList('');
      } catch (e) {
        notify('error', e?.message || 'Yanıtlar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [formId]);

  const onFilter = async (v) => {
    setStatusFilter(v);
    try { await loadList(v); } catch (e) { notify('error', e?.message); }
  };

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const dto = await api.get(`/api/app/response-management/${id}`);
      setSelected(dto);
    } catch (e) {
      notify('error', e?.message || 'Detay açılamadı.');
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshRow = (dto) => {
    setSelected(dto);
    setRows((prev) => prev.map((r) => (r.id === dto.id ? { ...r, status: dto.status, tagsJson: dto.tagsJson } : r)));
  };

  const setStatus = async (status) => {
    try {
      const dto = await api.post(`/api/app/response-management/${selected.id}/set-status`, { status: Number(status) });
      refreshRow(dto);
      notify('success', 'Durum güncellendi.');
    } catch (e) { notify('error', e?.message); }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/api/app/response-management/${selected.id}/comment`, { text: commentText.trim() });
      setCommentText('');
      await openDetail(selected.id); // reload with new comment
      notify('success', 'Yorum eklendi.');
    } catch (e) { notify('error', e?.message); }
  };

  const exportCsv = () => {
    const headers = ['Tarih', 'Durum', 'Süre (sn)', ...columns.map((c) => c.content)];
    const dataRows = rows.map((r) => {
      const ans = parse(r.answers);
      return [
        fmtDate(r.creationTime),
        STATUS[r.status]?.label || '',
        r.completionSeconds ?? '',
        ...columns.map((c) => answerToText(ans[c.id])),
      ];
    });
    const csv = [headers, ...dataRows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `yanitlar-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const excelHref = `/DynamicAssets/Responses?handler=Excel&formId=${formId}${statusFilter !== '' ? `&status=${statusFilter}` : ''}`;
  const canExport = abpAuth('Platform.DynamicAssets.Export');

  if (loading) return <div className="py-16 text-center text-text-tertiary">Yanıtlar yükleniyor…</div>;

  const tags = (j) => parse(j)?.tags || (Array.isArray(parse(j)) ? parse(j) : []);

  return (
    <div className="text-text-primary">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Toplam Yanıt" value={stats?.responseCount ?? 0} accent="text-accent" />
        <StatCard label="Bugün" value={stats?.todayResponseCount ?? 0} />
        <StatCard label="Bekleyen" value={stats?.pendingResponseCount ?? 0} accent="text-warning" />
        <StatCard label="Görüntülenme" value={stats?.viewCount ?? 0} />
      </div>

      {/* toolbar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-text-secondary">Yanıtlar ({rows.length})</h3>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-default bg-surface-raised p-0.5">
            <button onClick={() => setView('list')} className={`rounded-lg px-3 py-1 text-xs font-semibold ${view === 'list' ? 'bg-accent text-white' : 'text-text-secondary'}`}>Liste</button>
            <button onClick={() => setView('table')} className={`rounded-lg px-3 py-1 text-xs font-semibold ${view === 'table' ? 'bg-accent text-white' : 'text-text-secondary'}`}>Tablo</button>
            <button onClick={() => setView('analytics')} className={`rounded-lg px-3 py-1 text-xs font-semibold ${view === 'analytics' ? 'bg-accent text-white' : 'text-text-secondary'}`}>Analiz</button>
          </div>
          <select value={statusFilter} onChange={(e) => onFilter(e.target.value)} className="rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm">
            {STATUS_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>
          <button onClick={exportCsv} disabled={rows.length === 0} className="rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken disabled:opacity-50">⬇ CSV</button>
          {canExport && (
            <a href={excelHref} className="rounded-xl border border-default bg-surface-raised px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken">⬇ Excel</a>
          )}
        </div>
      </div>

      {/* analytics */}
      {view === 'analytics' ? (
        <div className="mt-3">
          {chartableBlocks.length === 0 ? (
            <div className="rounded-2xl border border-default bg-surface-raised py-16 text-center text-text-tertiary">
              Grafik gösterilebilecek soru yok (seçmeli veya derecelendirme tipi bir soru gerekir).
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {chartableBlocks.map((b) => <QuestionChart key={b.id} block={b} rows={rows} />)}
            </div>
          )}
          {columns.length > chartableBlocks.length && (
            <p className="mt-3 text-xs text-text-tertiary">
              {columns.length - chartableBlocks.length} soru grafik için uygun değil (metin, tarih, dosya vb. tipte).
            </p>
          )}
        </div>
      ) : (
      <div className="mt-3 overflow-x-auto rounded-2xl border border-default bg-surface-raised">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-text-tertiary">Henüz yanıt yok.</div>
        ) : view === 'list' ? (
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary">
              <tr>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Süre</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-surface-sunken">
                  <td className="px-4 py-3">{fmtDate(r.creationTime)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[r.status]?.cls}`}>{STATUS[r.status]?.label}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{fmtDuration(r.completionSeconds)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openDetail(r.id)} className="rounded-lg border border-default px-3 py-1 text-xs font-medium hover:bg-surface-sunken">Detay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken text-left text-xs font-semibold uppercase text-text-tertiary">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Tarih</th>
                {columns.map((c) => <th key={c.id} className="whitespace-nowrap px-4 py-3">{c.content}</th>)}
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {rows.map((r) => {
                const ans = parse(r.answers);
                return (
                  <tr key={r.id} className="cursor-pointer hover:bg-surface-sunken" onClick={() => openDetail(r.id)}>
                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{fmtDate(r.creationTime)}</td>
                    {columns.map((c) => <td key={c.id} className="px-4 py-3">{renderAnswer(ans[c.id])}</td>)}
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[r.status]?.cls}`}>{STATUS[r.status]?.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      )}

      {/* detail drawer */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-surface-overlay" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-lg overflow-y-auto bg-surface-raised p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {detailLoading || !selected ? (
              <div className="py-16 text-center text-text-tertiary">Yükleniyor…</div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Yanıt Detayı</h2>
                  <button onClick={() => setSelected(null)} className="rounded p-1 text-text-tertiary hover:bg-surface-sunken">✕</button>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
                  <span>{fmtDate(selected.creationTime)}</span>·<span>{fmtDuration(selected.completionSeconds)}</span>
                </div>

                {/* status */}
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-semibold uppercase text-text-tertiary">Durum</label>
                  <select value={selected.status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-default px-3 py-2 text-sm">
                    {Object.entries(STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                  </select>
                </div>

                {/* answers */}
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-semibold uppercase text-text-tertiary">Cevaplar</label>
                  <div className="flex flex-col gap-3">
                    {Object.entries(parse(selected.answers)).map(([blockId, val]) => (
                      <div key={blockId} className="rounded-xl border border-subtle bg-surface-sunken p-3">
                        <p className="text-xs font-semibold text-text-secondary">{blockMap[blockId]?.content || 'Soru'}</p>
                        <p className="mt-1 text-sm text-text-primary">{renderAnswer(val)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* comments */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-text-tertiary">Yorumlar</label>
                  <div className="flex flex-col gap-2">
                    {(selected.comments || []).map((c) => (
                      <div key={c.id} className="rounded-xl bg-surface-sunken p-2.5 text-sm">
                        <p className="text-text-primary">{c.text}</p>
                        <p className="mt-0.5 text-[11px] text-text-tertiary">{fmtDate(c.creationTime)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Yorum ekle…" className="flex-1 rounded-xl border border-default px-3 py-2 text-sm" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                    <button onClick={addComment} className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-600">Ekle</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* single question's aggregated chart, drawn with the shared Chart.js UMD build
   (already loaded site-wide for AiCenter reports — see Responses.cshtml) */
function QuestionChart({ block, rows }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return undefined;
    const { type, labels, data } = buildChartData(block, rows);
    chartRef.current = new window.Chart(canvasRef.current, {
      type,
      data: { labels, datasets: [{ label: 'Yanıt', data, backgroundColor: ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b', '#a3e635'] }] },
      options: {
        responsive: true,
        plugins: { legend: { display: type === 'pie', position: 'bottom' } },
        scales: type === 'bar' ? { y: { beginAtZero: true, ticks: { precision: 0 } } } : undefined,
      },
    });
    return () => chartRef.current?.destroy();
  }, [block, rows]);

  const answeredCount = rows.filter((r) => {
    const v = parse(r.answers)[block.id];
    return v != null && v !== '' && !(Array.isArray(v) && v.length === 0);
  }).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-1 text-sm font-bold text-slate-700">{block.content}</p>
      <p className="mb-3 text-xs text-slate-400">{answeredCount} yanıt</p>
      <canvas ref={canvasRef} height="200" />
    </div>
  );
}

function buildChartData(block, rows) {
  const settings = parse(block.settings);
  const options = settings.options || [];

  if (block.type === BT.Rating) {
    const counts = [0, 0, 0, 0, 0];
    rows.forEach((r) => {
      const v = Number(parse(r.answers)[block.id]);
      if (v >= 1 && v <= 5) counts[v - 1]++;
    });
    return { type: 'bar', labels: ['1★', '2★', '3★', '4★', '5★'], data: counts };
  }

  if (block.type === BT.Nps) {
    const counts = Array(11).fill(0);
    rows.forEach((r) => {
      const v = Number(parse(r.answers)[block.id]);
      if (v >= 0 && v <= 10) counts[v]++;
    });
    return { type: 'bar', labels: counts.map((_, i) => String(i)), data: counts };
  }

  // Select / Dropdown / MultiSelect — option label -> occurrence count
  const counts = Object.fromEntries(options.map((o) => [o, 0]));
  rows.forEach((r) => {
    const v = parse(r.answers)[block.id];
    if (Array.isArray(v)) v.forEach((o) => { if (o in counts) counts[o]++; });
    else if (v != null && v in counts) counts[v]++;
  });
  return { type: block.type === BT.MultiSelect ? 'bar' : 'pie', labels: options, data: options.map((o) => counts[o]) };
}

function answerToText(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join('; ');
  if (typeof v === 'object') return Object.values(v).filter(Boolean).join(' ');
  return String(v);
}
function csvCell(v) {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function notify(kind, msg) {
  const abp = window.abp;
  if (abp?.notify && kind === 'success') abp.notify.success(msg);
  else if (abp?.message) abp.message[kind === 'error' ? 'error' : 'info'](msg);
  else console.log(`[${kind}] ${msg}`);
}

const root = document.getElementById('responses-root');
if (root) createRoot(root).render(<ResponsesApp formId={root.getAttribute('data-form-id')} />);
