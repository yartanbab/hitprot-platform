import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, renderHook, screen, act, waitFor } from '@testing-library/react';
import { useAsyncData, usePanelRefresh } from './usePanel';

/* STA-15: paneller tek seferlik yükleniyor, görev değişikliğine ve sekmenin
   yeniden gösterilmesine abone değildi. usePanelRefresh yüklenmiş paneli arka
   planda tazeler; useAsyncData.refresh hatada eldeki veriyi korur. */

const dataChanged = (entity) =>
    document.dispatchEvent(new CustomEvent('apya:data-changed', { detail: { entity } }));
const panelShown = (kind) =>
    document.dispatchEvent(new CustomEvent('apya:project-panel-shown', { detail: { kind } }));
/** usePanelRefresh setTimeout(0) ile birleştirir — bir makro görev ilerlet. */
const flush = () => act(() => new Promise((r) => setTimeout(r, 5)));

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

function Probe({ fetcher, enabled = true, kind = 'dependencies', mountEl }) {
    const panel = useAsyncData(fetcher, enabled);
    usePanelRefresh(kind, mountEl, panel);
    return <div data-testid="durum">{panel.status}:{String(panel.data ?? '')}</div>;
}

let mountEl;
beforeEach(() => { mountEl = document.createElement('div'); });

async function loaded(fetcher, props = {}) {
    const view = render(<Probe fetcher={fetcher} mountEl={mountEl} {...props} />);
    await waitFor(() => expect(screen.getByTestId('durum').textContent).toBe('ready:v1'));
    fetcher.mockClear();
    return view;
}

describe('usePanelRefresh', () => {
    it('enabled=false iken olay veri çekmez', async () => {
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        render(<Probe fetcher={fetcher} enabled={false} mountEl={mountEl} />);

        dataChanged('task');
        panelShown('dependencies');
        await flush();

        expect(fetcher).not.toHaveBeenCalled();
    });

    it('ilk yükleme sürerken olay ek istek atmaz', async () => {
        const d = deferred();
        const fetcher = vi.fn(() => d.promise);
        render(<Probe fetcher={fetcher} mountEl={mountEl} />);
        expect(fetcher).toHaveBeenCalledTimes(1);

        dataChanged('task');
        await flush();

        expect(fetcher).toHaveBeenCalledTimes(1);
        await act(async () => { d.resolve('v1'); });
    });

    it('yüklenmiş ve görünür panel görev olayında bir kez tazelenir; başka entity\'de tazelenmez', async () => {
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        await loaded(fetcher);

        dataChanged('task');
        await flush();
        expect(fetcher).toHaveBeenCalledTimes(1);

        dataChanged('invoice');
        await flush();
        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('gizli panel görev olayında istek atmaz; kendi kind\'ı gösterilince tazelenir', async () => {
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        await loaded(fetcher);
        mountEl.classList.add('d-none');

        dataChanged('task');
        await flush();
        expect(fetcher).not.toHaveBeenCalled();

        mountEl.classList.remove('d-none');
        panelShown('dependencies');
        await flush();
        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('başka kind gösterilince tazelenmez', async () => {
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        await loaded(fetcher);

        panelShown('checklist');
        await flush();

        expect(fetcher).not.toHaveBeenCalled();
    });

    it('aynı tick\'teki panel-shown + data-changed TEK isteğe iner', async () => {
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        await loaded(fetcher);

        panelShown('dependencies');
        dataChanged('task');
        await flush();

        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('arka plan tazelemesinde iskelet yok: veri ekranda kalır', async () => {
        const d = deferred();
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        await loaded(fetcher);
        fetcher.mockImplementation(() => d.promise);

        dataChanged('task');
        await flush();
        expect(screen.getByTestId('durum').textContent).toBe('reloading:v1');

        await act(async () => { d.resolve('v2'); });
        expect(screen.getByTestId('durum').textContent).toBe('ready:v2');
    });

    it('unmount sonrası olay istek atmaz', async () => {
        const fetcher = vi.fn(() => Promise.resolve('v1'));
        const view = await loaded(fetcher);
        view.unmount();

        dataChanged('task');
        panelShown('dependencies');
        await flush();

        expect(fetcher).not.toHaveBeenCalled();
    });
});

describe('useAsyncData', () => {
    async function withData(fetcher) {
        const hook = renderHook(() => useAsyncData(fetcher, true));
        await waitFor(() => expect(hook.result.current.status).toBe('ready'));
        return hook;
    }

    it('veri varken refresh reddedilirse durum ready kalır ve veri korunur', async () => {
        const fetcher = vi.fn().mockResolvedValueOnce('v1').mockRejectedValueOnce(new Error('ağ'));
        const { result } = await withData(fetcher);

        await act(() => result.current.refresh());

        expect(result.current.status).toBe('ready');
        expect(result.current.data).toBe('v1');
    });

    it('veri varken reload reddedilirse durum error olur (davranış değişmedi)', async () => {
        const fetcher = vi.fn().mockResolvedValueOnce('v1').mockRejectedValueOnce(new Error('ağ'));
        const { result } = await withData(fetcher);

        await act(() => result.current.reload());

        expect(result.current.status).toBe('error');
        expect(result.current.data).toBeNull();
    });

    it('üst üste iki reload\'da ilki sonra dönerse ekranda ikincinin verisi kalır', async () => {
        const first = deferred();
        const second = deferred();
        const fetcher = vi.fn().mockResolvedValueOnce('v0')
            .mockImplementationOnce(() => first.promise)
            .mockImplementationOnce(() => second.promise);
        const { result } = await withData(fetcher);

        let p1;
        let p2;
        act(() => { p1 = result.current.reload(); p2 = result.current.reload(); });
        await act(async () => { second.resolve('ikinci'); await p2; });
        await act(async () => { first.resolve('birinci'); await p1; });

        expect(result.current.status).toBe('ready');
        expect(result.current.data).toBe('ikinci');
    });
});
