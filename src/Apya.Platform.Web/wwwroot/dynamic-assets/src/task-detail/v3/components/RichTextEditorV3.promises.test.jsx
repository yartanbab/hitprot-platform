import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// QA-32 · Açıklama editörü yer tutucu basan araç sunmaz.
const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, 'RichTextEditorV3.jsx'), 'utf8');

describe('RichTextEditorV3 vaat süpürmesi', () => {
    it('görsel yer tutucusu ve kendi adını basan bahsetme aracı yok', () => {
        expect(src).not.toContain("title: 'Görsel ekle'");
        expect(src).not.toContain("title: 'Kişi bahset'");
        expect(src).not.toContain('IMAGE_PLACEHOLDER_HTML');
    });
});
