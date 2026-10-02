/* =============================================================================
   APYA ONAY PENCERESİ — tek kaynak (CON-02)
   -----------------------------------------------------------------------------
   Neden: aynı uygulamada beş onay yolu vardı (tarayıcının yerel penceresi,
   abp.message.confirm, elle yazılmış SweetAlert çağrıları, sayfaya özel
   data-confirm delegeleri, ada içi React kartları). Görünüm, dil, odak ve
   "yazarak onay" eşiği ekrandan ekrana değişiyordu.

   API
   apya.confirm(options | 'mesaj') → Promise<boolean>     ASLA reddetmez.
     options: { message, html?, title?, danger?, confirmText?, cancelText?,
                typeToConfirm?: true | 'beklenen metin' }
     • true YALNIZ onay düğmesiyle. Vazgeç / Esc / dış tık / başka bir pencere
       tarafından ezilme / SweetAlert yok = false. Tarayıcının yerel penceresine
       DÜŞÜLMEZ.
     • Görünüm abp.message.confirm ile aynı kaynaktan (abp.libs.sweetAlert.config:
       default + confirm) kopyalanır; ABP'nin nesneleri değiştirilmez. Radix /
       Bootstrap modalı üstünde tıklanabilirlik ve Esc yalıtımı oradaki willOpen +
       keydownListenerCapture ile gelir (ajax-error-detail.js).
     • message DÜZ METİN (kaçışlanır, satır sonu <br>); html çağıranın kaçışladığı
       güvenilir işaretleme. title düz metin basılır (titleText).
     • danger: kırmızı onay düğmesi, başlangıç odağı Vazgeç'te.
     • typeToConfirm: metin kutusu; true → Confirm:TypeWord (tr SİL, en DELETE).
       Karşılaştırma kırpılmış ve kültüre göre büyük/küçük harf duyarsız.
     • Oturum (ya da "başka kullanıcı") penceresi açıkken pencere AÇILMAZ, false
       döner: SweetAlert tekil, merkezi pencere ezilmez.
     • Meşgul / çift gönderim kilidi bu yardımcının işi değil (apya.busy).

   İşaretleme (Razor): tek genel delege, belge yakalama aşamasında
     <button | a | input[type=submit]
         data-confirm="MESAJ" [data-confirm-title="BAŞLIK"]
         [data-confirm-yes="ONAY DÜĞMESİ METNİ"] [data-confirm-danger]>
     Onaylanınca AYNI tıklama yeniden oynatılır (el.click()): gönderen düğme
     (submitter), formaction, doğrulama ve sayfanın kendi dinleyicileri korunur.
     form.submit() ÇAĞRILMAZ. Boş data-confirm ve disabled / aria-disabled="true"
     öğeye karışılmaz. Yazarak onay özniteliği yok (JS'ten apya.confirm çağrılır).
     Sınır: onay beklenirken yeniden çizilip DOM'dan kopan öğede yeniden oynatma
     düşer → JS'in yeniden çizdiği satırlarda apya.confirm kullanılır.

   TEK KURAL — hangi onay?
   Yazarak onay (SİL) yalnız, arayüzden geri alınamayan VE tek eylemle birden çok
   kaydı ya da kaydın bağlı alt kayıtlarını silen eylemlerde zorunludur. Bunun
   dışındaki her yıkıcı eylem (sil / kaldır / iptal et / sıfırla / yeniden üret
   ve geri alınamayan gönderim) tehlike onayıdır: kırmızı düğme, başlangıç odağı
   Vazgeç'te, yazma yok. Silme olmayan ama sonucu olan eylemler (uygula, devret,
   gönder) düz onaydır. Anında geri alınabilen ve "Geri al" sunan eylemler onay
   sormaz.

   React köprüsü: dynamic-assets/src/lib/feedback/confirm.js (confirmAsync).
   Global demette ajax-error-detail.js'ten SONRA yüklenir; apya.session,
   SweetAlert yapılandırması ve yerelleştirme ÇAĞRI ANINDA okunur. jQuery kullanmaz.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (window.apya.confirm) { return; }

    // Yedekler tr.json ile aynı; {0} tek bağımsız değişken.
    function text(key, fallback, arg) {
        try {
            var l = abp.localization.getResource('Platform');
            var value = arg == null ? l(key) : l(key, arg);
            if (value && value !== key) { return value; }
        } catch (e) { /* yerelleştirme henüz yüklenmedi */ }
        return arg == null ? fallback : fallback.replace('{0}', arg);
    }

    function esc(value) {
        return abp.utils.htmlEscape(value == null ? '' : String(value));
    }

    // 'sil' kabul (Türkçe olmayan klavyede İ yazamayan kullanıcı küçük harfle geçer),
    // noktasız 'SIL' ret: tr kültüründe i → İ, ı → I.
    function sameWord(typed, word) {
        var culture = (abp.localization.currentCulture && abp.localization.currentCulture.name) || 'tr';
        return String(typed || '').trim().toLocaleUpperCase(culture) === String(word).toLocaleUpperCase(culture);
    }

    // Ad bilerek "confirm" değil: nesnesiz çağrı tarayıcının yerel penceresi olurdu.
    function ask(options) {
        var o = typeof options === 'string' ? { message: options } : (options || {});
        if (!window.Swal || !Swal.fire || !window.abp) { return Promise.resolve(false); }
        if (apya.session && apya.session.isDialogOpen && apya.session.isDialogOpen()) { return Promise.resolve(false); }

        var config = (abp.libs && abp.libs.sweetAlert && abp.libs.sweetAlert.config) || {};
        var swal = Object.assign({}, config['default'], config.confirm);
        swal.html = o.html != null ? o.html : esc(o.message).replace(/\n/g, '<br>');
        // Başlık HTML olarak basılır; kullanıcı adı / kolon adı oraya düz metin girer.
        if (o.title) { delete swal.title; swal.titleText = o.title; }
        if (o.confirmText) { swal.confirmButtonText = o.confirmText; }
        if (o.cancelText) { swal.cancelButtonText = o.cancelText; }
        if (o.danger) {
            swal.customClass = Object.assign({}, swal.customClass, { confirmButton: 'btn btn-danger' });
            swal.focusCancel = true;
        }

        var word = null;
        if (o.typeToConfirm) {
            word = o.typeToConfirm === true ? text('Confirm:TypeWord', 'SİL') : String(o.typeToConfirm);
            swal.input = 'text';
            // Erişilebilir ad inputLabel'dan gelir (label for=…).
            swal.inputLabel = text('Confirm:TypeHint', 'Onaylamak için aşağıya {0} yazın.', word);
            swal.inputPlaceholder = word;
            swal.inputAttributes = { autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' };
            swal.focusCancel = false;
            swal.preConfirm = function (value) {
                if (sameWord(value, word)) { return true; }
                Swal.showValidationMessage(esc(text('Confirm:TypeMismatch', 'Onaylamak için {0} yazmalısınız.', word)));
                return false;
            };
        }

        // Odak bekçisi: Radix Popover / Dialog kapanırken odağı tetikleyiciye geri verir
        // (V3 "⋯ → Sil" tam bu yol); pencere açıkken dışarı düşen odak geri alınır.
        // willClose'da da sökülür: yalnız didDestroy'da sökülseydi SweetAlert'in kapanışta
        // odağı tetikleyiciye iadesini geri çekerdi (sıra: willClose → odak iadesi → didDestroy).
        // SweetAlert didOpen'ı bir sonraki görevde çağırır; pencere o arada ezildiyse
        // (didDestroy önce gelir) bekçi hiç kurulmaz.
        var guard = null;
        var closed = false;
        function dropGuard() {
            closed = true;
            if (guard) { document.removeEventListener('focusin', guard, true); guard = null; }
        }
        swal.didOpen = function (popup) {
            if (closed) { return; }
            guard = function (e) {
                if (popup.contains(e.target)) { return; }
                var target = word ? Swal.getInput() : (o.danger ? Swal.getCancelButton() : Swal.getConfirmButton());
                if (target) { target.focus(); }
            };
            document.addEventListener('focusin', guard, true);
        };
        swal.willClose = dropGuard;
        swal.didDestroy = dropGuard;

        return Promise.resolve(Swal.fire(swal)).then(
            function (result) { return !!(result && result.isConfirmed); },
            function () { return false; });
    }

    window.apya.confirm = ask;

    /* ---------- [data-confirm] genel delegesi ---------- */
    // Yakalama aşamasında TEK dinleyici: AJAX ile gelen modal içeriğinde ve sonradan
    // çizilen öğede de çalışır; React'in kök dinleyicisinden önce gelir.
    var replaying = new WeakSet();
    document.addEventListener('click', function (e) {
        var el = e.target && e.target.closest ? e.target.closest('[data-confirm]') : null;
        if (!el) { return; }
        var message = el.getAttribute('data-confirm');
        if (!message || el.disabled || el.getAttribute('aria-disabled') === 'true') { return; }
        // Onaylanmış tıklama: işaret tek kullanımlık, dokunmadan geçirilir.
        if (replaying.has(el)) { replaying.delete(el); return; }
        e.preventDefault();
        e.stopImmediatePropagation();
        ask({
            message: message,
            title: el.getAttribute('data-confirm-title'),
            confirmText: el.getAttribute('data-confirm-yes'),
            danger: el.hasAttribute('data-confirm-danger')
        }).then(function (ok) {
            if (!ok) { return; }
            replaying.add(el);
            // AYNI tıklama: submitter / formaction / doğrulama / sayfa dinleyicileri korunur.
            el.click();
        });
    }, true);
})();
