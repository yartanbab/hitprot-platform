/*
 * wwwroot/js/apya-*.js dosyaları jQuery'yi GLOBAL bekler. Repoda jQuery
 * devDependency YOK (bkz. apyaKanban.test.js / apyaTaskConsole.test.js'teki
 * aynı not) ve tek bir test için paket eklemek istemiyoruz.
 *
 * Bu kabuk, o dosyaların GERÇEKTEN kullandığı yüzeyi jsdom üzerine oturtur —
 * sahte HTML üretmez, gerçek DOM'a yazar. Böylece testler render sonucunu
 * (metin, sınıf, sıra, kaçış) doğrulayabilir.
 *
 * KAPSAM DIŞI: animasyon, ölçüm (offset/width), ajax, efekt. O yüzeyleri
 * kullanan bir bileşen çıkarsa burayı genişletmek yerine testi kapsam dışı
 * bırakmak doğrudur — kabuk büyüdükçe jQuery'nin kendisini yeniden yazmaya
 * başlarız ve test ettiği şey gerçeğe benzemez.
 */

function wrap(nodes) {
    const list = Array.prototype.slice.call(nodes);

    const api = {
        length: list.length,

        html(value) {
            if (value === undefined) { return list[0] ? list[0].innerHTML : ''; }
            list.forEach((n) => { n.innerHTML = value; });
            return api;
        },

        text(value) {
            if (value === undefined) { return list[0] ? list[0].textContent : ''; }
            list.forEach((n) => { n.textContent = value; });
            return api;
        },

        find(selector) {
            const found = [];
            list.forEach((n) => { found.push.apply(found, n.querySelectorAll(selector)); });
            return wrap(found);
        },

        /** Yalnız DELEGE bağlama: $el.on(evt, selector, handler). */
        on(evt, selector, handler) {
            list.forEach((n) => {
                n.addEventListener(evt, (e) => {
                    const match = e.target.closest ? e.target.closest(selector) : null;
                    if (match && n.contains(match)) { handler.call(match, e); }
                });
            });
            return api;
        },

        data(key) {
            const el = list[0];
            if (!el) { return undefined; }
            // jQuery data() camelCase'i tireye çevirir: data('colId') → data-col-id
            const attr = 'data-' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
            return el.getAttribute(attr);
        },

        addClass(c) { list.forEach((n) => n.classList.add(c)); return api; },
        removeClass(c) { list.forEach((n) => n.classList.remove(c)); return api; },
        attr(k, v) {
            if (v === undefined) { return list[0] ? list[0].getAttribute(k) : null; }
            list.forEach((n) => n.setAttribute(k, v));
            return api;
        }
    };

    list.forEach((n, i) => { api[i] = n; });
    return api;
}

export function installJqueryShim() {
    const $ = function (arg) {
        if (typeof arg === 'string') {
            // '<div/>' gibi etiket üretimi — esc() bunu kullanıyor.
            if (arg.charAt(0) === '<') {
                const tag = /^<([a-zA-Z]+)/.exec(arg)[1];
                return wrap([document.createElement(tag)]);
            }
            return wrap(document.querySelectorAll(arg));
        }
        if (arg && arg.nodeType) { return wrap([arg]); }
        return wrap([]);
    };

    $.each = function (collection, fn) {
        if (Array.isArray(collection)) {
            collection.forEach((v, i) => fn(i, v));
        } else {
            Object.keys(collection).forEach((k) => fn(k, collection[k]));
        }
        return collection;
    };

    $.extend = Object.assign;

    global.$ = $;
    global.jQuery = $;
    return $;
}
