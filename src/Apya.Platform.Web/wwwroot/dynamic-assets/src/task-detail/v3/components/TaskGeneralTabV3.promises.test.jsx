import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// QA-18 · Yorum kutusu yalnız gerçekten iş yapan araçları gösterir. "Dosya ekle"/"Görsel ekle"
// metne yer tutucu yazıyordu, "Bahset" seçicisiz "@" basıyordu, beğeni sunucuda yoktu.
// QA-17 · Menüdeki kısayol ipuçları yalnız tanımlı kısayollar (⌘L/⌘D/⌫ bağlı değildi).
const here = dirname(fileURLToPath(import.meta.url));
const general = readFileSync(join(here, 'TaskGeneralTabV3.jsx'), 'utf8');
const header = readFileSync(join(here, 'TaskDetailHeaderV3.jsx'), 'utf8');

describe('görev detayı vaat süpürmesi', () => {
    it('yorum metnine yer tutucu yazan araç yok', () => {
        expect(general).not.toContain("add: ' [Dosya] '");
        expect(general).not.toContain("add: ' [Görsel] '");
        expect(general).not.toContain("add: ' @'");
    });

    it('sunucuda olmayan beğeni sayacı yok', () => {
        expect(general).not.toContain('toggleLike');
    });

    it('menü tanımsız kısayol vaat etmez', () => {
        expect(header).not.toMatch(/kbd: '⌘[LD]'/);
        expect(header).not.toContain("kbd: '⌫'");
        expect(header).not.toContain("'⌘ L'");
    });
});
