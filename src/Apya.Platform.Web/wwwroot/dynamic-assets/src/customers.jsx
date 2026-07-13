/**
 * Customers Island — Apya Design System v2
 * -----------------------------------------------------------------------
 * Bağımlılık: React 18 + mevcut style.css (Tailwind + --apya-* tokens).
 * ABP proxy    : window.apya.platform.customers.customer.*
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
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.36, fontWeight: 600, letterSpacing: 0.2,
    }}>
      {initials}
    </div>
  );
}

/* ─── RowMenu ──────────────────────────────────────────────────────────*/
function RowMenu({ customer, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const canEdit   = abpAuth('Platform.Customers.Edit');
  const canDelete = abpAuth('Platform.Customers.Delete');

  const openEdit = () => {
    setOpen(false);
    const modal = new window.abp.ModalManager(abpAppPath() + 'Customers/EditModal');
    modal.open({ id: customer.id });
    modal.onResult(() => window.dispatchEvent(new CustomEvent('customers:refresh')));
  };

  const openStatement = () => {
    setOpen(false);
    new window.abp.ModalManager(abpAppPath() + 'Customers/StatementModal').open({ customerId: customer.id });
  };

  const handleDelete = () => {
    setOpen(false);
    onDelete(customer);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'apya-row-actions w-8 h-8 rounded-lg flex items-center justify-center text-[var(--apya-text-tertiary)]',
          'border transition-colors',
          open
            ? 'bg-[var(--apya-border-subtle)] border-[var(--apya-border-strong)]'
            : 'bg-transparent border-transparent hover:border-[var(--apya-border-default)] hover:bg-[var(--apya-border-subtle)]',
        )}
        aria-label={`${customer.name} işlemleri`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <i className="fa fa-ellipsis-h" style={{ fontSize: 14 }} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="apya-pop-in absolute right-0 z-50 mt-1 w-48 rounded-xl border border-[var(--apya-border-strong)] bg-[var(--apya-surface-elevated)] p-1"
          style={{ boxShadow: 'var(--apya-shadow-lg)' }}
        >
          {canEdit && (
            <MenuBtn icon="fa-pencil" label="Düzenle" onClick={openEdit} />
          )}
          <MenuBtn icon="fa-file-text" label="Cari Ekstre" onClick={openStatement} />
          {canDelete && (
            <>
              <div className="my-1 h-px bg-[var(--apya-border-subtle)]" />
              <MenuBtn icon="fa-trash" label="Sil" onClick={handleDelete} danger />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuBtn({ icon, label, onClick, danger = false }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
      style={{
        background: hover ? (danger ? 'var(--apya-negative-soft, rgba(248,113,113,.1))' : 'var(--apya-border-subtle)') : 'transparent',
        color: hover ? (danger ? 'var(--apya-negative-500)' : 'var(--apya-text-primary)') : danger ? 'var(--apya-negative-500)' : 'var(--apya-text-secondary)',
      }}
    >
      <i className={`fa ${icon}`} style={{ width: 14, textAlign: 'center' }} aria-hidden="true" />
      {label}
    </button>
  );
}

/* ─── Pagination ──────────────────────────────────────────────────────*/
function Pagination({ page, pageCount, pageSize, total, rangeFrom, rangeTo, onPage, onPageSize }) {
  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  const NavBtn = ({ label, onClick, disabled, active }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-w-[30px] h-[30px] px-2 rounded-md text-xs font-semibold flex items-center justify-center transition-colors',
        active && 'bg-[var(--apya-accent-500)] text-white',
        !active && !disabled && 'text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]',
        disabled && 'text-[var(--apya-text-disabled)] cursor-default opacity-40',
      )}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-[var(--apya-border-subtle)]">
      <div className="flex items-center gap-2 text-xs text-[var(--apya-text-tertiary)]">
        <span>
          <strong className="text-[var(--apya-text-secondary)] font-semibold">{fmt.int(total)}</strong>
          {' '}kayıttan {rangeFrom}–{rangeTo}
        </span>
        <span className="text-[var(--apya-border-default)]">|</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="h-7 px-2 rounded-lg border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-xs font-semibold cursor-pointer outline-none"
        >
          {[10, 25, 50].map((n) => <option key={n} value={n}>{n} / sayfa</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <NavBtn label={<i className="fa fa-chevron-left" style={{ fontSize: 12 }} />} disabled={page === 1} onClick={() => onPage(page - 1)} />
        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} className="text-[var(--apya-text-tertiary)] px-1 text-xs">…</span>
            : <NavBtn key={`p${p}`} label={p} onClick={() => onPage(p)} active={p === page} />
        )}
        <NavBtn label={<i className="fa fa-chevron-right" style={{ fontSize: 12 }} />} disabled={page === pageCount} onClick={() => onPage(page + 1)} />
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

/* ─── Ana bileşen ──────────────────────────────────────────────────────*/
function CustomersIsland() {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [query, setQuery]           = useState('');
  const [statusFilter, setStatus]   = useState('all'); // 'all' | 'Aktif' | 'Pasif'
  const [sort, setSort]             = useState({ key: 'name', dir: 'asc' });
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]           = useState(null);

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

  const onSort = (key) =>
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const openCreate = () => {
    const modal = new window.abp.ModalManager(abpAppPath() + 'Customers/CreateModal');
    modal.open();
    modal.onResult(() => { load(); flash('Cari başarıyla oluşturuldu.'); });
  };

  const handleDelete = async () => {
    try {
      await abpCustomer().delete(deleteTarget.id);
      setCustomers((l) => l.filter((c) => c.id !== deleteTarget.id));
      flash(`"${deleteTarget.name}" silindi.`);
    } catch {
      abpNotify('error', 'Silme işlemi başarısız oldu.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const SortIcon = ({ k }) => sort.key !== k ? null : (
    <i className={`fa fa-sort-${sort.dir === 'asc' ? 'asc' : 'desc'} ms-1`} style={{ fontSize: 10 }} aria-hidden="true" />
  );

  const Th = ({ label, sortKey, align = 'left', width }) => (
    <th className="px-4 h-10 bg-[var(--apya-surface-raised)]" style={{ textAlign: align, width }}>
      <button
        type="button"
        disabled={!sortKey}
        onClick={() => sortKey && onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide',
          sortKey && 'cursor-pointer',
          sort.key === sortKey ? 'text-[var(--apya-text-primary)]' : 'text-[var(--apya-text-tertiary)]',
        )}
      >
        {label}<SortIcon k={sortKey} />
      </button>
    </th>
  );

  const canCreate = abpAuth('Platform.Customers.Create');

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

      {/* Tablo kartı */}
      <div className="rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-visible"
        style={{ boxShadow: 'var(--apya-shadow-sm)' }}>

        {/* Araç çubuğu */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-3.5 py-3 border-b border-[var(--apya-border-subtle)]">
          <div className="flex gap-1">
            {[['all','Tümü'], ['Aktif','Aktif'], ['Pasif','Pasif']].map(([v, l]) => (
              <FilterTab key={v} label={l} count={counts[v] ?? counts.all} active={statusFilter === v} onClick={() => setStatus(v)} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)]" style={{ fontSize: 13 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari adı, vergi no, e-posta..."
                aria-label="Cari ara"
                className="w-full h-9 pl-8 pr-8 rounded-lg border border-[var(--apya-border-default)] bg-[var(--apya-surface-base)] text-[var(--apya-text-primary)] text-xs outline-none transition-colors focus:border-[var(--apya-accent-500)]"
                style={{ fontSize: 12 }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Temizle"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-primary)]">
                  <i className="fa fa-times" style={{ fontSize: 12 }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* İçerik */}
        {error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <i className="fa fa-exclamation-circle text-[var(--apya-negative-500)] text-3xl" />
            <p className="text-sm text-[var(--apya-text-secondary)]">{error}</p>
            <button type="button" onClick={load}
              className="h-8 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors">
              Tekrar Dene
            </button>
          </div>
        ) : loading ? (
          <div className="p-4 space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 px-2">
                <Skeleton w={34} h={34} r={8} />
                <Skeleton w="22%" />
                <Skeleton w={60} h={20} r={6} />
                <div className="flex-1" />
                <Skeleton w="12%" />
                <Skeleton w={90} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 860 }}>
              <thead>
                <tr className="border-b border-[var(--apya-border-subtle)]">
                  <Th label="Cari Adı"      sortKey="name"      />
                  <Th label="Durum"         sortKey="isActive"  width={110} />
                  <Th label="Vergi / TC No" width={130} />
                  <Th label="Vergi Dairesi" sortKey="taxOffice" width={140} />
                  <Th label="İletişim"      width={230} />
                  <Th label="Bakiye"        sortKey="balance"   align="right" width={145} />
                  <Th label=""              width={52} />
                </tr>
              </thead>
              <tbody>
                {paged.map((c) => <CustomerRow key={c.id} c={c} onSort={onSort} onDelete={setDeleteTarget} />)}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <Pagination
            page={safePage} pageCount={pageCount} pageSize={pageSize}
            total={filtered.length} rangeFrom={rangeFrom} rangeTo={rangeTo}
            onPage={setPage} onPageSize={setPageSize}
          />
        )}
      </div>

      {deleteTarget && (
        <DeleteDialog customer={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

function CustomerRow({ c, onDelete }) {
  const [hover, setHover] = useState(false);
  const balTone = c.balance > 0 ? 'var(--apya-positive-500)' : c.balance < 0 ? 'var(--apya-negative-500)' : 'var(--apya-text-tertiary)';
  const balLabel = c.balance > 0 ? 'Alacak' : c.balance < 0 ? 'Borç' : '';
  const tdBase = 'px-4 border-b border-[var(--apya-border-subtle)] transition-colors';
  const bg = hover ? 'var(--apya-border-subtle)' : 'transparent';

  return (
    <tr onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: bg }}>
      <td className={cn(tdBase, 'py-3')}>
        <div className="flex items-center gap-3">
          <Avatar name={c.name} size={34} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[var(--apya-text-primary)] truncate">{c.name}</div>
            {c.notes && <div className="text-[11px] text-[var(--apya-text-tertiary)] truncate max-w-[220px]">{c.notes}</div>}
          </div>
        </div>
      </td>
      <td className={cn(tdBase, 'py-3')}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{
            background: c.isActive ? 'rgba(52,211,153,.12)' : 'var(--apya-border-subtle)',
            color: c.isActive ? 'var(--apya-positive-500)' : 'var(--apya-text-tertiary)',
          }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'currentColor' }} />
          {c.isActive ? 'Aktif' : 'Pasif'}
        </span>
      </td>
      <td className={cn(tdBase, 'py-3 text-[12px] text-[var(--apya-text-secondary)] font-tabular')}>
        {c.taxNumber || <span className="text-[var(--apya-text-disabled)]">—</span>}
      </td>
      <td className={cn(tdBase, 'py-3 text-[12px] text-[var(--apya-text-secondary)]')}>
        {c.taxOffice || <span className="text-[var(--apya-text-disabled)]">—</span>}
      </td>
      <td className={cn(tdBase, 'py-3')}>
        <div className="flex flex-col gap-1">
          {c.phone && (
            <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-[11.5px] text-[var(--apya-text-secondary)] hover:text-[var(--apya-accent-500)]">
              <i className="fa fa-phone text-[var(--apya-text-tertiary)]" style={{ fontSize: 11, width: 12 }} />
              {c.phone}
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-[11px] text-[var(--apya-text-tertiary)] hover:text-[var(--apya-accent-500)] truncate max-w-[200px]">
              <i className="fa fa-envelope" style={{ fontSize: 11, width: 12 }} />
              {c.email}
            </a>
          )}
        </div>
      </td>
      <td className={cn(tdBase, 'py-3 text-right')}>
        <div className="text-[13px] font-bold font-tabular" style={{ color: balTone }}>{fmt.money(c.balance)}</div>
        {balLabel && <div className="text-[10px] text-[var(--apya-text-tertiary)] mt-0.5">{balLabel}</div>}
      </td>
      <td className={cn(tdBase, 'py-3 pr-3 text-right')}>
        <RowMenu customer={c} onDelete={onDelete} />
      </td>
    </tr>
  );
}

/* ─── Mount ─────────────────────────────────────────────────────────── */
const container = document.getElementById('customers-island');
if (container) {
  createRoot(container).render(<CustomersIsland />);
}
