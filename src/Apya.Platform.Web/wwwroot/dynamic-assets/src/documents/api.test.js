import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getActivity, getComplianceOverview, getCompliancePackages, getDocumentTypes,
  getFiles, getSetupState, getSuggestions, getWorkSteps,
} from './api';

/**
 * Yükleme uçları son parametredeki abp.ajax seçeneklerini ABP'ye iletir (ABP proxy
 * sözleşmesi). { abpHandleError: false } düşerse yükleme hatasında ABP penceresi
 * sayfa içi kartla birlikte yeniden açılır (Faz 4 kararı 2) — bu yüzden kilitli.
 */

function stubAbpAjax() {
  const ajax = vi.fn(() => ({ done(fn) { fn({ ok: true }); return this; }, fail() { return this; } }));
  window.abp = { ajax, appPath: '/' };
  return ajax;
}

afterEach(() => {
  delete window.abp;
});

const QUIET = { abpHandleError: false };

describe('documents/api · yükleme seçenekleri', () => {
  it.each([
    ['getFiles', () => getFiles({ maxResultCount: 25 }, QUIET), 'handler=Files'],
    ['getWorkSteps', () => getWorkSteps(null, QUIET), 'handler=WorkSteps'],
    ['getDocumentTypes', () => getDocumentTypes(QUIET), 'handler=DocumentTypes'],
    ['getCompliancePackages', () => getCompliancePackages('p1', QUIET), 'handler=CompliancePackages'],
    ['getComplianceOverview', () => getComplianceOverview('p1', null, QUIET), 'handler=ComplianceOverview'],
    ['getSetupState', () => getSetupState(QUIET), 'handler=SetupState'],
    ['getSuggestions', () => getSuggestions('p1', QUIET), 'handler=Suggestions'],
    ['getActivity', () => getActivity({ projectId: 'p1' }, QUIET), 'handler=Activity'],
  ])('%s abpHandleError:false iletir', async (_name, call, url) => {
    const ajax = stubAbpAjax();

    await expect(call()).resolves.toEqual({ ok: true });

    expect(ajax).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET', abpHandleError: false }));
    expect(ajax.mock.calls[0][0].url).toContain(url);
  });

  it('seçenek verilmezse ABP varsayılanı (pencere) değişmez', async () => {
    const ajax = stubAbpAjax();

    await getFiles({ maxResultCount: 25 });

    expect(ajax.mock.calls[0][0]).not.toHaveProperty('abpHandleError');
  });
});
