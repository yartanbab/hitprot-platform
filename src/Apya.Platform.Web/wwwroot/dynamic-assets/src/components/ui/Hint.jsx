import React from 'react';

/**
 * Hint — bilgi ipucu ikonu (ⓘ). İlk kullanıcıya buton/işlev açıklaması;
 * üzerine gelince (ya da Tab ile odaklanınca) küçük kutu açılır.
 *
 * Kutu Bootstrap tooltip'idir ve init GLOBAL'dir: /js/apya-hint.js tooltip'i
 * document.body'ye delege eder, bu yüzden island içinde ayrı bir init/effect
 * gerekmez — sonradan mount edilen Hint'ler de kendiliğinden çalışır.
 * Razor karşılığı: <apya-hint text="…" />
 *
 * Yalnız isminden anlaşılmayan işlevlere konur; apaçık butonlar boş kalır.
 */
function Hint({ text, placement = 'top', className }) {
    if (!text) return null;
    return (
        <span
            className={className ? 'apya-hint ' + className : 'apya-hint'}
            data-bs-toggle="tooltip"
            data-bs-placement={placement}
            data-bs-title={text}
            tabIndex={0}
            aria-label="Bilgi"
        >
            <i className="fa fa-circle-info" aria-hidden="true" />
        </span>
    );
}

export { Hint };
