/* =============================================================================
   APYA — YENİ GÖREV EKRANI (Tasks/CreateModal)
   -----------------------------------------------------------------------------
   Tasarım kanvasının 1b (sıkı tek kolon) + 1d (hızlı giriş) birleşimi.
   Maket: docs/design/gorev-olustur/yeni-gorev-ekrani.dc.html

   İKİ KATMAN, TEK POST. Hızlı satır ve çipler görsel katmandır; ikisi de modaldaki
   GERÇEK <select>/<input> alanlarını yazar. Böylece ABP'nin form-post hattı, model
   binding'i ve jQuery validate hiç değişmeden çalışır — burada ayrı bir AJAX yolu YOK.

   Ayrıştırıcı (parseQuickLine) BİLEREK saf: DOM'a, jQuery'ye ve tarihe (Date.now)
   dokunmaz, "bugün"ü parametre alır. Testi dynamic-assets/src/quick-task/parser.test.js
   bu dosyayı okuyup çalıştırır — kaynak tek, kopya yok.
   ============================================================================= */
(function (root) {
    'use strict';

    var apya = root.apya = root.apya || {};

    // ── Türkçe katlama ────────────────────────────────────────────────────────
    // toLowerCase() İ'yi "i̇" (i + birleşen nokta) yapar ve eşleşmeyi bozar; harfleri
    // elle katlıyoruz. Aksan da düşer: "Ağu" ile "agu" aynı şeydir.
    function fold(value) {
        return String(value == null ? '' : value)
            .replace(/[İIı]/g, 'i')
            .replace(/[Ğğ]/g, 'g')
            .replace(/[Üü]/g, 'u')
            .replace(/[Şş]/g, 's')
            .replace(/[Öö]/g, 'o')
            .replace(/[Çç]/g, 'c')
            .toLowerCase();
    }

    var PRIORITY_WORDS = {
        dusuk: 1, low: 1, '1': 1,
        orta: 2, normal: 2, medium: 2, '2': 2,
        yuksek: 3, high: 3, '3': 3,
        kritik: 4, acil: 4, critical: 4, '4': 4
    };

    var MONTHS = ['ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran',
                  'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik'];

    // Gün adları — pazartesi = 1 (JS getDay ile aynı; pazar = 0).
    var WEEKDAYS = { pazartesi: 1, sali: 2, carsamba: 3, persembe: 4, cuma: 5, cumartesi: 6, pazar: 0 };

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    /** Date → "YYYY-MM-DD" (input[type=date] biçimi; saat dilimi kaydırmaz). */
    function toIsoDate(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    function addDays(base, days) {
        var d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
        d.setDate(d.getDate() + days);
        return d;
    }

    /**
     * ">" işaretçisinin değerini tarihe çevirir. Desteklenen biçimler:
     *   bugün · yarın · +3g / +3gün · 29.08 · 29.08.2026 · 29/08 · 29 Ağu · perşembe
     * Çözülemeyen değer null döner (satırda metin olarak KALMAZ — token yine yenir,
     * ama tarih set edilmez; kullanıcı çipten düzeltir).
     */
    function parseDate(raw, today) {
        var v = fold(raw).trim();
        if (!v) { return null; }

        if (v === 'bugun') { return toIsoDate(today); }
        if (v === 'yarin') { return toIsoDate(addDays(today, 1)); }
        if (v === 'obur gun' || v === 'oburgun') { return toIsoDate(addDays(today, 2)); }

        var rel = v.match(/^\+(\d{1,3})\s*(?:g|gun)?$/);
        if (rel) { return toIsoDate(addDays(today, parseInt(rel[1], 10))); }

        // 29.08 / 29.08.2026 / 29/8/26
        var numeric = v.match(/^(\d{1,2})[.\/](\d{1,2})(?:[.\/](\d{2,4}))?$/);
        if (numeric) {
            var day = parseInt(numeric[1], 10);
            var month = parseInt(numeric[2], 10) - 1;
            var year = numeric[3] ? parseInt(numeric[3], 10) : today.getFullYear();
            if (year < 100) { year += 2000; }
            return buildDate(year, month, day, numeric[3] ? null : today);
        }

        // 29 Ağu / 29 Ağustos — ay adı ön ekle eşleşir (en az 3 harf).
        var named = v.match(/^(\d{1,2})\s+([a-z]{3,})$/);
        if (named) {
            var idx = monthIndex(named[2]);
            if (idx < 0) { return null; }
            return buildDate(today.getFullYear(), idx, parseInt(named[1], 10), today);
        }

        if (Object.prototype.hasOwnProperty.call(WEEKDAYS, v)) {
            return toIsoDate(nextWeekday(today, WEEKDAYS[v]));
        }

        return null;
    }

    function monthIndex(prefix) {
        for (var i = 0; i < MONTHS.length; i++) {
            if (MONTHS[i].indexOf(prefix) === 0) { return i; }
        }
        return -1;
    }

    /**
     * Yıl verilmediyse geçmişe düşen tarih GELECEK yıla taşınır: "29 Ağu" ocak ayında
     * yazıldığında bu yılın ağustosunu, eylülde yazıldığında gelecek yılı gösterir.
     */
    function buildDate(year, month, day, rollFrom) {
        var d = new Date(year, month, day);
        if (d.getMonth() !== month || d.getDate() !== day) { return null; } // 31 Şubat vb.
        if (rollFrom && d < new Date(rollFrom.getFullYear(), rollFrom.getMonth(), rollFrom.getDate())) {
            d = new Date(year + 1, month, day);
        }
        return toIsoDate(d);
    }

    function nextWeekday(today, target) {
        var delta = (target - today.getDay() + 7) % 7;
        return addDays(today, delta === 0 ? 7 : delta);
    }

    /** "@ahmet" → kullanıcı listesinde ön ek eşleşmesi; tek aday varsa seçer. */
    function matchUser(term, users) {
        var f = fold(term);
        if (!f) { return null; }
        var hits = (users || []).filter(function (u) { return fold(u.name).indexOf(f) === 0; });
        if (hits.length !== 1) {
            // Ön ekte tek aday yoksa "içinde geçen"e düş — "@yakup" ile "Yakup B." tutar.
            hits = (users || []).filter(function (u) { return fold(u.name).indexOf(f) >= 0; });
        }
        return hits.length === 1 ? hits[0] : null;
    }

    /**
     * Hızlı giriş satırını ayrıştırır. SAF: bugünü çağıran verir.
     *
     * @param {string} text   ham satır
     * @param {object} lookups {users:[{id,name}], tags:[string]}
     * @param {Date}   today
     * @returns {{title:string, assigneeId:?string, assigneeName:?string, tags:string[],
     *            priority:?number, dueDate:?string, isPrivate:boolean}}
     */
    function parseQuickLine(text, lookups, today) {
        lookups = lookups || {};
        today = today || new Date();

        var result = {
            title: '', assigneeId: null, assigneeName: null,
            tags: [], priority: null, dueDate: null, isPrivate: false
        };
        var rest = String(text == null ? '' : text);

        // ">" ÖNCE yenir: değeri boşluk içerebilir ("29 Ağu"), diğer işaretçilerin
        // tek-sözcük kuralına sokulamaz. İki sözcüklü biçim YALNIZ ay adlarıyla eşleşir —
        // "\d+ \S+" desen olsaydı ">5 kişilik" gibi bir yazımda başlıktan sözcük yerdi.
        rest = rest.replace(
            />\s*(\d{1,2}[.\/]\d{1,2}(?:[.\/]\d{2,4})?|\d{1,2}\s+(?:oca|şub|sub|mar|nis|may|haz|tem|ağu|agu|eyl|eki|kas|ara)[a-zçğıöşü]*|\+\d{1,3}\s*(?:g|gün|gun)?|[^\s]+)/gi,
            function (match, value) {
                if (result.dueDate === null) {
                    result.dueDate = parseDate(value, today);
                }
                return ' ';
            });

        rest = rest.replace(/(^|\s)@([^\s]+)/g, function (match, lead, name) {
            var user = matchUser(name, lookups.users);
            if (user && !result.assigneeId) {
                result.assigneeId = user.id;
                result.assigneeName = user.name;
            }
            return ' ';
        });

        rest = rest.replace(/(^|\s)#([^\s]+)/g, function (match, lead, tag) {
            var known = (lookups.tags || []).filter(function (t) { return fold(t) === fold(tag); });
            var name = known.length ? known[0] : tag;   // bilinen etiketin YAZIMI korunur
            if (result.tags.indexOf(name) < 0) { result.tags.push(name); }
            return ' ';
        });

        rest = rest.replace(/(^|\s)!([^\s]+)/g, function (match, lead, word) {
            var p = PRIORITY_WORDS[fold(word)];
            if (p && !result.priority) { result.priority = p; }
            return ' ';
        });

        rest = rest.replace(/(^|\s)~(gizli|private)?(?=\s|$)/gi, function () {
            result.isPrivate = true;
            return ' ';
        });

        result.title = rest.replace(/\s+/g, ' ').trim();
        return result;
    }

    // ── DOM katmanı ───────────────────────────────────────────────────────────
    // Buradan aşağısı tarayıcıya bağımlıdır; testler yalnız yukarısını çağırır.

    var STATUS_LABELS = { '0': 'İptal', '1': 'Bekliyor', '2': 'Sürüyor', '3': 'Testte', '4': 'Tamamlandı' };
    var MONTH_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    /** "2026-08-22" + "2026-08-29" → "22 – 29 Ağu" (aynı ay) / "22 Ağu – 3 Eyl" */
    function formatRange(startIso, dueIso) {
        var s = parseIso(startIso);
        var d = parseIso(dueIso);
        if (!s && !d) { return 'Tarih'; }
        if (!d) { return shortDate(s); }
        if (!s) { return shortDate(d); }
        if (s.getMonth() === d.getMonth() && s.getFullYear() === d.getFullYear()) {
            return s.getDate() + ' – ' + d.getDate() + ' ' + MONTH_SHORT[d.getMonth()];
        }
        return shortDate(s) + ' – ' + shortDate(d);
    }

    function parseIso(value) {
        var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
        return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
    }

    function shortDate(d) { return d.getDate() + ' ' + MONTH_SHORT[d.getMonth()]; }

    function readLookups() {
        var el = document.getElementById('TaskQuickLookups');
        if (!el) { return { users: [], tags: [] }; }
        try { return JSON.parse(el.textContent) || { users: [], tags: [] }; }
        catch (e) { return { users: [], tags: [] }; }
    }

    /** Gerçek alanların değerlerini okuyup çip etiketlerini tazeler. */
    function refreshChips($form) {
        $form.find('[data-chip-source]').each(function () {
            var $src = $(this);
            var kind = $src.data('chip-source');
            var $chip = $form.find('[data-chip="' + kind + '"]');
            if (!$chip.length) { return; }
            var $label = $chip.find('[data-chip-label]');

            if (kind === 'status') {
                var raw = String($src.val() || '');
                var text = $src.find('option:selected').text();
                $label.text(text || STATUS_LABELS[raw.replace('s:', '')] || 'Durum');
                $chip.attr('data-value', raw);
            } else if (kind === 'priority') {
                $label.text($src.find('option:selected').text());
                $chip.attr('data-value', String($src.val() || ''));
            } else if (kind === 'assignee' || kind === 'project') {
                // Boş hâlin metni ilk çizimde saklanır; sonraki tazelemelerde ona dönülür.
                if ($label.data('empty') === undefined) { $label.data('empty', $label.text()); }
                var val = $src.val();
                $label.text(val ? $src.find('option:selected').text() : $label.data('empty'));
                $chip.toggleClass('is-set', !!val);
            } else if (kind === 'private') {
                $chip.toggleClass('is-set', $src.is(':checked'));
            } else if (kind === 'tags') {
                var tags = $src.val() || [];
                $label.text(tags.length ? tags.join(', ') : 'Etiket');
                $chip.toggleClass('is-set', tags.length > 0);
            }
        });

        var $chipDates = $form.find('[data-chip="dates"]');
        if ($chipDates.length) {
            $chipDates.find('[data-chip-label]').text(formatRange(
                $form.find('[data-chip-source="startDate"]').val(),
                $form.find('[data-chip-source="dueDate"]').val()));
        }
    }

    /** Ayrıştırma sonucunu gerçek alanlara yazar (yalnız DOLU olanları — boş token siler değil). */
    function applyToForm($form, parsed) {
        $form.find('#Task_Title').val(parsed.title);

        if (parsed.assigneeId) { $form.find('[data-chip-source="assignee"]').val(parsed.assigneeId); }
        if (parsed.priority) { $form.find('[data-chip-source="priority"]').val(String(parsed.priority)); }
        if (parsed.dueDate) { $form.find('[data-chip-source="dueDate"]').val(parsed.dueDate); }
        $form.find('#Task_IsPrivate').prop('checked', parsed.isPrivate);

        if (parsed.tags.length) {
            var $tags = $form.find('#TaskTagsSelect');
            parsed.tags.forEach(function (tag) {
                if (!$tags.find('option[value="' + tag.replace(/"/g, '\\"') + '"]').length) {
                    $tags.append(new Option(tag, tag, true, true));
                }
            });
            $tags.val(parsed.tags).trigger('change.select2');
        }

        refreshChips($form);
    }

    /** Hızlı satırın altındaki canlı çip önizlemesi. */
    function renderPreview($preview, parsed) {
        var chips = [];
        if (parsed.priority) { chips.push({ cls: 'p' + parsed.priority, text: ['', 'Düşük', 'Orta', 'Yüksek', 'Kritik'][parsed.priority] }); }
        if (parsed.assigneeName) { chips.push({ cls: 'user', text: parsed.assigneeName }); }
        if (parsed.dueDate) { chips.push({ cls: 'date', text: shortDate(parseIso(parsed.dueDate)) }); }
        parsed.tags.forEach(function (t) { chips.push({ cls: 'tag', text: t }); });
        if (parsed.isPrivate) { chips.push({ cls: 'private', text: 'Gizli' }); }

        $preview.empty().prop('hidden', chips.length === 0);
        chips.forEach(function (c) {
            $preview.append($('<span/>').addClass('apya-tc-pchip apya-tc-pchip-' + c.cls).text(c.text));
        });
    }

    function init($form) {
        var lookups = readLookups();
        var $root = $form.find('.apya-tc');
        var $quick = $form.find('#TaskQuickLine');
        var $preview = $form.find('#TaskQuickPreview');
        var $formLayer = $form.find('#TaskCreateForm');

        refreshChips($form);

        // Çip açılırındaki alan değişince etiket tazelensin (select2 dahil).
        $form.on('change', '[data-chip-source]', function () { refreshChips($form); });

        // Hızlı satır → gerçek alanlar (tek yönlü: formda yapılan düzeltme ezilmez).
        if ($quick.length) {
            $quick.on('input', function () {
                var parsed = parseQuickLine($quick.val(), lookups, new Date());
                renderPreview($preview, parsed);
                applyToForm($form, parsed);
            });

            // TAB: satırdan forma in. Tarayıcının odak sırası yerine BİLEREK ele alınıyor —
            // maketteki "TAB ile detaya in" davranışı bu.
            $quick.on('keydown', function (e) {
                if (e.key === 'Tab' && !e.shiftKey && $formLayer.attr('data-collapsed') === 'true') {
                    e.preventDefault();
                    expandForm();
                }
            });
        }

        function expandForm() {
            $formLayer.attr('data-collapsed', 'false');
            $form.find('#Task_Title').trigger('focus');
        }

        // Chevron / "Daha fazla" — planlama alanları izinliyse çizilmiş olur.
        $form.on('click', '#TaskMoreToggle', function () {
            var $panel = $form.find('#TaskPlanning');
            var open = !$panel.prop('hidden');
            $panel.prop('hidden', open);
            $(this).attr('aria-expanded', String(!open));
        });

        // ⌘↵ / Ctrl+↵ — modalın kaydet düğmesine bas (ABP'nin kendi hattı çalışsın).
        $root.on('keydown', function (e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                $form.find('.modal-footer button[type="submit"], .modal-footer .abp-modal-save').first().trigger('click');
            }
        });
    }

    apya.taskCreate = {
        init: init,
        parseQuickLine: parseQuickLine,
        parseDate: parseDate,
        formatRange: formatRange,
        fold: fold
    };
})(typeof window !== 'undefined' ? window : globalThis);
