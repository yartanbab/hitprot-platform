import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadRoot } from './UploadRoot';

/**
 * DOC-01: yükleme kuyruğunun toplu künyesi belge başına tam değiştirme ucunu
 * (SetMeta → UpdateMetaAsync) üç alanlı nesneyle çağırıyordu; belgenin proje bağı,
 * tutarı, durumu, etiketleri ve görünen adı siliniyordu. Artık TEK istek dar uca
 * gider ve yalnız doldurulan alanlar gönderilir.
 */
const mocks = vi.hoisted(() => ({
    getList: vi.fn(),
    getDocumentTypes: vi.fn(),
    uploadFile: vi.fn(),
    setBulkMeta: vi.fn(),
    abpNotify: vi.fn(),
}));

vi.mock('./api', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        abpAppPath: () => '/',
        abpDocument: () => ({ getList: mocks.getList }),
        abpNotify: mocks.abpNotify,
        getDocumentTypes: mocks.getDocumentTypes,
        uploadFile: mocks.uploadFile,
        setBulkMeta: mocks.setBulkMeta,
    };
});

beforeEach(() => {
    mocks.getList.mockImplementation(() => Promise.resolve({
        items: [{ id: 'd1', title: 'Klasör bir' }, { id: 'd2', title: 'Klasör iki' }],
    }));
    mocks.getDocumentTypes.mockImplementation(() => Promise.resolve([{ id: 't1', name: 'Fatura' }]));
    /* Aynı adlı dosya aynı belgenin yeni sürümü olur: ikisi de aynı kimliği döner. */
    mocks.uploadFile.mockImplementation(() => Promise.resolve({ documentFileId: 'f1' }));
    mocks.setBulkMeta.mockImplementation(() => Promise.resolve(1));
});

afterEach(() => { vi.clearAllMocks(); });

/** Klasörü seçer, iki dosyayı kuyruğa ekler ve yükler; toplu künye alanı açılır. */
async function uploadTwo() {
    const { container } = render(<UploadRoot />);

    fireEvent.change(await screen.findByLabelText('Hedef klasör'), { target: { value: 'd1' } });

    const input = container.querySelector('input[type="file"]');
    fireEvent.change(input, {
        target: {
            files: [
                new File(['a'], 'rapor.txt', { type: 'text/plain' }),
                new File(['b'], 'rapor-2.txt', { type: 'text/plain' }),
            ],
        },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Yükle (2)' }));
    await screen.findByText('Toplu künye (2 belge)');
}

describe('UploadRoot / toplu künye', () => {
    it('tek istekle yalnız doldurulan alanı gönderir; kimlikler tekilleştirilir', async () => {
        await uploadTwo();

        fireEvent.change(screen.getByLabelText('Dönem kodu'), { target: { value: '2026-Q4' } });
        fireEvent.click(screen.getByRole('button', { name: 'Yüklenenlere uygula' }));

        await waitFor(() => expect(mocks.abpNotify).toHaveBeenCalledWith('success', '1/1 belgeye künye atandı.'));
        expect(mocks.setBulkMeta).toHaveBeenCalledTimes(1);
        expect(mocks.setBulkMeta).toHaveBeenCalledWith({
            documentFileIds: ['f1'],
            documentTypeId: null,
            periodCode: '2026-Q4',
        });
    });

    it('dönem yalnız boşluksa ve tür boşsa düğme kapalı', async () => {
        await uploadTwo();

        fireEvent.change(screen.getByLabelText('Dönem kodu'), { target: { value: '   ' } });

        expect(screen.getByRole('button', { name: 'Yüklenenlere uygula' })).toBeDisabled();
    });

    it('istek düşerse hata bildirilir ve düğme yeniden açılır', async () => {
        mocks.setBulkMeta.mockImplementation(() => Promise.reject(new Error('500')));
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        await uploadTwo();

        fireEvent.change(screen.getByLabelText('Dönem kodu'), { target: { value: '2026-Q4' } });
        const button = screen.getByRole('button', { name: 'Yüklenenlere uygula' });
        fireEvent.click(button);

        await waitFor(() => expect(mocks.abpNotify).toHaveBeenCalledWith('error', 'Künye atanamadı.'));
        await waitFor(() => expect(button).toBeEnabled());
        consoleError.mockRestore();
    });
});
