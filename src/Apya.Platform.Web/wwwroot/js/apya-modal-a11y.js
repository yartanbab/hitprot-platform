/* =============================================================================
   APYA MODAL A11Y — Bootstrap modallarında erişilebilir ad + odak iadesi (RSP-05)
   -----------------------------------------------------------------------------
   Neden (canlıda ölçüldü): ABP modalları (ve elle yazılmış .modal'lar)
   • erişilebilir ad taşımıyordu: role=dialog var, aria-labelledby / aria-label yok,
     .modal-title id'siz → ekran okuyucu yalnız "iletişim kutusu" diyordu;
   • kapanınca odağı <body>'ye düşürüyordu: klavye kullanıcısı sayfanın başına
     dönüyor, "Yeni Gider"den sonra bir Tab menünün ilk öğesine gidiyordu.
     (ABP ModalManager kabı DOM'dan siler; Bootstrap odağı yalnız data-bs-toggle
     ile açılan pencerede geri verir.)

   Ne yapar — API yok, yalnız dinler:
   • show.bs.modal: pencerenin adı yoksa içindeki ilk .modal-title'a id verir
     (varsa onu kullanır) ve modala aria-labelledby yazar. Başlık yoksa ya da ad
     zaten varsa dokunmaz.
   • show.bs.modal: tetikleyiciyi saklar — o an odaktaki öğe (pencerenin dışındaysa),
     yoksa modal / SweetAlert dışındaki son odak.
   • hidden.bs.modal: odak sahipsiz kaldıysa (body'de, DOM'dan kopmuş ya da kapanan
     pencerenin içinde) tetikleyiciye döner. Tetikleyici kapalı bir açılır menünün
     öğesiyse (tablo satırı "İşlemler › Düzenle") menüyü açan düğmeye döner.
     Odak bilerek başka yere taşındıysa (sayfanın kendi onClose'u, Bootstrap'in
     data-bs-toggle iadesi) ya da tetikleyici DOM'da değilse dokunmaz.

   hidden dinleyicisi modal ÖĞESİNE bağlanır: ABP ModalManager kabı jQuery
   aşamasında DOM'dan sildiği için belge düzeyinde yerel hidden olayı gelmez.
   Tetikleyici WeakMap'te tutulur (jQuery.data kap silinince gider).
   jQuery GEREKTİRMEZ; yalnız Bootstrap'in yerel olayları.
   ============================================================================= */
(function () {
    var seq = 0;
    var lastOutside = null;
    var triggers = new WeakMap();
    var bound = new WeakSet();

    // Modal ve SweetAlert dışındaki son odak: pencere, odak <body>'deyken (AJAX ile
    // gecikmeli) açıldığında tetikleyici budur.
    document.addEventListener('focusin', function (e) {
        var target = e.target;
        if (target && target.closest && !target.closest('.modal, .swal2-container')) { lastOutside = target; }
    }, true);

    function nameModal(modal) {
        if (modal.hasAttribute('aria-labelledby') || modal.hasAttribute('aria-label')) { return; }
        var title = modal.querySelector('.modal-title');
        if (!title) { return; }
        if (!title.id) { title.id = 'apya-modal-title-' + (++seq); }
        modal.setAttribute('aria-labelledby', title.id);
    }

    function onHidden(e) {
        var modal = e.currentTarget;
        // İç içe pencerenin olayı dış pencereye de kabarır.
        if (e.target !== modal) { return; }
        var trigger = triggers.get(modal);
        triggers.delete(modal);
        if (!trigger || !trigger.isConnected) { return; }
        var active = document.activeElement;
        // Odak bilerek başka bir yere taşınmış: çalınmaz.
        if (active && active !== document.body && active.isConnected && !modal.contains(active)) { return; }
        var menu = trigger.closest('.dropdown-menu');
        if (menu && !menu.classList.contains('show')) {
            trigger = menu.parentNode ? menu.parentNode.querySelector('[data-bs-toggle="dropdown"]') : null;
            if (!trigger) { return; }
        }
        trigger.focus();
    }

    document.addEventListener('show.bs.modal', function (e) {
        var modal = e.target;
        if (!modal || !modal.classList || !modal.classList.contains('modal')) { return; }
        nameModal(modal);
        var active = document.activeElement;
        var trigger = active && active !== document.body && !modal.contains(active) ? active : lastOutside;
        if (trigger) { triggers.set(modal, trigger); } else { triggers.delete(modal); }
        if (!bound.has(modal)) {
            bound.add(modal);
            modal.addEventListener('hidden.bs.modal', onHidden);
        }
    });
})();
