/* =============================================================================
   APYA HEADER VIEWS — sayfa görünüm seçicisini header'a taşır
   -----------------------------------------------------------------------------
   Hedef tasarımda görünüm modu (tablo / pano / zaman çizelgesi) arama pilinin
   sağında, header'da duruyor ve seçili mod alt başlığa yazılıyor
   ("Tüm projelerdeki görevler · tablo görünümü").

   YAKLAŞIM: sayfanın kendi segmenti DOM'da TAŞINIR, yeniden üretilmez.
   Böylece sayfanın JS'i (ör. Pages/Tasks/index.js) id'lere bağladığı
   handler'ları kaybetmez — DOM düğümü taşınırken dinleyicileri korur.
   Sayfa ile header arasındaki tek sözleşme markup'taki data-* öznitelikleri:

     <div class="apya-view-toggle" data-header-views>
       <button id="..." data-icon="fa-list" data-view-label="tablo görünümü">Liste</button>

   Segmenti olmayan sayfada bu dosya hiçbir şey yapmaz (header'da öğe çıkmaz).
   ============================================================================= */
(function () {
    'use strict';

    function init() {
        var toggle = document.querySelector('[data-header-views]');
        if (!toggle) { return; }

        var bar = document.querySelector('.lpx-topbar-content');
        if (!bar) { return; }   // toolbar'sız layout — segment sayfada kalsın

        var buttons = Array.prototype.slice.call(toggle.querySelectorAll('.btn'));
        if (!buttons.length) { return; }

        // Metin → ikon. Metin aria/title olarak korunur (erişilebilirlik).
        buttons.forEach(function (btn) {
            var label = (btn.textContent || '').trim();
            var icon = btn.getAttribute('data-icon');
            if (!icon) { return; }
            btn.setAttribute('title', label);
            btn.setAttribute('aria-label', label);
            btn.textContent = '';
            var i = document.createElement('i');
            i.className = 'fa ' + icon;
            i.setAttribute('aria-hidden', 'true');
            btn.appendChild(i);
        });

        toggle.classList.add('apya-view-toggle--header');
        bar.appendChild(toggle);   // sıra CSS'teki flex `order` ile belirlenir

        function activeButton() {
            return toggle.querySelector('.btn.active') || buttons[0];
        }
        function syncLabel() {
            var btn = activeButton();
            var label = btn ? (btn.getAttribute('data-view-label') || '') : '';
            if (window.apyaHeader && window.apyaHeader.setViewLabel) {
                window.apyaHeader.setViewLabel(label);
            }
        }

        // Sayfanın kendi handler'ı .active sınıfını değiştiriyor; biz yalnız
        // SONUCU izliyoruz (tıklama sırasına bağımlı kalmamak için observer).
        var observer = new MutationObserver(syncLabel);
        buttons.forEach(function (btn) {
            observer.observe(btn, { attributes: true, attributeFilter: ['class'] });
        });

        syncLabel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
