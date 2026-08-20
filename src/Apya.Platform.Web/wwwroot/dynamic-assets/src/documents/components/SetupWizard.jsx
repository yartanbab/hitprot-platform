import React, { useState } from 'react';
import { Badge, Button } from '../../components/ui';
import { abpNotify, applySetup, completeSetup } from '../api';
import { cn } from '../format';

/**
 * İlk kurulum sihirbazı.
 *
 * Yalnız kiracıda kurulum HİÇ yapılmamışsa açılır ve tamamlanınca bir daha
 * görünmez (bayrak kiracı ayarında — takvimin sihirbazıyla aynı ray).
 *
 * Adımlar mevcut yetenekleri sıraya diziyor: kurum paketi uygulama ve klasör
 * oluşturma zaten vardı; sihirbaz bunları ilk gün tek akışta yapıyor.
 */

const SCHEMAS = [
  {
    value: 3,
    label: 'Karma',
    detail: 'İş adımı klasörleri + Finans / Personel / Sözleşmeler',
  },
  {
    value: 1,
    label: 'İş adımı bazlı',
    detail: 'Projenin her iş adımı için bir klasör',
  },
  {
    value: 2,
    label: 'Dönem bazlı',
    detail: 'Yılın dört çeyreği için klasör',
  },
];

/** Seçilen şemanın üreteceği klasör listesi — kurmadan önce göster. */
function previewFolders(schema, project) {
  const steps = project?.workStepCount ?? 0;
  const stepNames = Array.from({ length: steps }, (_, i) => `${i + 1} · iş adımı`);

  if (schema === 1) return stepNames;
  if (schema === 2) {
    const year = new Date().getFullYear();
    return [1, 2, 3, 4].map((q) => `${year} Q${q}`);
  }
  return [...stepNames, 'Finans', 'Personel / İK', 'Sözleşmeler'];
}

export function SetupWizard({ state, onDone }) {
  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState('');
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? '');
  const [schema, setSchema] = useState(3);
  const [busy, setBusy] = useState(false);

  const project = state.projects.find((p) => p.id === projectId);
  const folders = previewFolders(schema, project);

  const skip = async () => {
    setBusy(true);
    try {
      await completeSetup();
      onDone();
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    setBusy(true);
    try {
      const result = await applySetup({
        projectId,
        schema,
        compliancePackageId: packageId || null,
        periodCode: null,
      });

      abpNotify('success', `${result.createdFolderCount} klasör kuruldu.`);
      onDone();
    } catch (e) {
      abpNotify('error', 'Kurulum tamamlanamadı.');
      console.error('[Documents] setup', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="apya-in apya-doc-overlay">
      <div className="apya-pop-in apya-doc-setup" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-start gap-3 mb-3">
          <span className="apya-doc-setup-icon"><i className="fa fa-wand-magic-sparkles" /></span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Dokümanlar kurulumu</div>
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
              Klasör şemasını kurumun beklediği yapıya göre kurun. Sonradan da değiştirebilirsiniz.
            </div>
          </div>
          <div className="flex-grow-1" />
          <button type="button" className="apya-doc-linkbtn" onClick={skip} disabled={busy}>Atla</button>
        </div>

        <div className="apya-doc-setup-steps">
          {['Kurum ve program', 'Klasör şeması', 'Ekip ve kutu'].map((label, index) => (
            <button
              key={label}
              type="button"
              className={cn('apya-doc-setup-step', index === step && 'is-active', index < step && 'is-done')}
              onClick={() => setStep(index)}
            >
              <span className="apya-doc-setup-step-no">{index + 1}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ── 1. Kurum ve program ─────────────────────────────────────── */}
        {step === 0 && (
          <div className="d-flex flex-column gap-2">
            <div style={{ fontSize: 12, color: 'var(--apya-text-secondary)' }}>
              Zorunlu belge listesi buradan gelir. Şimdi seçmeyip sonra Uygunluk sekmesinden de uygulayabilirsiniz.
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={cn('apya-doc-filterchip', !packageId && 'is-active')}
                onClick={() => setPackageId('')}
              >
                Şimdilik yok
              </button>
              {state.packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={cn('apya-doc-filterchip', packageId === pkg.id && 'is-active')}
                  onClick={() => setPackageId(pkg.id)}
                >
                  {pkg.name}
                  <Badge variant="neutral" size="sm">{pkg.requirementCount}</Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 2. Klasör şeması ────────────────────────────────────────── */}
        {step === 1 && (
          <div className="d-flex flex-column gap-2">
            {state.projects.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
                Kiracıda proje yok — klasör şeması bir projeye kurulur. Önce bir proje oluşturun.
              </div>
            ) : (
              <>
                <select
                  className="apya-doc-select"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  aria-label="Proje"
                >
                  {state.projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.hasFolders ? ' — zaten klasörü var' : ''}
                    </option>
                  ))}
                </select>

                <div className="d-flex flex-wrap gap-2">
                  {SCHEMAS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className={cn('apya-doc-filterchip', schema === s.value && 'is-active')}
                      onClick={() => setSchema(s.value)}
                      title={s.detail}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Kurmadan önce ne olacağını göster — sürpriz klasör olmasın. */}
                <div className="apya-doc-setup-preview">
                  <div className="apya-md-overline">Kurulacak klasörler</div>
                  <div style={{ fontSize: 12 }}>{project?.name}</div>
                  {folders.length === 0 ? (
                    <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
                      Bu projede iş adımı tanımlı değil; yalnız proje klasörü kurulur.
                    </div>
                  ) : folders.map((f) => (
                    <div key={f} style={{ fontSize: 11.5, color: 'var(--apya-text-secondary)', paddingLeft: 12 }}>
                      {f}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── 3. Ekip ve kutu ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="d-flex flex-column gap-2" style={{ fontSize: 12 }}>
            <div style={{ color: 'var(--apya-text-secondary)' }}>
              Ekip üyeleri ve alan bazlı izinler kimlik yönetiminden, alan izinleri ise
              Dokümanlar → Yönetim ekranından tanımlanır.
            </div>
            {/* Söz verilmeyen şey söylenmez: e-posta kutusu henüz gerçek değil. */}
            <div style={{ color: 'var(--apya-text-tertiary)' }}>
              Belge e-posta kutusu (gelen ekleri otomatik klasörleme) henüz kullanıma
              açık değil; Entegrasyonlar ekranında yer ayrıldı.
            </div>
          </div>
        )}

        <div className="d-flex gap-2 justify-content-end mt-3">
          {step > 0 && (
            <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>Geri</Button>
          )}
          {step < 2 ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>Devam</Button>
          ) : (
            <Button
              size="sm"
              isLoading={busy}
              disabled={state.projects.length === 0 || !projectId}
              onClick={apply}
            >
              Şemayı kur
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
