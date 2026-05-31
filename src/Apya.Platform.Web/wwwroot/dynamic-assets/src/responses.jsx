import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api/httpClient';
import './index.css';

/* Response status — mirrors backend ResponseStatus enum */
const STATUS = {
  0: { label: 'Bekliyor', cls: 'bg-amber-100 text-amber-700' },
  1: { label: 'İnceleniyor', cls: 'bg-blue-100 text-blue-700' },
  2: { label: 'İncelendi', cls: 'bg-emerald-100 text-emerald-700' },
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

/* answer value -> readable string */
function renderAnswer(val) {
  if (val == null || val === '') return <span className="text-slate-300">—</span>;
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

  const blockMap = useMemo(() => Object.fromEntries(blocks.map((b) => [b.id, b])), [blocks]);

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

  if (loading) return <div className="py-16 text-center text-slate-400">Yanıtlar yükleniyor…</div>;

  const tags = (j) => parse(j)?.tags || (Array.isArray(parse(j)) ? parse(j) : []);

  return (
    <div className="text-slate-800">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Toplam Yanıt" value={stats?.responseCount ?? 0} accent="text-indigo-600" />
        <StatCard label="Bugün" value={stats?.todayResponseCount ?? 0} />
        <StatCard label="Bekleyen" value={stats?.pendingResponseCount ?? 0} accent="text-amber-600" />
        <StatCard label="Görüntülenme" value={stats?.viewCount ?? 0} />
      </div>

      {/* filter */}
      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-600">Yanıtlar ({rows.length})</h3>
        <select value={statusFilter} onChange={(e) => onFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm">
          {STATUS_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      </div>

      {/* grid */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-slate-400">Henüz yanıt yok.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Süre</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{fmtDate(r.creationTime)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[r.status]?.cls}`}>{STATUS[r.status]?.label}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{fmtDuration(r.completionSeconds)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openDetail(r.id)} className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50">Detay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* detail drawer */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {detailLoading || !selected ? (
              <div className="py-16 text-center text-slate-400">Yükleniyor…</div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Yanıt Detayı</h2>
                  <button onClick={() => setSelected(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100">✕</button>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                  <span>{fmtDate(selected.creationTime)}</span>·<span>{fmtDuration(selected.completionSeconds)}</span>
                </div>

                {/* status */}
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">Durum</label>
                  <select value={selected.status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    {Object.entries(STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                  </select>
                </div>

                {/* answers */}
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">Cevaplar</label>
                  <div className="flex flex-col gap-3">
                    {Object.entries(parse(selected.answers)).map(([blockId, val]) => (
                      <div key={blockId} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-500">{blockMap[blockId]?.content || 'Soru'}</p>
                        <p className="mt-1 text-sm text-slate-800">{renderAnswer(val)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* comments */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">Yorumlar</label>
                  <div className="flex flex-col gap-2">
                    {(selected.comments || []).map((c) => (
                      <div key={c.id} className="rounded-xl bg-slate-50 p-2.5 text-sm">
                        <p className="text-slate-700">{c.text}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{fmtDate(c.creationTime)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Yorum ekle…" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                    <button onClick={addComment} className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Ekle</button>
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

function notify(kind, msg) {
  const abp = window.abp;
  if (abp?.notify && kind === 'success') abp.notify.success(msg);
  else if (abp?.message) abp.message[kind === 'error' ? 'error' : 'info'](msg);
  else console.log(`[${kind}] ${msg}`);
}

const root = document.getElementById('responses-root');
if (root) createRoot(root).render(<ResponsesApp formId={root.getAttribute('data-form-id')} />);
