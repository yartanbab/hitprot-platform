/**
 * `draggable` bir öğede TIKLAMAYI güvenli hâle getirir.
 *
 * Sorun: bir öğe `draggable` ise, fare basılıyken 4px'lik bir kayma bile tarayıcıda
 * yerel sürüklemeyi başlatır ve `click` olayı HİÇ üretilmez. Kullanıcı tek tıklamayla
 * eylemi çalıştıramaz, "birkaç kez basmak" zorunda kalır. Sürükle-bırakla sıralanan
 * sekmelerde, takvim çubuklarında ve belge satırlarında hepsinde aynı hata vardı.
 *
 * `draggable`ı ancak kayma eşiği aşılınca açmak çare DEĞİL: tarayıcı sürükleme
 * kararını mousedown anında verir; sonradan açılan draggable o hareket için hiç
 * sürükleme başlatmaz (Chromium'da ölçüldü).
 *
 * Çözüm: eylemi fare/kalemde `pointerdown`'da, dokunma ve klavyede `click`te çalıştır.
 * İkisi ÇAKIŞMAZ, çünkü `click` de bir PointerEvent'tir ve `pointerType` alanı
 * fare için 'mouse', kalem için 'pen', dokunma için 'touch', klavyede (Enter/Space)
 * '' olur — Chromium'da doğrulandı.
 *
 * Dokunma neden pointerdown'a alınmıyor: parmak değdiği an pointerdown gelir;
 * kaydırılabilir bir listede bu, kaydırma jestini tıklamaya çevirirdi. Dokunmada
 * zaten yerel sürükleme yoktur, `click` orada güvenilirdir.
 *
 * Kullanım:
 *     const activation = draggableActivation(() => onSelect(item));
 *     <button draggable {...activation} />
 *
 * Yayılmayı durdurması gereken yerlerde sarmalayın:
 *     onPointerDown={(e) => { e.stopPropagation(); activation.onPointerDown(e); }}
 */
export function draggableActivation(activate) {
    return {
        onPointerDown: (e) => {
            if (e.pointerType === 'touch' || e.button !== 0) return;
            activate(e);
        },
        onClick: (e) => {
            /* `click`i PointerEvent olarak üretmeyen eski tarayıcıda alan undefined
               gelir; o zaman fare yolunda eylem iki kez çalışır — kırılmaz, yinelenir. */
            const pointerType = e.nativeEvent?.pointerType ?? e.pointerType;
            if (pointerType === 'mouse' || pointerType === 'pen') return;
            activate(e);
        },
    };
}
