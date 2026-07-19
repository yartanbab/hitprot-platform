/**
 * Customers Island — Apya Design System v3 (master-detail)
 * -----------------------------------------------------------------------
 * "Cariler" ekranı: SOL liste (seçili satır accent-soft + sol kenarlık) +
 * SAĞ detay paneli. <1024px'te tek sütun: liste → seçilince detay (geri
 * butonlu); breakpoint CSS-tabanlı (lg:), ResizeObserver YOK.
 * Sağ panel ek olarak: yaşlandırma barı (açık faturalardan, client-side
 * hesap) + gömülü hesap ekstresi (ICustomerLedgerAppService.GetStatementAsync).
 *
 * Bağımlılık: React 18 + mevcut style.css (Tailwind + --apya-* tokens).
 * ABP proxy    : window.apya.platform.customers.customer.*
 *                window.apya.platform.invoices.invoice.* (yaşlandırma)
 *                window.apya.platform.customerLedger.customerLedger.* (ekstre)
 * ABP modaller : window.abp.ModalManager (CreateModal / EditModal / StatementModal)
 * İkonlar      : Font Awesome 6 (LeptonX'in yüklediği FA — className="fa fa-...")
 *
 * Bu dosya Vite ile ES modülü olarak derlenir → /wwwroot/js/customers.js
 * Razor mount  : <div id="customers-island"></div>  (Customers/Index.cshtml)
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

/* ─── Yardımcılar ─────────────────────────────────────────────────────── */
const fmt = {
  money: (n) =>
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0) + ' ₺',
  int: (n) => new Intl.NumberFormat('tr-TR').format(Math.round(n || 0)),
};

const cn = (...c) => c.filter(Boolean).join(' ');

/* ─── ABP bridge (window nesnesine erişim) ───────────────────────────── */
const abpCustomer  = () => window?.apya?.platform?.customers?.customer;
const abpInvoice   = () => window?.apya?.platform?.invoices?.invoice;
const abpLedger    = () => window?.apya?.platform?.customerLedger?.customerLedger;
const abpAuth      = (p) => window?.abp?.auth?.isGranted(p);
const abpNotify    = (type, msg) => window?.abp?.notify?.[type]?.(msg);
const abpAppPath   = () => window?.abp?.appPath ?? '/';

/* ─── Skeleton ──────────────────────────────────────────────────────────*/
function Skeleton({ w = '100%', h = 14, r = 6 }) {
  return (
    <div
      aria-hidden="true"
      className="apya-skeleton"
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }}
    />
  );
}

/* ─── StatCard ─────────────────────────────────────────────────────────*/
function StatCard({ label, value, icon, tone = 'muted', loading, index = 0 }) {
  const toneClass = { success: 'text-green-500', danger: 'text-red-500', muted: 'text-[var(--apya-text-tertiary)]' }[tone] ?? '';
  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4"
        style={{ animationDelay: `${index * 50}ms` }}>
        <Skeleton w="55%" h={11} />
        <Skeleton w="45%" h={20} r={4} style={{ marginTop: 10 }} />
      </div>
    );
  }
  return (
    <div className="apya-fade-in rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4"
      style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-center gap-2 text-[var(--apya-text-tertiary)] text-xs font-medium">
        <i className={`fa ${icon}`} aria-hidden="true" />
        {label}
      </div>
      <div className={cn('mt-2 text-xl font-bold font-tabular', toneClass || 'text-[var(--apya-text-primary)]')}>
        {value}
      </div>
    </div>
  );
}

/* ─── FilterTab ────────────────────────────────────────────────────────*/
function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
        active
          ? 'bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]'
          : 'text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-secondary)]',
      )}
    >
      {label}
      <span className={cn(
        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
        active ? 'bg-[var(--apya-surface-base)] text-[var(--apya-accent-500)]' : 'bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]',
      )}>{count}</span>
    </button>
  );
}

/* ─── Avatar ───────────────────────────────────────────────────────────*/
function Avatar({ name = '', size = 34 }) {
  const palette = [
    ['#6366F1', '#818CF8'], ['#0EA5E9', '#38BDF8'],
    ['#F59E0B', '#FBBF24'], ['#10B981', '#34D399'],
    ['#EC4899', '#F472B6'], ['#8B5CF6', '#A78BFA'],
  ];
  const initials = (name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || '?').toUpperCase();
  const seed = (initials.charCodeAt(0) || 65) + (initials.charCodeAt(1) || 66);
  const [c1, c2] = palette[seed % palette.length];
  return (
    <div aria-hidden="true" style={{
      width: size, height: size, borderRadius: Math.max(8, size * 0.22), flexShrink: 0,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.36, fontWeight: 600, letterSpacing: 0.2,
    }}>
      {initials}
    </div>
  );
}

/* ─── Durum chip'i ─────────────────────────────────────────────────────*/
function StatusChip({ active }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{
        background: active ? 'rgba(52,211,153,.12)' : 'var(--apya-border-subtle)',
        color: active ? 'var(--apya-positive-500)' : 'var(--apya-text-tertiary)',
      }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'currentColor' }} />
      {active ? 'Aktif' : 'Pasif'}
    </span>
  );
}

/* ─── Kompakt sayfalama (liste paneli altı) ───────────────────────────*/
function ListPagination({ page, pageCount, pageSize, total, rangeFrom, rangeTo, onPage, onPageSize }) {
  const NavBtn = ({ label, onClick, disabled, ariaLabel }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'min-w-[30px] h-[30px] px-2 rounded-md text-xs font-semibold flex items-center justify-center transition-colors',
        !disabled && 'text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]',
        disabled && 'text-[var(--apya-text-disabled)] cursor-default opacity-40',
      )}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2.5 border-t border-[var(--apya-border-subtle)] mt-auto">
      <div className="flex items-center gap-2 text-[11px] text-[var(--apya-text-tertiary)]">
        <span>
          <strong className="text-[var(--apya-text-secondary)] font-semibold">{fmt.int(total)}</strong>
          {' '}kayıttan {rangeFrom}–{rangeTo}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          aria-label="Sayfa boyutu"
          className="h-6 px-1.5 rounded-md border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-[11px] font-semibold cursor-pointer outline-none"
        >
          {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <NavBtn ariaLabel="Önceki sayfa" label={<i className="fa fa-chevron-left" style={{ fontSize: 11 }} />} disabled={page === 1} onClick={() => onPage(page - 1)} />
        <span className="text-[11px] text-[var(--apya-text-tertiary)] px-1 font-tabular">{page}/{pageCount}</span>
        <NavBtn ariaLabel="Sonraki sayfa" label={<i className="fa fa-chevron-right" style={{ fontSize: 11 }} />} disabled={page === pageCount} onClick={() => onPage(page + 1)} />
      </div>
    </div>
  );
}

/* ─── DeleteConfirm dialog ─────────────────────────────────────────────*/
function DeleteDialog({ customer, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true);
    await onConfirm();
    setBusy(false);
  };
  return (
    <div
      className="apya-in fixed inset-0 z-[90] flex items-center justify-center p-5"
      style={{ background: 'var(--apya-surface-overlay)' }}
      onClick={onCancel}
    >
      <div
        className="apya-pop-in w-full max-w-sm rounded-2xl border border-[var(--apya-border-strong)] p-6"
        style={{ background: 'var(--apya-surface-elevated)', boxShadow: 'var(--apya-shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(248,113,113,.12)', color: 'var(--apya-negative-500)' }}>
            <i className="fa fa-trash" style={{ fontSize: 16 }} aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--apya-text-primary)]">Cari Silinecek</div>
            <div className="text-xs text-[var(--apya-text-tertiary)] mt-1">
              <strong className="text-[var(--apya-text-primary)]">{customer?.name}</strong> kalıcı olarak silinecek.
              Bu işlem geri alınamaz.
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel}
            className="h-9 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors">
            Vazgeç
          </button>
          <button type="button" onClick={confirm} disabled={busy}
            className="h-9 px-4 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50"
            style={{ background: 'var(--apya-negative-500)' }}>
            {busy ? <i className="fa fa-spinner fa-spin me-1" /> : null}
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ────────────────────────────────────────────────────────────*/
function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2800);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <div className="apya-pop-in fixed bottom-5 right-5 z-[95] flex items-center gap-2.5 px-4 py-3 rounded-xl border"
      style={{ background: 'var(--apya-surface-elevated)', borderColor: 'var(--apya-border-strong)', boxShadow: 'var(--apya-shadow-lg)' }}
      role="status">
      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(52,211,153,.15)', color: 'var(--apya-positive-500)' }}>
        <i className="fa fa-check" style={{ fontSize: 11 }} />
      </div>
      <span className="text-xs text-[var(--apya-text-primary)]">{message}</span>
    </div>
  );
}

/* ─── Liste satırı (sol panel) ─────────────────────────────────────────*/
function CustomerListItem({ c, selected, onSelect }) {
  const balTone = c.balance > 0 ? 'var(--apya-positive-500)' : c.balance < 0 ? 'var(--apya-negative-500)' : 'var(--apya-text-tertiary)';
  return (
    <button
      type="button"
      onClick={() => onSelect(c.id)}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors border-l-2',
        selected
          ? 'bg-[var(--apya-accent-soft)] border-[var(--apya-accent-500)]'
          : 'border-transparent hover:bg-[var(--apya-border-subtle)]',
      )}
    >
      <Avatar name={c.name} size={34} />
      <div className="min-w-0 flex-1">
        <div className={cn(
          'text-[13px] font-semibold truncate',
          selected ? 'text-[var(--apya-accent-500)]' : 'text-[var(--apya-text-primary)]',
        )}>{c.name}</div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--apya-text-tertiary)] truncate">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: c.isActive ? 'var(--apya-positive-500)' : 'var(--apya-text-disabled)' }} />
          {c.taxNumber || c.email || (c.isActive ? 'Aktif' : 'Pasif')}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[12px] font-bold font-tabular" style={{ color: balTone }}>{fmt.money(c.balance)}</div>
      </div>
    </button>
  );
}

/* ─── Detay meta satırı ────────────────────────────────────────────────*/
function MetaField({ icon, label, children, mono = false }) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]">
        <i className={`fa ${icon}`} style={{ fontSize: 12 }} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]">{label}</div>
        <div className={cn('text-[12.5px] text-[var(--apya-text-primary)] mt-0.5 break-words', mono && 'font-tabular')}>
          {children || <span className="text-[var(--apya-text-disabled)]">—</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Yaşlandırma barı — açık (bakiye>0) faturalardan, client-side ─────*/
const AGING_BUCKETS = [
  { key: 'b0',  label: '0-30 gün',  color: 'var(--apya-positive-500)', max: 30 },
  { key: 'b30', label: '31-60 gün', color: '#0EA5E9',                  max: 60 },
  { key: 'b60', label: '61-90 gün', color: 'var(--apya-warning-500)',  max: 90 },
  { key: 'b90', label: '90+ gün',   color: 'var(--apya-negative-500)', max: Infinity },
];

function AgingBar({ customerId }) {
  const [loading, setLoading] = useState(true);
  const [buckets, setBuckets] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const svc = abpInvoice();
    if (!svc) { setLoading(false); return; }

    svc.getList({ maxResultCount: 1000, sorting: 'dueDate asc' })
      .then((result) => {
        if (cancelled) return;
        const now = new Date();
        const b = { b0: 0, b30: 0, b60: 0, b90: 0 };
        (result.items || []).forEach((inv) => {
          if (inv.customerId !== customerId) return;
          const balance = (inv.totalAmount || 0) - (inv.paidAmount || 0);
          if (balance <= 0.005) return;
          const days = Math.floor((now - new Date(inv.dueDate)) / 86400000);
          if (days <= 30) b.b0 += balance;
          else if (days <= 60) b.b30 += balance;
          else if (days <= 90) b.b60 += balance;
          else b.b90 += balance;
        });
        setBuckets(b);
      })
      .catch(() => { if (!cancelled) setBuckets(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [customerId]);

  if (loading) {
    return (
      <div>
        <Skeleton w="35%" h={11} />
        <Skeleton w="100%" h={8} r={4} style={{ marginTop: 8 }} />
      </div>
    );
  }
  if (!buckets) return null;

  const total = buckets.b0 + buckets.b30 + buckets.b60 + buckets.b90;
  if (total <= 0.005) return null;

  return (
    <div>
      <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)] mb-1.5">Yaşlandırma</div>
      <div className="flex h-2 rounded-full overflow-hidden" style={{ background: 'var(--apya-border-subtle)' }}>
        {AGING_BUCKETS.map((s) => buckets[s.key] > 0 && (
          <div key={s.key} style={{ width: `${(buckets[s.key] / total) * 100}%`, background: s.color }}
            title={`${s.label}: ${fmt.money(buckets[s.key])}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1.5 mt-2.5">
        {AGING_BUCKETS.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-[11px] min-w-0">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[var(--apya-text-tertiary)] truncate">{s.label}</span>
            <span className="font-semibold text-[var(--apya-text-secondary)] font-tabular ms-auto">{fmt.money(buckets[s.key])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Gömülü hesap ekstresi — son 5 hareket, tam görünüm modale devreder ─*/
function EmbeddedStatement({ customerId, onViewAll }) {
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const svc = abpLedger();
    if (!svc) { setLoading(false); return; }

    svc.getStatement(customerId)
      .then((result) => { if (!cancelled) setLines((result?.lines || []).slice(-5).reverse()); })
      .catch(() => { if (!cancelled) setLines([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [customerId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]">Hesap Ekstresi</div>
        <button type="button" onClick={onViewAll}
          className="text-[11px] font-medium text-[var(--apya-accent-500)] hover:underline">
          Tümünü gör
        </button>
      </div>
      {loading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={26} r={6} />)}
        </div>
      ) : lines.length === 0 ? (
        <div className="text-[12px] text-[var(--apya-text-tertiary)] py-3 text-center rounded-xl border border-[var(--apya-border-subtle)]">
          Hareket yok
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--apya-border-subtle)] overflow-hidden overflow-x-auto">
          <table className="w-full text-[11.5px]" style={{ minWidth: 380 }}>
            <thead>
              <tr style={{ background: 'var(--apya-surface-sunken)' }}>
                <th className="text-left font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]">Tarih</th>
                <th className="text-left font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]">Açıklama</th>
                <th className="text-right font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]">Borç/Alacak</th>
                <th className="text-right font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]">Bakiye</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((ln) => (
                <tr key={ln.id} className="border-t border-[var(--apya-border-subtle)]">
                  <td className="px-2.5 py-1.5 text-[var(--apya-text-secondary)] whitespace-nowrap">
                    {new Date(ln.entryDate).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-2.5 py-1.5 text-[var(--apya-text-primary)] truncate max-w-[160px]">
                    {ln.description || '—'}
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-tabular"
                    style={{ color: ln.debit > 0 ? 'var(--apya-negative-500)' : 'var(--apya-positive-500)' }}>
                    {ln.debit > 0 ? fmt.money(ln.debit) : '−' + fmt.money(ln.credit)}
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-tabular text-[var(--apya-text-primary)]">
                    {fmt.money(ln.runningBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Sağ detay paneli ─────────────────────────────────────────────────*/
function CustomerDetail({ c, canEdit, canDelete, onBack, onEdit, onStatement, onDelete }) {
  const balTone  = c.balance > 0 ? 'var(--apya-positive-500)' : c.balance < 0 ? 'var(--apya-negative-500)' : 'var(--apya-text-tertiary)';
  const balLabel = c.balance > 0 ? 'Alacak' : c.balance < 0 ? 'Borç' : 'Bakiye yok';
  const ActionBtn = ({ icon, label, onClick, danger = false }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-8 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors',
        danger
          ? 'border-transparent text-[var(--apya-negative-500)] hover:bg-[rgba(248,113,113,.1)]'
          : 'border-[var(--apya-border-default)] text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]',
      )}
    >
      <i className={`fa ${icon}`} style={{ fontSize: 12 }} aria-hidden="true" />
      {label}
    </button>
  );

  const openNewInvoice = () => {
    window.location.href = abpAppPath() + 'Invoices?customerId=' + c.id;
  };

  return (
    <div className="apya-fade-in flex flex-col p-5 gap-5 min-w-0" key={c.id}>
      {/* Dar ekranda listeye dönüş */}
      <button type="button" onClick={onBack}
        className="lg:hidden self-start flex items-center gap-1.5 text-xs font-medium text-[var(--apya-text-secondary)] hover:text-[var(--apya-accent-500)]">
        <i className="fa fa-arrow-left" style={{ fontSize: 11 }} aria-hidden="true" />
        Listeye dön
      </button>

      {/* Başlık: avatar + ad + durum + aksiyonlar */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar name={c.name} size={52} />
          <div className="min-w-0">
            <div className="text-[17px] font-bold tracking-tight text-[var(--apya-text-primary)] truncate">{c.name}</div>
            <div className="mt-1"><StatusChip active={c.isActive} /></div>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {canEdit && <ActionBtn icon="fa-pencil" label="Düzenle" onClick={onEdit} />}
          <ActionBtn icon="fa-file-text" label="Cari Ekstre" onClick={onStatement} />
          {canDelete && <ActionBtn icon="fa-trash" label="Sil" onClick={onDelete} danger />}
        </div>
      </div>

      {/* Bakiye bloğu */}
      <div className="rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-sunken)] px-4 py-3.5 flex items-baseline justify-between flex-wrap gap-2">
        <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]">Güncel Bakiye</div>
        <div className="flex items-baseline gap-2">
          <span className="text-[22px] font-bold font-tabular" style={{ color: balTone }}>{fmt.money(c.balance)}</span>
          <span className="text-[11px] font-semibold text-[var(--apya-text-tertiary)]">{balLabel}</span>
        </div>
      </div>

      {/* Yaşlandırma */}
      <AgingBar customerId={c.id} />

      {/* Meta grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MetaField icon="fa-hashtag"  label="Vergi / TC No" mono>{c.taxNumber}</MetaField>
        <MetaField icon="fa-building" label="Vergi Dairesi">{c.taxOffice}</MetaField>
        <MetaField icon="fa-phone"    label="Telefon" mono>
          {c.phone && (
            <a href={`tel:${c.phone}`} className="hover:text-[var(--apya-accent-500)] transition-colors">{c.phone}</a>
          )}
        </MetaField>
        <MetaField icon="fa-envelope" label="E-posta">
          {c.email && (
            <a href={`mailto:${c.email}`} className="hover:text-[var(--apya-accent-500)] transition-colors break-all">{c.email}</a>
          )}
        </MetaField>
      </div>

      {/* Gömülü ekstre */}
      <EmbeddedStatement customerId={c.id} onViewAll={onStatement} />

      {/* Notlar */}
      {c.notes && (
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)] mb-1.5">Notlar</div>
          <div className="text-[12.5px] leading-relaxed text-[var(--apya-text-secondary)] whitespace-pre-wrap rounded-xl border border-[var(--apya-border-subtle)] bg-[var(--apya-surface-base)] px-3.5 py-3">
            {c.notes}
          </div>
        </div>
      )}

      {/* Alt aksiyonlar */}
      <div className="flex gap-2 pt-1 border-t border-[var(--apya-border-subtle)] mt-1">
        <button type="button"
          onClick={() => abpNotify('info', 'E-posta ile ekstre gönderimi yakında eklenecek.')}
          className="h-9 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] flex items-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors mt-3">
          <i className="fa fa-paper-plane" aria-hidden="true" />
          Ekstre Gönder
        </button>
        <button type="button" onClick={openNewInvoice}
          className="h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors hover:opacity-90 mt-3"
          style={{ background: 'var(--apya-accent-500)' }}>
          <i className="fa fa-plus" aria-hidden="true" />
          Yeni Fatura
        </button>
      </div>
    </div>
  );
}

function DetailEmpty() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]">
        <i className="fa fa-id-card text-2xl" aria-hidden="true" />
      </div>
      <div className="text-sm font-semibold text-[var(--apya-text-primary)]">Cari seçilmedi</div>
      <div className="text-xs text-[var(--apya-text-tertiary)] max-w-[220px]">
        Detaylarını görmek için soldaki listeden bir cari seçin.
      </div>
    </div>
  );
}

/* ─── Ana bileşen ──────────────────────────────────────────────────────*/
const SORT_OPTIONS = [
  { value: 'name|asc',      label: 'Ad (A→Z)' },
  { value: 'name|desc',     label: 'Ad (Z→A)' },
  { value: 'balance|desc',  label: 'Bakiye (yüksek→düşük)' },
  { value: 'balance|asc',   label: 'Bakiye (düşük→yüksek)' },
  { value: 'taxOffice|asc', label: 'Vergi dairesi (A→Z)' },
];

function CustomersIsland() {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [query, setQuery]           = useState('');
  const [statusFilter, setStatus]   = useState('all'); // 'all' | 'Aktif' | 'Pasif'
  const [sort, setSort]             = useState({ key: 'name', dir: 'asc' });
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]           = useState(null);
  const listRef = useRef(null);

  const flash = useCallback((msg) => setToast(msg), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await abpCustomer().getList({
        maxResultCount: 1000,
        skipCount: 0,
        sorting: 'name asc',
      });
      setCustomers(result.items ?? []);
    } catch (e) {
      setError('Cari listesi yüklenemedi.');
      console.error('[CustomersIsland] load error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Diğer modallardan (create/edit) yenileme sinyali
  useEffect(() => {
    const handler = () => load();
    window.addEventListener('customers:refresh', handler);
    return () => window.removeEventListener('customers:refresh', handler);
  }, [load]);

  // URL'de ?selectCustomerId=... varsa (örn. başka sayfadan geldiyse) otomatik seç
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('selectCustomerId');
    if (wanted && customers.some((c) => c.id === wanted)) {
      setSelectedId(wanted);
    }
  }, [loading, customers]);

  const counts = useMemo(() => ({
    all: customers.length,
    Aktif: customers.filter((c) => c.isActive).length,
    Pasif: customers.filter((c) => !c.isActive).length,
  }), [customers]);

  const stats = useMemo(() => {
    const alacak = customers.filter((c) => c.balance > 0).reduce((s, c) => s + c.balance, 0);
    const borc   = customers.filter((c) => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0);
    return { alacak, borc };
  }, [customers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    let rows = customers.filter((c) => {
      if (statusFilter === 'Aktif' && !c.isActive) return false;
      if (statusFilter === 'Pasif' && c.isActive) return false;
      if (!q) return true;
      return [c.name, c.taxNumber, c.taxOffice, c.email, c.phone]
        .filter(Boolean).some((v) => v.toLocaleLowerCase('tr').includes(q));
    });
    const dir = sort.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const av = a[sort.key] ?? '', bv = b[sort.key] ?? '';
      if (typeof av === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv), 'tr') * dir;
    });
    return rows;
  }, [customers, query, statusFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage  = Math.min(page, pageCount);
  const paged     = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const rangeFrom = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeTo   = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [query, statusFilter, pageSize]);

  const selected = useMemo(
    () => customers.find((c) => c.id === selectedId) ?? null,
    [customers, selectedId],
  );

  // Masaüstünde (lg+) otomatik ilk kayıt seçimi — mobilde seçim kullanıcıya
  // bırakılır (aksi halde sayfa doğrudan detay görünümüne atlar).
  useEffect(() => {
    if (loading) return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;
    if (selectedId && filtered.some((c) => c.id === selectedId)) return;
    setSelectedId(paged[0]?.id ?? null);
  }, [loading, filtered, paged, selectedId]);

  // Listede klavye gezinimi (↑/↓)
  const onListKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const idx = paged.findIndex((c) => c.id === selectedId);
    const next = e.key === 'ArrowDown'
      ? paged[Math.min(idx + 1, paged.length - 1)]
      : paged[Math.max(idx - 1, 0)];
    if (next) setSelectedId(next.id);
  };

  const openCreate = () => {
    const modal = new window.abp.ModalManager(abpAppPath() + 'Customers/CreateModal');
    modal.open();
    modal.onResult(() => { load(); flash('Cari başarıyla oluşturuldu.'); });
  };

  const openEdit = () => {
    if (!selected) return;
    const modal = new window.abp.ModalManager(abpAppPath() + 'Customers/EditModal');
    modal.open({ id: selected.id });
    modal.onResult(() => window.dispatchEvent(new CustomEvent('customers:refresh')));
  };

  const openStatement = () => {
    if (!selected) return;
    new window.abp.ModalManager(abpAppPath() + 'Customers/StatementModal').open({ customerId: selected.id });
  };

  const handleDelete = async () => {
    try {
      await abpCustomer().delete(deleteTarget.id);
      setCustomers((l) => l.filter((c) => c.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
      flash(`"${deleteTarget.name}" silindi.`);
    } catch {
      abpNotify('error', 'Silme işlemi başarısız oldu.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const canCreate = abpAuth('Platform.Customers.Create');
  const canEdit   = abpAuth('Platform.Customers.Edit');
  const canDelete = abpAuth('Platform.Customers.Delete');

  return (
    <div className="apya-fade-in px-7 py-7 max-w-[1440px] mx-auto">
      {/* Başlık */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0">Cari Yönetimi</h1>
          <p className="mt-1 text-xs text-[var(--apya-text-tertiary)] m-0">
            Müşteri ve tedarikçi cari kartlarını tek yerden yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button"
            className="h-9 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] flex items-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors"
            onClick={() => {/* İleride: Excel export */ abpNotify('info', 'Dışa aktarma yakında gelecek.');}}>
            <i className="fa fa-download" aria-hidden="true" />
            Dışa Aktar
          </button>
          {canCreate && (
            <button type="button"
              className="h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors hover:opacity-90"
              style={{ background: 'var(--apya-accent-500)' }}
              onClick={openCreate}>
              <i className="fa fa-plus" aria-hidden="true" />
              Yeni Cari
            </button>
          )}
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <StatCard loading={loading} index={0} icon="fa-id-card"   label="Toplam Cari"    value={fmt.int(counts.all)}    />
        <StatCard loading={loading} index={1} icon="fa-check-circle" label="Aktif Cari"  value={fmt.int(counts.Aktif)}  />
        <StatCard loading={loading} index={2} icon="fa-arrow-up"  label="Toplam Alacak"  value={fmt.money(stats.alacak)} tone="success" />
        <StatCard loading={loading} index={3} icon="fa-arrow-down" label="Toplam Borç"   value={fmt.money(stats.borc)}   tone="danger" />
      </div>

      {/* Master-detail kartı: sol liste + sağ detay (HANDOFF deseni) */}
      <div className="rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-hidden grid lg:grid-cols-[minmax(320px,390px)_1fr]"
        style={{ boxShadow: 'var(--apya-shadow-sm)' }}>

        {/* ── SOL: liste paneli ── */}
        <div className={cn(
          'flex-col min-w-0 border-[var(--apya-border-subtle)] lg:border-r',
          selected ? 'hidden lg:flex' : 'flex',
        )}>
          {/* Araç çubuğu */}
          <div className="px-3 pt-3 pb-2.5 border-b border-[var(--apya-border-subtle)] flex flex-col gap-2.5">
            <div className="relative">
              <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)]" style={{ fontSize: 13 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari adı, vergi no, e-posta..."
                aria-label="Cari ara"
                className="w-full h-9 pl-8 pr-8 rounded-lg border border-[var(--apya-border-default)] bg-[var(--apya-surface-base)] text-[var(--apya-text-primary)] outline-none transition-colors focus:border-[var(--apya-accent-500)]"
                style={{ fontSize: 12 }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Temizle"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-primary)]">
                  <i className="fa fa-times" style={{ fontSize: 12 }} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-1">
                {[['all','Tümü'], ['Aktif','Aktif'], ['Pasif','Pasif']].map(([v, l]) => (
                  <FilterTab key={v} label={l} count={counts[v] ?? counts.all} active={statusFilter === v} onClick={() => setStatus(v)} />
                ))}
              </div>
              <select
                value={`${sort.key}|${sort.dir}`}
                onChange={(e) => { const [key, dir] = e.target.value.split('|'); setSort({ key, dir }); }}
                aria-label="Sırala"
                className="h-7 px-1.5 rounded-lg border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-[11px] font-medium cursor-pointer outline-none max-w-[150px]"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Liste içeriği */}
          {error ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
              <i className="fa fa-exclamation-circle text-[var(--apya-negative-500)] text-3xl" />
              <p className="text-sm text-[var(--apya-text-secondary)]">{error}</p>
              <button type="button" onClick={load}
                className="h-8 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors">
                Tekrar Dene
              </button>
            </div>
          ) : loading ? (
            <div className="p-3 space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-1">
                  <Skeleton w={34} h={34} r={8} />
                  <div className="flex-1"><Skeleton w="60%" /></div>
                  <Skeleton w={70} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]">
                <i className="fa fa-inbox text-2xl" />
              </div>
              <div className="text-sm font-semibold text-[var(--apya-text-primary)]">
                {query || statusFilter !== 'all' ? 'Eşleşen cari bulunamadı' : 'Henüz cari kaydı yok'}
              </div>
              <div className="text-xs text-[var(--apya-text-tertiary)] max-w-xs">
                {query || statusFilter !== 'all'
                  ? 'Arama veya filtre kriterlerinizi değiştirip tekrar deneyin.'
                  : 'İlk cari kartınızı oluşturarak finans modülünü kullanmaya başlayın.'}
              </div>
              {(query || statusFilter !== 'all') && (
                <button type="button" onClick={() => { setQuery(''); setStatus('all'); }}
                  className="h-8 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors">
                  Filtreleri Temizle
                </button>
              )}
            </div>
          ) : (
            <div ref={listRef} role="listbox" aria-label="Cari listesi" tabIndex={0}
              onKeyDown={onListKeyDown}
              className="flex-1 divide-y divide-[var(--apya-border-subtle)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--apya-accent-500)]">
              {paged.map((c) => (
                <CustomerListItem key={c.id} c={c} selected={c.id === selectedId} onSelect={setSelectedId} />
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <ListPagination
              page={safePage} pageCount={pageCount} pageSize={pageSize}
              total={filtered.length} rangeFrom={rangeFrom} rangeTo={rangeTo}
              onPage={setPage} onPageSize={setPageSize}
            />
          )}
        </div>

        {/* ── SAĞ: detay paneli ── */}
        <div className={cn('flex-col min-w-0 bg-[var(--apya-surface-base)]', selected ? 'flex' : 'hidden lg:flex')}>
          {selected ? (
            <CustomerDetail
              c={selected}
              canEdit={canEdit}
              canDelete={canDelete}
              onBack={() => setSelectedId(null)}
              onEdit={openEdit}
              onStatement={openStatement}
              onDelete={() => setDeleteTarget(selected)}
            />
          ) : (
            <DetailEmpty />
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteDialog customer={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

/* ─── Mount ─────────────────────────────────────────────────────────── */
const container = document.getElementById('customers-island');
if (container) {
  createRoot(container).render(<CustomersIsland />);
}
