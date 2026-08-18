import React, { useState } from 'react';
import { Badge, Button, Input } from '../components/ui';
import { dryRun, runRule, setRuleEnabled } from './api';

/**
 * Kural kurgusu: Eğer / Ve / O zaman.
 *
 * "Kuru çalıştır" hiçbir belgeyi değiştirmez; sunucudaki aynı değerlendirici
 * ile etki sayısını döner. Kural KAPALI doğar — kullanıcı önce etkisini görüp
 * sonra açsın.
 */

const FIELD_LABEL = {
  1: 'Belge adı', 2: 'Belge tipi', 3: 'Tutar', 4: 'Dönem', 5: 'Durum',
  6: 'İş adımı', 7: 'Geçerlilik', 8: 'Klasör', 9: 'Eksik zorunlu alan sayısı',
};

const OPERATOR_LABEL = {
  1: 'eşittir', 2: 'eşit değildir', 3: 'içerir', 4: 'büyüktür',
  5: 'küçüktür', 6: 'boş', 7: 'dolu',
};

const ACTION_LABEL = {
  1: 'Klasöre taşı', 2: 'Belge tipini ata', 3: 'Etiket ekle',
  4: 'Durumu değiştir', 5: 'İş adımı ata', 6: 'Dönem ata',
};

export function RuleEditor({ rule, onChanged, onEdit, onDelete }) {
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleDryRun = async () => {
    setBusy(true);
    try {
      setResult(await dryRun(rule.id));
    } finally {
      setBusy(false);
    }
  };

  const handleRun = async () => {
    if (!window.confirm(`"${rule.name}" kuralı gerçekten uygulanacak. Devam edilsin mi?`)) return;
    setBusy(true);
    try {
      setResult(await runRule(rule.id));
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async () => {
    setBusy(true);
    try {
      await setRuleEnabled(rule.id, !rule.isEnabled);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="apya-doc-check-card">
      <div className="apya-doc-check-head">
        <div style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{rule.name}</span>
            <Badge variant={rule.isEnabled ? 'positive' : 'neutral'} size="sm">
              {rule.isEnabled ? 'Açık' : 'Kapalı'}
            </Badge>
            <Badge variant="neutral" size="sm">
              {rule.trigger === 1 ? 'Yüklemede' : 'Zamanlı'}
            </Badge>
          </div>
          {rule.description && (
            <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>{rule.description}</div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="apya-numeric" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
            toplam {rule.totalAffectedCount} belge
          </span>
          <button type="button" className="apya-doc-linkbtn" disabled={busy} onClick={toggle}>
            {rule.isEnabled ? 'Kapat' : 'Aç'}
          </button>
          <button type="button" className="apya-doc-linkbtn" disabled={busy} onClick={() => onEdit(rule)}>
            Düzenle
          </button>
          <button type="button" className="apya-doc-linkbtn" disabled={busy} onClick={() => onDelete(rule)}>
            Sil
          </button>
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        <div className="apya-doc-rule-block is-if">
          <span className="apya-md-overline">
            {rule.logicalOperator === 1 ? 'Eğer (tümü)' : 'Eğer (herhangi biri)'}
          </span>
          {rule.conditions.length === 0 ? (
            <span style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
              Koşul yok — koşulsuz kural hiçbir belgeye uygulanmaz.
            </span>
          ) : rule.conditions.map((c) => (
            <span key={c.id} style={{ fontSize: 12 }}>
              {FIELD_LABEL[c.field] || '—'} <em>{OPERATOR_LABEL[c.operator] || '—'}</em>
              {c.compareValue ? ` "${c.compareValue}"` : ''}
            </span>
          ))}
        </div>

        <div className="apya-doc-rule-block is-then">
          <span className="apya-md-overline">O zaman</span>
          {rule.actions.map((a) => (
            <span key={a.id} style={{ fontSize: 12 }}>
              {ACTION_LABEL[a.actionType] || '—'}
              {a.payloadLabel ? ` → ${a.payloadLabel}` : a.payload ? ` → ${a.payload}` : ''}
            </span>
          ))}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" isLoading={busy} onClick={handleDryRun}>
          Kuru çalıştır
        </Button>
        <Button variant="primary" size="sm" disabled={!rule.isEnabled || busy} onClick={handleRun}
          title={rule.isEnabled ? undefined : 'Kapalı kural çalıştırılamaz'}>
          Uygula
        </Button>

        {result && (
          <span
            className="d-flex align-items-center gap-2"
            style={{ fontSize: 11.5, color: 'var(--apya-text-secondary)' }}
          >
            <Badge variant={result.isDryRun ? 'brand' : 'positive'} size="sm">
              {result.isDryRun ? 'Kuru' : 'Uygulandı'}
            </Badge>
            {result.matchedCount} eşleşme · <strong>{result.affectedCount}</strong> belge etkilenir
            {result.sample.length > 0 && ` (ör. ${result.sample.slice(0, 3).join(', ')})`}
          </span>
        )}
      </div>
    </div>
  );
}
