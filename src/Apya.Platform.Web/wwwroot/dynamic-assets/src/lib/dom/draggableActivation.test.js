import { describe, it, expect, vi } from 'vitest';
import { draggableActivation } from './draggableActivation';

/**
 * Sözleşme: eylem HER giriş yolunda tam BİR kez çalışmalı.
 * Fare/kalem  → pointerdown (click gelmeyebilir: sürükleme onu yutar)
 * Dokunma     → click       (parmak değdiği an seçmek kaydırma jestini bozardı)
 * Klavye      → click       (Enter/Space, pointerType === '')
 */

/** React'in sentetik click'i gibi: pointerType yalnız nativeEvent'te bulunur. */
const clickEvent = (pointerType) => ({ nativeEvent: { pointerType } });
const pointerEvent = (pointerType, button = 0) => ({ pointerType, button });

describe('draggableActivation', () => {
    it('farede yalnizca pointerdown calisir', () => {
        const activate = vi.fn();
        const a = draggableActivation(activate);
        a.onPointerDown(pointerEvent('mouse'));
        a.onClick(clickEvent('mouse'));
        expect(activate).toHaveBeenCalledTimes(1);
    });

    it('kalemde de yalnizca pointerdown calisir', () => {
        const activate = vi.fn();
        const a = draggableActivation(activate);
        a.onPointerDown(pointerEvent('pen'));
        a.onClick(clickEvent('pen'));
        expect(activate).toHaveBeenCalledTimes(1);
    });

    it('dokunmada yalnizca click calisir', () => {
        const activate = vi.fn();
        const a = draggableActivation(activate);
        a.onPointerDown(pointerEvent('touch'));
        expect(activate).not.toHaveBeenCalled();
        a.onClick(clickEvent('touch'));
        expect(activate).toHaveBeenCalledTimes(1);
    });

    it('klavyede click calisir (pointerType bos dize)', () => {
        const activate = vi.fn();
        const a = draggableActivation(activate);
        a.onClick(clickEvent(''));
        expect(activate).toHaveBeenCalledTimes(1);
    });

    /** Surukleme click'i yutar; eylem yine de bir kez calismis olmali. */
    it('surukleme yuzunden click hic gelmese bile eylem calismis olur', () => {
        const activate = vi.fn();
        const a = draggableActivation(activate);
        a.onPointerDown(pointerEvent('mouse'));
        expect(activate).toHaveBeenCalledTimes(1);
    });

    it('sag ve orta tik eylemi calistirmaz', () => {
        const activate = vi.fn();
        const a = draggableActivation(activate);
        a.onPointerDown(pointerEvent('mouse', 2));
        a.onPointerDown(pointerEvent('mouse', 1));
        expect(activate).not.toHaveBeenCalled();
    });
});
