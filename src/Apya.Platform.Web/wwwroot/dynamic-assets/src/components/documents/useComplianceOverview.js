import { useCallback, useEffect, useRef, useState } from 'react';
import { getComplianceOverview } from '../../documents/api';

/**
 * Projenin uygunluk özeti (tüm kurum paketleri, dönem süzgeci yok).
 *
 * Şerit ve Dokümanlar ekranı aynı veriyi okur; ekran kendi kopyasını çekmesin
 * diye tek kanca. Proje değişince eski projenin verisi hemen düşer — başka
 * projenin eksiklerini birkaç yüz milisaniye bile göstermek yanıltıcı olurdu.
 * Aynı projede yeniden yüklerken eski veri kalır, ekran titremez.
 *
 * @param {string|null} projectId
 */
export function useComplianceOverview(projectId) {
  const [state, setState] = useState({ projectId: null, overview: null, loading: false, failed: false });
  const requestRef = useRef(0);

  const reload = useCallback(async () => {
    const request = ++requestRef.current;

    if (!projectId) {
      setState({ projectId: null, overview: null, loading: false, failed: false });
      return;
    }

    setState((prev) => ({
      projectId,
      overview: prev.projectId === projectId ? prev.overview : null,
      loading: true,
      failed: false,
    }));

    try {
      const overview = await getComplianceOverview(projectId, null);
      // Bu arada başka bir proje istendiyse eski yanıt yeni bağlamı ezmesin.
      if (request === requestRef.current) {
        setState({ projectId, overview: overview ?? null, loading: false, failed: false });
      }
    } catch (e) {
      if (request === requestRef.current) {
        setState({ projectId, overview: null, loading: false, failed: true });
      }
      console.error('[Documents] compliance overview', e);
    }
  }, [projectId]);

  useEffect(() => { reload(); }, [reload]);

  // Proje değiştiği render'da effect henüz koşmadı: state hâlâ ÖNCEKİ projeyi
  // taşıyor. O anı "yükleniyor" say, eski veriyi dışarı verme.
  const isCurrent = state.projectId === (projectId || null);

  return {
    overview: isCurrent ? state.overview : null,
    loading: projectId ? (!isCurrent || state.loading) : false,
    failed: isCurrent && state.failed,
    reload,
  };
}
