import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFeatureNavbarV3 } from './TaskFeatureNavbarV3';

/**
 * Sekme düğmeleri `draggable` (sürükle-bırak ile sıralanıyorlar). Bunun bedeli:
 * fare basılıyken ~4px'lik bir kayma tarayıcıda yerel sürüklemeyi başlatır ve
 * `click` olayı HİÇ üretilmez — kullanıcı tek tıklamayla sekme değiştiremiyordu.
 * Bu yüzden seçim pointerdown'a alındı; testler o sözleşmeyi korur.
 */

/* jsdom'da `PointerEvent` yok; fireEvent.pointerDown yalnız düz bir Event üretir ve
   `pointerType` / `button` olaya hiç inmez. Bileşenin ayırt ettiği alanlar bunlar
   olduğu için olayları elle kuruyoruz. */
function fire(el, type, { pointerType = 'mouse', button = 0 } = {}) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, button, detail: 1 });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    fireEvent(el, event);
}

const firePointerDown = (el, opts) => fire(el, 'pointerdown', opts);

/** Gerçek bir fare tıklaması: pointerdown + click, ikisi de pointerType taşır. */
function fireMouseClick(el) {
    firePointerDown(el);
    fire(el, 'click');
}

const TABS = [
    { code: 'general',  icon: 'fa-circle-info',  title: 'Genel' },
    { code: 'subtasks', icon: 'fa-list-check',   title: 'Alt Görevler' },
    { code: 'files',    icon: 'fa-paperclip',    title: 'Dosyalar' },
];

function renderNavbar(props = {}) {
    const onTabChange = vi.fn();
    render(
        <TaskFeatureNavbarV3
            activeTab="general"
            onTabChange={onTabChange}
            orderedTabs={TABS}
            onDragStart={vi.fn()}
            onDragEnd={vi.fn()}
            onReorderTo={vi.fn()}
            onOpenPicker={vi.fn()}
            {...props}
        />,
    );
    return { onTabChange };
}

describe('TaskFeatureNavbarV3 sekme secimi', () => {
    /** Asil regresyon: click hic gelmese bile sekme degismeli. */
    it('fare basildigi anda sekmeyi degistirir (click beklemeden)', () => {
        const { onTabChange } = renderNavbar();
        firePointerDown(screen.getByRole('button', { name: /Alt Görevler/ }));
        expect(onTabChange).toHaveBeenCalledWith('subtasks');
    });

    /** Surukleme olmadiginda pointerdown VE click birlikte gelir — sekme iki kez
     *  degistirilmemeli (ayni kalibi kullanan ekranlarda secim bir istek tetikliyor). */
    it('tam fare tiklamasinda onTabChange bir kez cagrilir', () => {
        const { onTabChange } = renderNavbar();
        fireMouseClick(screen.getByRole('button', { name: /Alt Görevler/ }));
        expect(onTabChange).toHaveBeenCalledTimes(1);
        expect(onTabChange).toHaveBeenCalledWith('subtasks');
    });

    /** Dokunmada yerel surukleme yok; secim click'ten gelir, pointerdown'da erken tetiklenip
     *  yatay kaydirma jestini sekme degisimine cevirmemeli. */
    it('dokunmada pointerdown sekmeyi degistirmez, click degistirir', () => {
        const { onTabChange } = renderNavbar();
        const tab = screen.getByRole('button', { name: /Dosyalar/ });

        firePointerDown(tab, { pointerType: 'touch' });
        expect(onTabChange).not.toHaveBeenCalled();

        fireEvent.click(tab);
        expect(onTabChange).toHaveBeenCalledWith('files');
    });

    /** Klavye (Enter/Space) sentetik bir click uretir — o yol acik kalmali. */
    it('klavyeden gelen click sekmeyi degistirir', () => {
        const { onTabChange } = renderNavbar();
        fireEvent.click(screen.getByRole('button', { name: /Alt Görevler/ }), { detail: 0 });
        expect(onTabChange).toHaveBeenCalledWith('subtasks');
    });

    /** Sag tik baglam menusu icindir, sekme degistirmez. */
    it('sag tik sekmeyi degistirmez', () => {
        const { onTabChange } = renderNavbar();
        firePointerDown(screen.getByRole('button', { name: /Dosyalar/ }), { button: 2 });
        expect(onTabChange).not.toHaveBeenCalled();
    });

    /** Sekmeler hala suruklenebilir olmali — secimi one almak DnD'yi bozmadi. */
    it('surukleme baslayinca onDragStart cagrilir', () => {
        const onDragStart = vi.fn();
        renderNavbar({ onDragStart });
        fireEvent.dragStart(screen.getByRole('button', { name: /Alt Görevler/ }));
        expect(onDragStart).toHaveBeenCalledWith('subtasks');
    });
});
