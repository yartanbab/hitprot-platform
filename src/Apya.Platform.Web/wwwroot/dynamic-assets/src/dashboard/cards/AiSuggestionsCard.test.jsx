import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AiSuggestionsCard } from './AiSuggestionsCard';

/**
 * AI önerileri kartı — "AI Merkezi →" bağlantısı.
 *
 * Bağlantı `/Ai/Dashboard`a gidiyordu; öyle bir sayfa yok (AI Merkezi `/AiCenter/Dashboard`)
 * → karta basan kullanıcı 404 görüyordu. Ayrıca bağlantı, sayfayı açamayacak kullanıcıya da
 * çiziliyordu: sayfa AiAssist özelliğini ve Ai.Dashboard.View iznini ister (menü de aynı kapıya bakar).
 */
const grant = ({ feature = true, permission = true } = {}) => {
    window.abp = {
        features: { isEnabled: (name) => feature && name === 'Platform.AiAssist' },
        auth: { isGranted: (name) => permission && name === 'Ai.Dashboard.View' },
    };
};

afterEach(() => {
    delete window.abp;
});

describe('AiSuggestionsCard', () => {
    it('bağlantı var olan AI Merkezi sayfasına gider', () => {
        grant();
        render(<AiSuggestionsCard editMode={false} />);

        const link = screen.getByRole('link', { name: /AI Merkezi/ });
        expect(link).toHaveAttribute('href', '/AiCenter/Dashboard');

        // Sayfa taşınır ya da yeniden adlandırılırsa bu bağlantı yine sessizce ölür: dosyaya bak.
        const page = path.resolve(__dirname, '../../../../../Pages', '.' + link.getAttribute('href'), 'Index.cshtml');
        expect(fs.existsSync(page), `${page} yok`).toBe(true);
    });

    it('izin yoksa bağlantı çizilmez', () => {
        grant({ permission: false });
        render(<AiSuggestionsCard editMode={false} />);

        expect(screen.queryByRole('link', { name: /AI Merkezi/ })).not.toBeInTheDocument();
        expect(screen.getByText('AI şu an sessiz')).toBeInTheDocument();
    });

    it('AI özelliği pakette yoksa bağlantı çizilmez', () => {
        grant({ feature: false });
        render(<AiSuggestionsCard editMode={false} />);

        expect(screen.queryByRole('link', { name: /AI Merkezi/ })).not.toBeInTheDocument();
    });
});
