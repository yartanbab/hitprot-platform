import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * TSK-01: görev detay adasındaki sorgular sessionStorage'a yazılıp açılışlar arasında
 * taşınıyordu; kanban, liste ve proje konsolu aynı görevi React Query dışından
 * değiştirdiği için modal eski kaydı gösteriyor, kullanıcı onun üzerine yazıyordu
 * (kontrol listesinde işaretleme ters yöne dönüyordu).
 *
 * Kural: src/task-detail altındaki HER useQuery ya 'meta: { persist: false }' taşır ya
 * da izinli lookup'lardan biridir. Yeni bir görev sorgusu kararı unutursa bu test kırılır.
 * Sezgisel: bir useQuery( çağrısından sonraki useQuery( / useMutation( ya da dosya
 * sonuna kadarki metne bakar.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const ALLOWED_LOOKUPS = ["'users-lookup'", "'projects-lookup'", "'budget-lines'"];

function sourceFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) return sourceFiles(full);
        if (!/\.(js|jsx)$/.test(name) || /\.test\.(js|jsx)$/.test(name)) return [];
        return [full];
    });
}

function querySegments(src) {
    const starts = [...src.matchAll(/useQuery\(/g)].map((m) => m.index);
    return starts.map((start) => {
        const rest = src.slice(start + 1);
        const next = [rest.search(/useQuery\(/), rest.search(/useMutation\(/)]
            .filter((i) => i >= 0);
        const end = next.length ? start + 1 + Math.min(...next) : src.length;
        return src.slice(start, end);
    });
}

describe('görev detay adası — sorgu kalıcılık envanteri', () => {
    const found = sourceFiles(here).flatMap((file) =>
        querySegments(readFileSync(file, 'utf8')).map((segment) => ({
            file: path.relative(here, file),
            segment,
        })));

    it('tarama gerçekten sorgu buluyor (desen bozulursa test boşuna geçmesin)', () => {
        expect(found.length).toBeGreaterThanOrEqual(17);
    });

    it('her görev kapsamlı sorgu persist:false taşır; yalnız lookup\'lar kalıcı kalır', () => {
        const offenders = found.filter(({ segment }) =>
            !/persist:\s*false/.test(segment) && !ALLOWED_LOOKUPS.some((k) => segment.includes(k)));

        expect(
            offenders.map((o) => o.file),
            'görev kapsamlı sorgu kalıcılık kararını açıkça vermeli: '
            + "'meta: { persist: false }' ekleyin ya da yalnız lookup ise izin listesine alın",
        ).toEqual([]);
    });
});
