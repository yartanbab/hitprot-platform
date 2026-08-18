import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import {
  abpNotify, createMatch, fmtDate, fmtMoney, getBoard, getCandidates, getMatches, removeMatch,
} from './api';

/**
 * Harcama ↔ belge eşleştirme tezgâhı.
 *
 * Solda belgesiz harcamalar, ortada seçilen harcamanın skorlanmış adayları,
 * sağda hiçbir harcamaya bağlanmamış belgeler.
 *
 * Skor bir ÖNERİDİR: 100 puanlık aday bile "Bağla" düğmesine basılmadan
 * bağlanmaz. Otomatik bağlama bilinçli olarak yok.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

const DUPLICATE_LABEL = {
  1: 'Aynı dosya başka bir belgede de var',
  2: 'Bu harcamaya zaten belge bağlı',
  3: 'Aynı tutar/tarih/tedarikçi başka belgede',
};

function ScoreBar({ label, value, max }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <span style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)', width: 62 }}>{label}</span>
      <div className="apya-doc-progress" style={{ flex: 1, height: 4 }}>
        <div style={{ width: `${(value / max) * 100}%`, background: 'var(--apya-accent-500)' }} />
      </div>
      <span className="apya-numeric" style={{ fontSize: 10.5, width: 26, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export function MatchingRoot() {
  const projectId = new URLSearchParams(window.location.search).get('projectId');

  const [board, setBoard] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [b, m] = await Promise.all([getBoard(projectId), getMatches(projectId)]);
      setBoard(b);
      setMatches(m ?? []);
    } catch (e) {
      abpNotify('error', 'Eşleştirme tezgâhı yüklenemedi.');
      console.error('[Matching] load', e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const selectExpense = async (expense) => {
    setSelected(expense);
    setCandidates([]);
    try {
      setCandidates(await getCandidates(expense.id) ?? []);
    } catch (e) {
      console.error('[Matching] candidates', e);
    }
  };

  const handleMatch = async (documentFileId) => {
    if (!selected) return;

    const annexNumber = window.prompt('EK numarası (boş bırakılabilir):') || null;

    setBusy(true);
    try {
      await createMatch({ documentFileId, expenseId: selected.id, annexNumber });
      setSelected(null);
      setCandidates([]);
      await load();
    } catch (e) {
      abpNotify('error', 'Bağlama başarısız oldu.');
      console.error('[Matching] createMatch', e);
    } finally {
      setBusy(false);
    }
  };

  if (!projectId) {
    return (
      <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
        <EmptyState icon={<i className="fa fa-link" />} title="Proje bağlamı gerekiyor"
          description="Bu sayfa bir proje bağlamından açılır (?projectId=...)." />
      </div>
    );
  }

  if (loading) return <div className="p-4"><SkeletonList rows={8} /></div>;
  if (!board) return null;

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Harcama ↔ belge eşleştirme</h1>
          <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
            {board.expenses.length} belgesiz harcama · toplam{' '}
            <strong style={{ color: 'var(--apya-negative-500)' }}>{fmtMoney(board.undocumentedTotal)}</strong>
          </p>
        </div>
        <a href={`${window.abp.appPath}Documents/Timeline?projectId=${projectId}`} className="apya-doc-linkbtn">
          Zaman çizelgesine dön
        </a>
      </div>

      <div className="apya-doc-matchboard">
        {/* Sol: belgesiz harcamalar */}
        <div className="apya-doc-check-card">
          <div className="apya-md-overline">Belgesiz harcamalar</div>
          {board.expenses.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--apya-positive-500)' }}>
              <i className="fa fa-circle-check" /> Tüm harcamalar belgeli.
            </div>
          ) : board.expenses.map((expense) => (
            <button
              key={expense.id}
              type="button"
              className={cn('apya-md-item', selected?.id === expense.id && 'selected')}
              style={{ borderRadius: 8, height: 'auto', paddingTop: 7, paddingBottom: 7 }}
              onClick={() => selectExpense(expense)}
            >
              <span style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                <span className="d-block text-truncate" style={{ fontSize: 12.5, fontWeight: 500 }}>
                  {expense.title}
                </span>
                <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
                  {fmtDate(expense.expenseDate)}
                  {expense.supplierName && ` · ${expense.supplierName}`}
                </span>
              </span>
              <span className="apya-numeric" style={{ fontSize: 11.5 }}>
                {fmtMoney(expense.amount, expense.currency)}
              </span>
            </button>
          ))}
        </div>

        {/* Orta: adaylar */}
        <div className="apya-doc-check-card">
          <div className="apya-md-overline">
            {selected ? `Aday belgeler · ${selected.title}` : 'Aday belgeler'}
          </div>

          {!selected ? (
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
              Soldan bir harcama seçin; sistem tutar, tarih ve tedarikçi yakınlığına göre aday sıralar.
            </div>
          ) : candidates.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
              Eşik üstünde aday yok. Sağdaki listeden elle bağlayabilirsiniz.
            </div>
          ) : candidates.map((c) => (
            <div key={c.documentFileId} className="apya-doc-candidate">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <div style={{ minWidth: 0 }}>
                  <div className="text-truncate" style={{ fontSize: 12.5, fontWeight: 500 }}>{c.displayName}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
                    {fmtMoney(c.amount)} · {fmtDate(c.documentDate)}
                  </div>
                </div>
                <Badge variant={c.isStrong ? 'positive' : 'warning'} size="sm">{c.score}</Badge>
              </div>

              <div className="d-flex flex-column gap-1 mt-2">
                <ScoreBar label="tutar" value={c.amountScore} max={50} />
                <ScoreBar label="tarih" value={c.dateScore} max={30} />
                <ScoreBar label="tedarikçi" value={c.supplierScore} max={20} />
              </div>

              {c.reasons.length > 0 && (
                <div style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)', marginTop: 4 }}>
                  {c.reasons.join(' · ')}
                </div>
              )}

              <Button variant="primary" size="sm" className="mt-2 w-100" disabled={busy}
                onClick={() => handleMatch(c.documentFileId)}>
                Bağla + EK no ata
              </Button>
            </div>
          ))}
        </div>

        {/* Sağ: bağlanmamış belgeler */}
        <div className="apya-doc-check-card">
          <div className="apya-md-overline">Bağlanmamış belgeler</div>
          {board.documents.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Bağlanmamış belge yok.</div>
          ) : board.documents.map((doc) => (
            <div key={doc.id} className="apya-md-item" style={{ borderRadius: 8, height: 'auto', paddingTop: 7, paddingBottom: 7 }}>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span className="d-block text-truncate" style={{ fontSize: 12.5 }}>{doc.displayName}</span>
                <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
                  {fmtMoney(doc.amount)} · {fmtDate(doc.documentDate)}
                  {doc.documentTypeName && ` · ${doc.documentTypeName}`}
                </span>
                {doc.duplicateOf && (
                  <Badge variant="negative" size="sm">{DUPLICATE_LABEL[doc.duplicateOf]}</Badge>
                )}
              </span>
              {selected && (
                <button type="button" className="apya-doc-linkbtn" disabled={busy}
                  onClick={() => handleMatch(doc.id)}>
                  Bağla
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="apya-doc-check-card mt-3">
          <div className="apya-md-overline">Kurulmuş eşleşmeler ({matches.length})</div>
          {matches.map((m) => (
            <div key={m.id} className="apya-doc-check-row" style={{ gridTemplateColumns: '70px minmax(0,1fr) minmax(0,1fr) 90px' }}>
              <Badge variant="neutral" size="sm">{m.annexNumber || m.score}</Badge>
              <span className="text-truncate" style={{ fontSize: 12.5 }}>{m.documentFileName}</span>
              <span className="text-truncate" style={{ fontSize: 12 }}>
                {m.expenseTitle} · {fmtMoney(m.expenseAmount)}
              </span>
              <span className="text-end">
                <button type="button" className="apya-doc-linkbtn" disabled={busy}
                  onClick={async () => { setBusy(true); await removeMatch(m.id); await load(); setBusy(false); }}>
                  Kaldır
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
