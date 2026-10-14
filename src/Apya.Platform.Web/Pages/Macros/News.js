/* Tüm haberler (/Makro/Haberler) — yalnız çağrı afişinin zemini (Poster.js: afiş yoksa kuruma
   göre renk). Kart, süzgeç ve metin sunucuda basılır. */
(function () {
    'use strict';
    if (!window.apyaGrantPoster) { return; }
    document.querySelectorAll('.apya-macros-newscard-thumb[data-poster-issuer]').forEach(function (el) {
        el.setAttribute('style', apyaGrantPoster.style(el.dataset.posterIssuer, el.dataset.posterFile || null));
    });
})();
