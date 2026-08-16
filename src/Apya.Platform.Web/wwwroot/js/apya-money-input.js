/* =============================================================================
   APYA MONEY INPUT — Tutar giriş maskesi (yazarken binlik nokta)
   -----------------------------------------------------------------------------
   Kullanım (opt-in): <input data-money-input value="@Model.X" ...>  (type=number DEĞİL)
     • Görünür alan type=text; yazarken "1.234.567,89" olarak biçimlenir (tr-TR).
       Ondalık ayraç YALNIZ virgül; nokta her zaman binlik.
     • VERİ GÜVENLİĞİ: helper, alanın `name`'ini GİZLİ bir input'a taşır ve orada
       HAM invariant değeri ("1234567.89") tutar. Sunucu, bugün type=number'dan
       aldığı değerin AYNISINI alır → binding/kayıt davranışı değişmez. Görünür
       alan gönderilmez.
     • Dinamik satırlar (JS ile eklenen fatura kalemleri):
       apya.moneyInput.upgrade(el) veya apya.moneyInput.scan(container).
   Salt görüntü için: apya-money.js (apya.money.format).
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (window.apya.moneyInput) { return; }

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

    // Görünür biçim: tam kısma binlik '.', ondalık ',' (en çok 2 hane). Ondalık = İLK virgül.
    function formatWhileTyping(raw) {
        var neg = /^\s*-/.test(raw);
        var ci = raw.indexOf(',');
        var intSrc, decSrc, hasDec;
        if (ci === -1) { intSrc = raw; decSrc = ''; hasDec = false; }
        else { intSrc = raw.slice(0, ci); decSrc = raw.slice(ci + 1); hasDec = true; }
        var intDigits = intSrc.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
        var decDigits = decSrc.replace(/\D/g, '').slice(0, 2);
        var grouped = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        var out = (neg ? '-' : '') + (grouped || (hasDec ? '0' : ''));
        if (hasDec) { out += ',' + decDigits; }
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

    function syncHidden(el) {
        var hidden = el.__apyaHidden;
        if (!hidden) { return; }
        var num = parse(el.value);
        var next = isFinite(num) ? String(num) : '';
        if (hidden.value !== next) {
            hidden.value = next;
            hidden.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function onInput(e) {
        var el = e.target;
        var before = el.value;
        var caret = el.selectionStart || 0;
        var digitsBefore = countDigits(before, caret);
        var formatted = formatWhileTyping(before);
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

        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        if (el.name) { hidden.name = el.name; el.removeAttribute('name'); }
        el.parentNode.insertBefore(hidden, el.nextSibling);
        el.__apyaHidden = hidden;

        el.setAttribute('type', 'text');
        el.setAttribute('inputmode', 'decimal');
        el.setAttribute('autocomplete', 'off');

        var initNum = parseInitial(el.value);
        if (isFinite(initNum) && String(el.value).trim() !== '') {
            el.value = formatWhileTyping(numToTrString(initNum));
        }
        syncHidden(el);

        el.addEventListener('input', onInput);
        el.addEventListener('blur', function () { syncHidden(el); });
    }

    function scan(root) {
        (root || document).querySelectorAll('input[data-money-input]').forEach(upgrade);
    }

    window.apya.moneyInput = { upgrade: upgrade, scan: scan, parse: parse, parseInitial: parseInitial, format: formatWhileTyping };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { scan(document); });
    } else {
        scan(document);
    }
})();
