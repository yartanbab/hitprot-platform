/* =============================================================================
   APYA DIRTY GUARD — kaydedilmemiş değişiklik koruması (Razor / jQuery sayfaları)
   -----------------------------------------------------------------------------
   Neden: düz POST formlarında ve ABP modallarında kaydetmeden ayrılmak (bağlantı,
   Geri, yenileme, sekme kapatma, pencereyi kapatma) sessizce veri kaybettiriyordu
   (RES-08); ABP'nin modal kapatma kontrolü ise dokunulmamış formda "Kaydedilmemiş
   değişiklikler var" diye soruyordu (RSP-05): anlık görüntüyü tutar maskesi ve
   sayfa betikleri alanları doldurmadan ÖNCE alıyordu.

   İşaretleme
     <form data-dirty-guard>            yüklenince kendiliğinden izlenir
     <form data-dirty-guard="dirty">    kirli başlar (sunucu doğrulama hatasıyla
                                        geri basılan form); reset()'e kadar kirli
     [data-dirty-ignore]                içindeki alanlar sayılmaz (anında kaydolan bölüm)
     [data-dirty-bypass]                bu gönderen düğme / bağlantı uyarısız ayrılır
     kapsam öğesinde .is-dirty          kirliyken (rozet / düğme görünürlüğü CSS'te)

   API
   apya.dirtyGuard.watch(kapsam, { snapshot?, isDirty?, modal?, dispose? })
       → { scope, isDirty(), reset(), refresh(), confirmDiscard(), dispose() }
     Aynı kapsam için yeniden çağrılırsa var olan korumayı döndürür (seçenekleri
     günceller, temeli yeniler). Kapsamı DOM'dan düşen koruma kendiliğinden düşer.
       snapshot: () => string   DOM dışı durum (menü düzeni, parametre DTO'su)
       isDirty:  () => boolean  yüklem: anlık görüntü / jest mantığı devre dışı,
                                reset() etkisiz (Hibe Sihirbazı: bekleyen otomatik kayıt)
       modal:    .modal öğesi   koruma yalnız modal AÇIKKEN sayılır; kirliyken
                                kapatma ortak onayı sorar
       dispose:  true           modal kapanınca koruma kayıttan düşer (AJAX modalı)
   apya.dirtyGuard.isDirty([kapsam])        kapsamsız: herhangi bir etkin koruma
   apya.dirtyGuard.reset([kapsam])          temel = şimdiki durum. Çağır: AJAX kaydı
                                            başarılı (kapatmadan / yönlendirmeden ÖNCE),
                                            editör sunucu verisiyle yeniden boyandı
   apya.dirtyGuard.refresh([kapsam])        .is-dirty'yi yeniden hesapla (olay üretmeyen
                                            programatik değişiklik: sürükle-bırak)
   apya.dirtyGuard.confirmDiscard([kapsam]) → Promise<boolean>; kirli değilse pencere
                                            açmadan true. Kendisi reset / allowUnload
                                            ÇAĞIRMAZ — çağıran karar verir
   apya.dirtyGuard.allowUnload()            SIRADAKİ sayfa ayrılışını serbest bırakır
                                            (1,5 sn içinde ayrılış olmazsa düşer)
   apya.dirtyGuard.isUnloadAllowed()        → boolean; React korumaları (useDirtyGuard)
                                            kendi beforeunload'larında buna bakar

   "EL DEĞMEMİŞ" KURALI
   Koruma kayıt anında temel alır ama el değmemiş sayılır ve HİÇBİR ZAMAN kirli
   değildir. Kapsam içindeki ilk kullanıcı jestinde (pointerdown / keydown /
   beforeinput — değer değişmeden ÖNCE) temel O ANKİ durumdan yeniden alınır.
   Jestten önceki her programatik değişiklik (tutar maskesi, zincirli seçim,
   select2 / datepicker kurulumu, API'den doldurma) kirli SAYILMAZ; sayfa
   betiklerinin işbirliği gerekmez. Sonrasında kirli = anlık görüntü ≠ temel
   (eski değere dönülürse temiz). ADSIZ alanlar da sayılır (hibe formları yalnız
   id taşıyor).

   AYRILIŞ
   • beforeunload yalnız bir koruma silahlıyken bağlıdır (el değmemiş sayfada
     dinleyici yok: bfcache etkilenmez).
   • Uygulama içi bağlantı: kirliyken ortak onay; "Değişiklikleri at" → gidilir.
   • Kendiliğinden izin: korunan formun kendi gönderimi (engellenmemişse ve gönderen
     düğmede formaction yoksa), data-dirty-bypass, başka sekmede giriş / çıkış
     (ABP auth-state sekme yenilemesi). formaction'lı gönderen (kaydetmeyen
     alternatif eylem) ve BAŞKA formun gönderimi izin almaz: tarayıcı sorar.
   • Oturum penceresinde "Giriş sayfasına git" ve "Sayfayı yenile"
     (ajax-error-detail.js) allowUnload çağırır: pencere kaybı zaten söyledi.

   ABP MODALLARI
   $.fn.needConfirmationOnUnsavedClose bu dosyada EZİLİR (ABP ile aynı ad / imza;
   ModalManager çağrı anında arar): tüm <abp-modal> formları ortak korumayı kullanır.
   form[data-check-form-on-close="false"] aynen çalışır (eklenti hiç çağrılmaz).
   ABP yükseltmesinde ModalManager eklentiyi çağırmayı bırakırsa sessizce ABP
   davranışına dönülür: canlıda yeniden doğrulanmalı.

   Global demette ABP tema demetinden ve ajax-error-detail.js'ten SONRA yüklenir
   ('storage' dinleyicisi onunkinden sonra kaydolur: oturum akışı olayı kesmişse
   izin verilmez). Çekirdek jQuery GEREKTİRMEZ. Metinler çağrı anında okunur;
   yedekler tr.json ile aynı. Onay penceresi apya.confirm (apya-confirm.js).
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (window.apya.dirtyGuard) { return; }

    var $ = window.jQuery;
    var ALLOW_MS = 1500;
    // ABP'nin sekmeler arası oturum anahtarı (authentication-state-listener.js ile aynı).
    var AUTH_STATE_KEY = 'authentication-state-id';
    var SKIPPED_TYPES = { button: true, submit: true, reset: true, image: true, search: true };

    var guards = [];
    var allowUntil = 0;
    var unloadBound = false;
    var paintTimer = null;
    var pendingConfirm = null;

    function text(key, fallback) {
        try {
            var value = abp.localization.getResource('Platform')(key);
            if (value && value !== key) { return value; }
        } catch (e) { /* yerelleştirme henüz yüklenmedi */ }
        return fallback;
    }

    /* ---------- Anlık görüntü ---------- */
    function fieldValue(el, type) {
        var i, list = [];
        if (type === 'checkbox' || type === 'radio') { return el.value + (el.checked ? ':1' : ':0'); }
        if (type === 'select-multiple') {
            for (i = 0; i < el.options.length; i++) { if (el.options[i].selected) { list.push(el.options[i].value); } }
            return list;
        }
        if (type === 'file') {
            for (i = 0; el.files && i < el.files.length; i++) { list.push(el.files[i].name); }
            return list;
        }
        return el.value;
    }

    function defaultSnapshot(scope) {
        var fields = scope.querySelectorAll('input, select, textarea');
        var parts = [];
        for (var i = 0; i < fields.length; i++) {
            var el = fields[i];
            var type = String(el.type || '').toLowerCase();
            if (SKIPPED_TYPES[type] || el.classList.contains('select2-search__field') || el.closest('[data-dirty-ignore]')) { continue; }
            // Adsız ve id'siz alan SAYILANLAR arasındaki sırasıyla anahtarlanır: atlanan bir alanın
            // (select2 arama kutusu) eklenip çıkması sonrakileri kaydırmaz.
            parts.push([el.name || el.id || parts.length, fieldValue(el, type)]);
        }
        return JSON.stringify(parts);
    }

    function snap(g) {
        return g.snapshot ? String(g.snapshot()) : defaultSnapshot(g.scope);
    }

    /* ---------- Kayıt ---------- */
    // Kapsamı DOM'dan düşmüş korumalar (ABP modal kabı, yeniden çizilen bölüm) ayıklanır.
    function live() {
        var kept = guards.filter(function (g) { return g.scope.isConnected; });
        if (kept.length !== guards.length) {
            guards = kept;
            syncUnload();
        }
        return guards;
    }

    function find(scope) {
        var list = live();
        for (var i = 0; i < list.length; i++) { if (list[i].scope === scope) { return list[i]; } }
        return null;
    }

    function isGuardDirty(g) {
        if (!g.scope.isConnected || (g.modal && !g.open)) { return false; }
        if (g.predicate) { return !!g.predicate(); }
        if (g.forced) { return true; }
        return g.armed && snap(g) !== g.base;
    }

    function anyDirty() {
        return live().some(isGuardDirty);
    }

    function paint(g) {
        g.scope.classList.toggle('is-dirty', isGuardDirty(g));
    }

    function schedulePaint() {
        if (paintTimer) { return; }
        paintTimer = setTimeout(function () {
            paintTimer = null;
            live().forEach(paint);
        }, 0);
    }

    function arm(g, rebase) {
        if (rebase && !g.forced) { g.base = snap(g); }
        g.armed = true;
        syncUnload();
    }

    function resetGuard(g) {
        // Yüklemli korumada kirlilik sayfanın kendi durumudur; buradan temizlenemez.
        if (!g.predicate) {
            g.base = snap(g);
            g.armed = false;
            g.forced = false;
        }
        paint(g);
        syncUnload();
    }

    function removeGuard(g) {
        guards = guards.filter(function (other) { return other !== g; });
        g.scope.classList.remove('is-dirty');
        if (g.modal) {
            g.modal.removeEventListener('shown.bs.modal', g.onShown);
            g.modal.removeEventListener('hide.bs.modal', g.onHide);
            g.modal.removeEventListener('hidden.bs.modal', g.onHidden);
        }
        syncUnload();
    }

    function bindModal(g, modal) {
        g.modal = modal;
        // Zaten gösterilen pencereye bağlanılıyorsa (çağıran kendi shown işleyicisinden çağırdı) açık sayılır.
        g.open = modal.classList.contains('show');
        // Açılış animasyonu boyunca ve shown'daki kurulumlar (tutar maskesi, ilk alana odak)
        // bitene kadar jest sayılmaz; temel bir sonraki görevde alınır.
        g.onShown = function (e) {
            if (e.target !== modal) { return; }
            setTimeout(function () {
                g.open = true;
                if (!g.predicate) { g.base = snap(g); g.armed = false; }
                syncUnload();
            }, 0);
        };
        // Bootstrap 5 yerel olayın defaultPrevented'ına bakar: dinleyici yerel olmalı.
        g.onHide = function (e) {
            if (e.target !== modal || !isGuardDirty(g)) { return; }
            e.preventDefault();
            confirmDiscard(g).then(function (discard) {
                if (!discard) { return; }
                resetGuard(g);
                var instance = window.bootstrap && bootstrap.Modal && bootstrap.Modal.getInstance(modal);
                if (instance) { instance.hide(); }
            });
        };
        // ABP kabı jQuery aşamasında DOM'dan silse de öğenin kendi dinleyicisi çalışır.
        g.onHidden = function (e) {
            if (e.target !== modal) { return; }
            g.open = false;
            if (g.dispose) { removeGuard(g); } else { resetGuard(g); }
        };
        modal.addEventListener('shown.bs.modal', g.onShown);
        modal.addEventListener('hide.bs.modal', g.onHide);
        modal.addEventListener('hidden.bs.modal', g.onHidden);
    }

    function watch(scope, options) {
        var o = options || {};
        var g = find(scope);
        if (!g) {
            g = { scope: scope, armed: false, forced: scope.getAttribute('data-dirty-guard') === 'dirty', open: true };
            g.api = {
                scope: scope,
                isDirty: function () { return isGuardDirty(g); },
                reset: function () { resetGuard(g); },
                refresh: function () { paint(g); },
                confirmDiscard: function () { return confirmDiscard(g); },
                dispose: function () { removeGuard(g); }
            };
            guards.push(g);
        }
        if (o.snapshot) { g.snapshot = o.snapshot; }
        if (o.isDirty) { g.predicate = o.isDirty; }
        if (o.dispose != null) { g.dispose = !!o.dispose; }
        if (o.modal && !g.modal) { bindModal(g, o.modal); }
        if (!g.predicate) { g.base = snap(g); g.armed = false; }
        paint(g);
        syncUnload();
        return g.api;
    }

    function scoped(scope, action) {
        if (scope) {
            var g = find(scope);
            if (g) { action(g); }
        } else {
            live().slice().forEach(action);
        }
    }

    /* ---------- Sayfadan ayrılma ---------- */
    function isUnloadAllowed() {
        return Date.now() < allowUntil;
    }

    function allowUnload() {
        allowUntil = Date.now() + ALLOW_MS;
    }

    function onBeforeUnload(e) {
        if (isUnloadAllowed()) {
            // İzin tek ayrılışlıktır ama AYNI olayın diğer dinleyicileri (React useDirtyGuard)
            // de görebilsin diye bir sonraki görevde tüketilir.
            setTimeout(function () { allowUntil = 0; }, 0);
            return;
        }
        if (!anyDirty()) { return; }
        e.preventDefault();
        e.returnValue = '';
    }

    // Yalnız gerekince bağlı: sürekli bağlı beforeunload bazı tarayıcılarda bfcache'i kapatır.
    function syncUnload() {
        var needed = live().some(function (g) { return !!g.predicate || g.forced || g.armed; });
        if (needed === unloadBound) { return; }
        unloadBound = needed;
        if (needed) {
            window.addEventListener('beforeunload', onBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', onBeforeUnload);
        }
    }

    /* ---------- Ortak onay ---------- */
    function confirmDiscard(g) {
        if (!(g ? isGuardDirty(g) : anyDirty())) { return Promise.resolve(true); }
        // Açık bir onay varken ikinci çağrı aynı sözü döndürür (tek pencere).
        if (pendingConfirm) { return pendingConfirm; }
        var title = text('Common:Unsaved:Title', 'Kaydedilmemiş değişiklikleriniz var');
        var answer;
        if (typeof window.apya.confirm === 'function') {
            // danger: başlangıç odağı "Düzenlemeye devam et"te — Enter veri kaybettirmez.
            answer = window.apya.confirm({
                title: title,
                message: text('Common:Unsaved:Body', 'Devam ederseniz kaydetmediğiniz değişiklikler kaybolur.'),
                confirmText: text('Common:Unsaved:Discard', 'Değişiklikleri at'),
                cancelText: text('Common:Unsaved:Stay', 'Düzenlemeye devam et'),
                danger: true
            });
        } else if (window.abp && abp.message && abp.message.confirm) {
            answer = abp.message.confirm(
                text('Common:Unsaved:LeaveConfirm', 'Devam ederseniz kaydetmediğiniz değişiklikler kaybolur. Yine de devam edilsin mi?'),
                title);
        } else {
            answer = false;
        }
        // jQuery 4 Deferred'da .finally yok; ret dalı "kal" sayılır.
        pendingConfirm = Promise.resolve(answer).then(
            function (ok) { pendingConfirm = null; return !!ok; },
            function () { pendingConfirm = null; return false; });
        return pendingConfirm;
    }

    /* ---------- Dinleyiciler ---------- */
    // İlk jest: değer değişmeden ÖNCE gelen olaylar. Temel o anki durumdan alınır.
    function onGesture(e) {
        var target = e.target;
        guards.forEach(function (g) {
            if (g.predicate || g.armed || (g.modal && !g.open) || !g.scope.contains(target)) { return; }
            arm(g, true);
        });
    }

    function onChange(e) {
        var target = e.target;
        var touched = false;
        guards.forEach(function (g) {
            if (!g.scope.contains(target)) { return; }
            touched = true;
            // Güvenlik ağı: jest görülmeden gelen GÜVENİLİR değişiklik (tarayıcı otomatik
            // doldurma, sesle yazma) de silahlar; temel kayıt anındaki kalır.
            if (e.isTrusted && e.type !== 'click' && !g.predicate && !g.armed && !(g.modal && !g.open)) { arm(g, false); }
        });
        if (touched) { schedulePaint(); }
    }

    ['pointerdown', 'keydown', 'beforeinput'].forEach(function (name) {
        document.addEventListener(name, onGesture, true);
    });
    ['input', 'change', 'click'].forEach(function (name) {
        document.addEventListener(name, onChange, true);
    });

    function related(a, b) {
        return a === b || a.contains(b) || b.contains(a);
    }

    // window'da: belge düzeyindeki işleyicilerden (doğrulama, AJAX formu) SONRA çalışır,
    // "engellendi mi" bilgisi kesindir. jQuery varsa onun olayı dinlenir: .trigger('submit')
    // ile gelen gönderim yerel olay üretmez.
    function onSubmit(e) {
        var prevented = typeof e.isDefaultPrevented === 'function' ? e.isDefaultPrevented() : e.defaultPrevented;
        if (prevented) { return; }
        var form = e.target;
        var submitter = (e.originalEvent || e).submitter || null;
        if (submitter && submitter.hasAttribute('data-dirty-bypass')) { allowUnload(); return; }
        // Kaydetmeyen alternatif eylem (formaction): form kirliyse tarayıcı sorar.
        if (submitter && submitter.hasAttribute('formaction')) { return; }
        if (form && form.nodeType === 1 && live().some(function (g) { return related(g.scope, form); })) { allowUnload(); }
    }

    if ($ && $.fn) {
        $(window).on('submit', onSubmit);
    } else {
        window.addEventListener('submit', onSubmit);
    }

    // Kabarcık aşaması, window: sayfanın kendi tıklama işleyicileri önce karar verir.
    window.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) { return; }
        var target = a.getAttribute('target');
        var href = a.getAttribute('href');
        if ((target && target.toLowerCase() !== '_self') || !href || href.charAt(0) === '#') { return; }
        // javascript: bağlantısı düğme gibi kullanılır ve sayfadan ayrılmaz: izin de onay da yok.
        if (a.protocol === 'javascript:') { return; }
        // İndirme, bilerek işaretlenmiş bağlantı ve mailto: / tel: tarayıcıda beforeunload üretir.
        if (a.hasAttribute('download') || a.hasAttribute('data-dirty-bypass') || !/^https?:$/.test(a.protocol)) {
            allowUnload();
            return;
        }
        // Aynı belge içi hash: sayfadan ayrılmaz.
        if (a.hash && a.pathname === location.pathname && a.search === location.search) { return; }
        if (!anyDirty()) { return; }
        e.preventDefault();
        confirmDiscard().then(function (discard) {
            if (!discard) { return; }
            allowUnload();
            location.assign(a.href);
        });
    });

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) { allowUntil = 0; }
    });

    // Başka sekmede giriş / çıkış: ABP dinleyicisi bu sekmeyi yeniler ya da köke yollar;
    // kullanıcı o an hiçbir şeyi seçemez, tarayıcı uyarısı sekmeyi askıda bırakırdı.
    // ajax-error-detail.js'in dinleyicisi önce kayıtlıdır: oturum akışı olayı kesmişse
    // (stopImmediatePropagation) buraya hiç gelmez.
    window.addEventListener('storage', function (e) {
        if (e.key === AUTH_STATE_KEY && e.oldValue !== e.newValue) { allowUnload(); }
    }, true);

    window.apya.dirtyGuard = {
        watch: watch,
        isDirty: function (scope) {
            if (!scope) { return anyDirty(); }
            var g = find(scope);
            return !!g && isGuardDirty(g);
        },
        reset: function (scope) { scoped(scope, resetGuard); },
        refresh: function (scope) { scoped(scope, paint); },
        confirmDiscard: function (scope) {
            if (!scope) { return confirmDiscard(null); }
            var g = find(scope);
            return g ? confirmDiscard(g) : Promise.resolve(true);
        },
        allowUnload: allowUnload,
        isUnloadAllowed: isUnloadAllowed
    };

    function scan() {
        var marked = document.querySelectorAll('[data-dirty-guard]');
        for (var i = 0; i < marked.length; i++) { watch(marked[i]); }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scan);
    } else {
        scan();
    }

    /* ---------- ABP modalları: kapatma kontrolünün devri (RSP-05) ---------- */
    // ABP'den farkı: temel shown anında değil ilk kullanıcı jestinde alınır; adsız alanlar
    // da sayılır; açık modal formu kirliyken Geri / yenileme de uyarır (RES-08).
    if ($ && $.fn) {
        $.fn.needConfirmationOnUnsavedClose = function ($modal) {
            var modal = $modal[0];
            var guard = watch(this.length === 1 ? this[0] : modal, { modal: modal, dispose: true });
            // ModalManager'ın kendi abp-ajax-success işleyicisinden (modal('hide')) ÖNCE
            // kaydolur: kayıt sonrası kapanış sorulmaz.
            this.on('abp-ajax-success', function () { guard.reset(); });
            return this;
        };
    }
})();
