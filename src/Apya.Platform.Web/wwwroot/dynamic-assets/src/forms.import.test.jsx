import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

/**
 * Formlarım · JSON içe aktarma düğmesi. Dosya antiforgery jetonuyla sayfanın Import ucuna gider;
 * sunucunun reddi (yanlış dosya) kullanıcıya sunucunun metniyle gösterilir.
 * #forms-list-root yok: modül yüklenince ada bağlanmaz, yalnız düğme çizilir.
 */
vi.mock('./lib/api/httpClient', () => ({ api: { get: () => Promise.resolve({ items: [] }) } }));

import { FormImportButton } from './forms';

afterEach(() => {
  vi.unstubAllGlobals();
  delete window.abp;
  document.body.innerHTML = '';
});

describe('FormImportButton', () => {
  it('dosyayı jetonla Import ucuna yollar, ret metnini gösterir', async () => {
    const token = document.createElement('input');
    token.name = '__RequestVerificationToken';
    token.value = 'jeton-1';
    document.body.appendChild(token);

    const error = vi.fn();
    window.abp = { message: { error, info: vi.fn() }, notify: { success: vi.fn() } };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: false, message: 'Bu dosya bir form dosyası değil.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = render(<FormImportButton />);
    const file = new File(['{}'], 'form.json', { type: 'application/json' });
    fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });

    await waitFor(() => expect(error).toHaveBeenCalledWith('Bu dosya bir form dosyası değil.'));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/DynamicAssets?handler=Import');
    expect(init.method).toBe('POST');
    expect(init.body.get('__RequestVerificationToken')).toBe('jeton-1');
    expect(init.body.get('file').name).toBe('form.json');
    expect(screen.getByRole('button', { name: 'İçe aktar (JSON)' })).not.toBeDisabled();
  });
});
