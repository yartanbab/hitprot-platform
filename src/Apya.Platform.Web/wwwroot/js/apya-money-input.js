/* =============================================================================
   APYA MONEY INPUT — Tutar giriş maskesi (yazarken binlik nokta)
   -----------------------------------------------------------------------------
   Kullanım (opt-in): <input data-money-input value="@Model.X" ...>
     • Görünür alan type=text; yazarken "1.234.567,89" olarak biçimlenir (tr-TR).
       Ondalık ayraç YALNIZ virgül; nokta her zaman binlik.
     • VERİ GÜVENLİĞİ: helper, alanın `name`'ini GİZLİ bir input'a taşır ve ham
       değeri orada tutar. Görünür alan sunucuya gönderilmez.

       🔴 Ham değerin BİÇİMİ alanın __Invariant işaretçisine göre seçilir:
          işaretçi VAR → "1234.56" (ASP.NET o alanı invariant kültürle çözer)
          işaretçi YOK → "1234,56" (alan tr-TR ile çözülür; NOKTA BİNLİK sayılır)
       Sabit noktalı yazmak, işaretçisi olmayan alanda 1000× sapma üretiyordu;
       artık işaretçi çalışma anında aranıyor. Bkz. DecimalInputBinding_Tests.

     • Alan başına ayar:
         data-decimals="N"   ondalık hane sınırı (varsayılan 2)
                             🔴 alanın DB ölçeğinden KÜÇÜK verme: gösterim
                             kırpılır ve kırpılmış değer kaydedilir.
                             Para decimal(18,2) → 2 · kur decimal(18,6) → 6
         data-group="false"  binlik ayracını kapat (oran/yüzde alanları)

     • Markup'taki `min` OKUNUR: min >= 0 ise eksi işareti kabul edilmez.
       Alan type="text"e döndüğü ve `name`'ini kaybettiği için ne tarayıcı ne de
       jQuery validate bu kısıtı artık uygulayabiliyor — maske sürdürüyor.

     • Dinamik satırlar (JS ile eklenen fatura kalemleri):
       apya.moneyInput.upgrade(el) veya apya.moneyInput.scan(container).
   Salt görüntü için: apya-money.js (apya.money.format).
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (window.apya.moneyInput) { return; }

    var DEFAULT_DECIMALS = 2;

    // tr-maskeli değer -> Number. Ondalık = virgül; noktalar (binlik) atılır. "1.234.567,89" -> 1234567.89
    function parse(masked) {
        if (masked === null || masked === undefined) { return NaN; }
        var s = String(masked).trim();
        if (s === '') { return NaN; }
        var neg = s.charAt(0) === '-';
        s = s.replace(/[^\d,]/g, '');           // yalnız rakam + virgül (nokta = binlik, atılır)
        var ci = s.indexOf(',');
        var intp, decp;
        if (ci === -1) { intp = s; decp = ''; }
        else { intp = s.slice(0, ci).replace(/,/g, ''); decp = s.slice(ci + 1).replace(/,/g, ''); }
        var num = Number((intp || '0') + (decp ? '.' + decp : ''));
        if (!isFinite(num)) { return NaN; }
        return neg ? -num : num;
    }

    // Sunucudan gelen ilk değer invariant olabilir ("1000.5"); virgül varsa tr-maske say.
    function parseInitial(val) {
        var s = String(val).trim();
        if (s === '') { return NaN; }
        if (s.indexOf(',') !== -1) { return parse(s); }
        var neg = s.charAt(0) === '-';
        var num = Number(s.replace(/[^\d.]/g, ''));  // nokta = ondalık (invariant)
        if (!isFinite(num)) { return NaN; }
        return neg ? -num : num;
    }

    // Görünür biçim: tam kısma binlik '.', ondalık ','. Ondalık = İLK virgül.
    function formatWhileTyping(raw, decimals, group, allowNegative) {
        var dec = (decimals === undefined || decimals === null) ? DEFAULT_DECIMALS : decimals;
        var grouped = group !== false;
        var src = String(raw);
        var neg = allowNegative !== false && /^\s*-/.test(src);
        var ci = src.indexOf(',');
        var intSrc, decSrc, hasDec;
        if (ci === -1) { intSrc = src; decSrc = ''; hasDec = false; }
        else { intSrc = src.slice(0, ci); decSrc = src.slice(ci + 1); hasDec = true; }
        var intDigits = intSrc.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
        var decDigits = decSrc.replace(/\D/g, '').slice(0, dec);
        var intOut = grouped ? intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : intDigits;
        var out = (neg ? '-' : '') + (intOut || (hasDec ? '0' : ''));
        if (hasDec && dec > 0) { out += ',' + decDigits; }
        return out;
    }
    function numToTrString(num) { return String(num).replace('.', ','); }

    function countDigits(str, upto) {
        var n = 0;
        for (var i = 0; i < upto && i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c >= 48 && c <= 57) { n++; }
        }
        return n;
    }
    function indexAfterNthDigit(str, n) {
        if (n <= 0) { return 0; }
        var seen = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c >= 48 && c <= 57) { seen++; if (seen === n) { return i + 1; } }
        }
        return str.length;
    }

    // ASP.NET, invariant kültürle çözülecek alanların ADINI gizli __Invariant
    // alanlarında listeler. Bu ad için işaretçi aynı formda var mı?
    // Form yoksa belgeye düşeriz; o durumda başka formdaki aynı adlı alanın
    // işaretçisi yanlış eşleşebilir — maskeli alan bir form içinde olmalı.
    function hasInvariantMarker(el, name) {
        if (!name) { return false; }
        var scope = el.form || document;
        var markers = scope.querySelectorAll('input[name="__Invariant"]');
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].value === name) { return true; }
        }
        return false;
    }

    function optionsOf(el) {
        var d = parseInt(el.getAttribute('data-decimals'), 10);
        if (!isFinite(d) || d < 0 || d > 8) { d = DEFAULT_DECIMALS; }

        // Alan type="text"e döndüğü için markup'taki min= artık tarayıcıya bir şey
        // ifade etmiyor; yazarın niyetini burada sürdürüyoruz. min >= 0 ise eksi
        // işareti kabul edilmez. (Alan `name`'ini kaybettiği için jQuery validate
        // de bu kısıtı uygulamıyordu — sessizce negatif tutar girilebiliyordu.)
        var min = parseFloat(el.getAttribute('min'));
        return {
            decimals: d,
            group: el.getAttribute('data-group') !== 'false',
            allowNegative: !(isFinite(min) && min >= 0)
        };
    }

    // Gizli alana yazılacak ham değer: işaretçi varsa invariant (nokta), yoksa tr (virgül).
    function rawValueFor(el, num) {
        var s = String(num);
        return el.__apyaInvariant ? s : s.replace('.', ',');
    }

    function syncHidden(el) {
        var hidden = el.__apyaHidden;
        if (!hidden) { return; }
        var num = parse(el.value);
        var next = isFinite(num) ? rawValueFor(el, num) : '';
        if (hidden.value !== next) {
            hidden.value = next;
            hidden.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function onInput(e) {
        var el = e.target;
        var opts = el.__apyaOpts;
        var before = el.value;
        var caret = el.selectionStart || 0;
        var digitsBefore = countDigits(before, caret);
        var formatted = formatWhileTyping(before, opts.decimals, opts.group, opts.allowNegative);
        if (formatted !== before) {
            el.value = formatted;
            var pos = indexAfterNthDigit(formatted, digitsBefore);
            try { el.setSelectionRange(pos, pos); } catch (err) { /* yoksay */ }
        }
        syncHidden(el);
    }

    function upgrade(el) {
        if (!el || el.__apyaMoney) { return; }
        el.__apyaMoney = true;
        el.__apyaOpts = optionsOf(el);

        var name = el.name;
        el.__apyaInvariant = hasInvariantMarker(el, name);

        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        if (name) { hidden.name = name; el.removeAttribute('name'); }
        el.parentNode.insertBefore(hidden, el.nextSibling);
        el.__apyaHidden = hidden;

        el.setAttribute('type', 'text');
        el.setAttribute('inputmode', 'decimal');
        el.setAttribute('autocomplete', 'off');

        var initRaw = String(el.value).trim();
        var initNum = parseInitial(initRaw);
        if (isFinite(initNum) && initRaw !== '') {
            // Sunucunun bastığı ondalık haneyi KORU: sayıya çevirip geri yazmak
            // "0,00" alanını "0" yapar (ondalık alan decimal(18,2) olsa bile).
            var trSrc = initRaw.indexOf(',') !== -1 ? initRaw : numToTrString(initNum);
            el.value = formatWhileTyping(trSrc, el.__apyaOpts.decimals, el.__apyaOpts.group, el.__apyaOpts.allowNegative);
        }
        syncHidden(el);

        el.addEventListener('input', onInput);
        el.addEventListener('blur', function () { syncHidden(el); });
    }

    function scan(root) {
        (root || document).querySelectorAll('input[data-money-input]').forEach(upgrade);
    }

    // JS ile doldurulan/okunan alanlar için (name taşımayan, değeri API'ye giden
    // hibe ekranları). Ham .val() maskeli metin döndürür — okurken getValue,
    // yazarken setValue kullan; yoksa "1.234,56" API'ye olduğu gibi gider.
    function setValue(el, value) {
        if (!el) { return; }
        var opts = el.__apyaOpts || { decimals: DEFAULT_DECIMALS, group: true, allowNegative: true };
        var num = (value === null || value === undefined || value === '') ? NaN : Number(value);
        el.value = isFinite(num) ? formatWhileTyping(numToTrString(num), opts.decimals, opts.group, opts.allowNegative) : '';
        syncHidden(el);
    }

    // Maskeli alanda tr çözümü, maskesiz alanda ham sayı. Boş/geçersiz -> null.
    function getValue(el) {
        if (!el) { return null; }
        var s = String(el.value == null ? '' : el.value).trim();
        if (s === '') { return null; }
        var num = el.__apyaMoney ? parse(s) : Number(s);
        return isFinite(num) ? num : null;
    }

    window.apya.moneyInput = {
        upgrade: upgrade, scan: scan, parse: parse, parseInitial: parseInitial,
        format: formatWhileTyping, setValue: setValue, getValue: getValue
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { scan(document); });
    } else {
        scan(document);
    }

    // 🔴 Tutar alanlarının ÇOĞU AJAX ile yüklenen ABP modallarında; yukarıdaki
    // scan(document) onları göremez, çünkü sayfa açılırken DOM'da yoklar.
    // Bootstrap açılışı bildirdiğinde modalın içini tararız.
    // JS ile SONRADAN eklenen satırlar (fatura kalemi, bütçe sihirbazı satırı)
    // bu olayı üretmez; oralarda çağıran kendisi scan(satır) demeli.
    document.addEventListener('shown.bs.modal', function (e) {
        if (e.target && e.target.querySelectorAll) { scan(e.target); }
    });
})();
