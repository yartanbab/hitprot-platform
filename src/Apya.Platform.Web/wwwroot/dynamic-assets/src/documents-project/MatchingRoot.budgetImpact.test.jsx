import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * "Bütçe etkisi" satırı (tasarım 5b).
 *
 * Eşleştirme kararı finansın sorusudur: bu belgeyi bağlarsam HANGİ bütçe kalemi
 * belgeli olur? Satır yalnız harcamanın kalemi varken basılır — kalemi olmayan
 * harcamada uydurma bir kalem adı yazmaktansa hiç yazmamak doğrudur.
 *
 * Sunucu köprüsü mock'lanıyor: burada test edilen şey ağ değil, kalem bilgisinin
 * ekrana ULAŞIP ulaşmadığı.
 */
const KALEMLI = {
    id: 'e1',
    title: 'Sunucu kirası',
    amount: 12000,
    currency: 'TRY',
    expenseDate: '2026-08-12T00:00:00',
    supplierName: 'Vega Bilişim',
    budgetLineId: 'b1',
    budgetLineName: '1 · Personel',
};

const KALEMSIZ = { ...KALEMLI, id: 'e2', title: 'Kargo', budgetLineId: null, budgetLineName: null };

const ADAY = {
    documentFileId: 'd1',
    displayName: 'fatura-2026-08.pdf',
    amount: 12000,
    documentDate: '2026-08-12T00:00:00',
    score: 92,
    amountScore: 50,
    dateScore: 30,
    supplierScore: 12,
    isStrong: true,
    reasons: ['tutar birebir'],
};

const getBoard = vi.fn();
const getCandidates = vi.fn();

vi.mock('./api', () => ({
    abpNotify: vi.fn(),
    createMatch: vi.fn(),
    removeMatch: vi.fn(),
    getMatches: () => Promise.resolve([]),
    getBoard: (...a) => getBoard(...a),
    getCandidates: (...a) => getCandidates(...a),
    fmtDate: (d) => String(d ?? ''),
    fmtMoney: (v) => String(v ?? ''),
}));

// eslint-disable-next-line import/first
import { MatchingRoot } from './MatchingRoot';

function boardWith(...expenses) {
    return { projectId: 'p1', expenses, documents: [], undocumentedTotal: 12000 };
}

beforeEach(() => {
    vi.clearAllMocks();
    window.abp = { appPath: '/' };
    window.history.replaceState({}, '', '/Documents/Matching?projectId=p1');
    getCandidates.mockResolvedValue([ADAY]);
});

describe('MatchingRoot · bütçe etkisi', () => {
    it('kalemi olan harcamada aday kartında kalem adını yazar', async () => {
        getBoard.mockResolvedValue(boardWith(KALEMLI));

        render(<MatchingRoot />);
        await userEvent.click(await screen.findByText('Sunucu kirası'));

        expect(await screen.findByText(/«1 · Personel» kalemi belgeli olur/)).toBeInTheDocument();
    });

    it('kalemi olmayan harcamada satırı HİÇ basmaz', async () => {
        getBoard.mockResolvedValue(boardWith(KALEMSIZ));

        render(<MatchingRoot />);
        await userEvent.click(await screen.findByText('Kargo'));

        expect(await screen.findByText('fatura-2026-08.pdf')).toBeInTheDocument();
        expect(screen.queryByText(/kalemi belgeli olur/)).not.toBeInTheDocument();
    });

    it('sol listede harcamanın kalemini gösterir', async () => {
        getBoard.mockResolvedValue(boardWith(KALEMLI));

        render(<MatchingRoot />);

        expect(await screen.findByText(/1 · Personel/)).toBeInTheDocument();
    });
});
