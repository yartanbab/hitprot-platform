import { describe, it, expect, beforeAll } from 'vitest';

// QA-05 · Kişi seçicisi etiketi TaskPersonName.Label ile aynı kural.
let apyaTask;

beforeAll(async () => {
    global.$ = function () {
        const el = document.createElement('div');
        return { text(s) { el.textContent = s; return this; }, html() { return el.innerHTML; } };
    };
    global.moment = function () { return { format: () => '', diff: () => 0 }; };
    await import('../../../js/apya-task-render.js');
    apyaTask = window.apyaTask;
});

describe('personLabel', () => {
    it('ad soyad ve kullanıcı adı birlikte', () => {
        expect(apyaTask.personLabel({ name: 'Can', surname: 'Öztürk', userName: 'calisan1' })).toBe('Can Öztürk (calisan1)');
    });

    it('ad yoksa kullanıcı adı', () => {
        expect(apyaTask.personLabel({ name: ' ', surname: null, userName: 'admin' })).toBe('admin');
    });
});
