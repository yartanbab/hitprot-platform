/* Aktar menüsü — her "Excel'e aktar" düğmesinin (data-transfer-export) yanına aynı küçük menüyü
 * koyar: "CSV'ye aktar" ve "Tüm aktarımlar" (İçe / Dışa Aktarma çalışma alanı). CSV, ekranın kendi
 * dışa aktarmasını — süzgeci ve sıralamasıyla — aynen çalıştırır; yalnız biçim değişir:
 *   - bağlantı        → adresine format=csv eklenir,
 *   - form düğmesi    → forma gizli format alanı konup düğme tıklanır,
 *   - betikli düğme   → window.apyaExportFormat verilip düğme tıklanır (ekranın betiği adrese ekler).
 */
(function () {
    'use strict';

    function l(key) {
        return (window.abp && abp.localization) ? abp.localization.getResource('Platform')(key) : key;
    }

    function exportCsv(control) {
        if (control.tagName === 'A') {
            var href = control.getAttribute('href') || '';
            window.location.href = href + (href.indexOf('?') < 0 ? '?' : '&') + 'format=csv';
            return;
        }

        var form = control.type === 'submit' ? control.form : null;
        if (form) {
            var field = document.createElement('input');
            field.type = 'hidden';
            field.name = 'format';
            field.value = 'csv';
            form.appendChild(field);
            control.click();
            // Gönderim sıraya alındıktan sonra: aynı formun sonraki "Süz" gönderimi CSV istemesin.
            setTimeout(function () { field.remove(); }, 0);
            return;
        }

        window.apyaExportFormat = 'csv';
        try { control.click(); } finally { window.apyaExportFormat = null; }
    }

    function item(tag, className, icon, text) {
        var el = document.createElement(tag);
        el.className = className;
        if (tag === 'button') { el.type = 'button'; }
        var i = document.createElement('i');
        i.className = 'fa ' + icon + ' me-2';
        i.setAttribute('aria-hidden', 'true');
        el.appendChild(i);
        el.appendChild(document.createTextNode(text));
        return el;
    }

    function enhance(control) {
        if (control.hasAttribute('data-transfer-ready')) { return; }
        control.setAttribute('data-transfer-ready', '');

        // Düğme zaten bir menünün satırıysa (Panolar) CSV aynı menüye ikinci satır olarak girer.
        var ownMenu = control.closest('.dropdown-menu');
        if (ownMenu) {
            // Satır, Excel satırının kopyasıdır (menünün kendi simge düzeni korunur); yalnız simge ve metin değişir.
            var row = control.cloneNode(true);
            row.removeAttribute('id');
            row.removeAttribute('data-transfer-export');
            row.removeAttribute('data-transfer-ready');
            var icon = row.querySelector('.fa-file-excel');
            if (icon) { icon.classList.replace('fa-file-excel', 'fa-file-csv'); }
            Array.prototype.forEach.call(row.childNodes, function (node) {
                if (node.nodeType === 3 && node.textContent.trim()) { node.textContent = ' ' + l('Export:CsvButton') + ' '; }
            });
            row.setAttribute('data-transfer-csv', '');
            row.addEventListener('click', function () { exportCsv(control); });
            control.insertAdjacentElement('afterend', row);
            return;
        }

        var group = document.createElement('div');
        group.className = 'btn-group apya-transfer-menu';
        // Düğmenin dış boşluk ve hizalama sınıfları gruba taşınır; bitişik iki düğme arasında boşluk kalmasın.
        ['me-1', 'me-2', 'ms-auto', 'w-100'].forEach(function (cls) {
            if (control.classList.contains(cls)) { control.classList.remove(cls); group.classList.add(cls); }
        });
        control.parentNode.insertBefore(group, control);
        group.appendChild(control);

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'btn dropdown-toggle dropdown-toggle-split ' +
            Array.prototype.filter.call(control.classList, function (c) { return /^btn-/.test(c); }).join(' ');
        toggle.setAttribute('data-bs-toggle', 'dropdown');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', l('Export:MoreFormats'));
        group.appendChild(toggle);

        var menu = document.createElement('div');
        menu.className = 'dropdown-menu dropdown-menu-end';
        var csv = item('button', 'dropdown-item', 'fa-file-csv', l('Export:CsvButton'));
        csv.setAttribute('data-transfer-csv', '');
        csv.addEventListener('click', function () { exportCsv(control); });
        menu.appendChild(csv);
        var all = item('a', 'dropdown-item', 'fa-right-left', l('Export:AllTransfers'));
        all.href = (window.abp ? abp.appPath : '/') + 'DataTransfer';
        menu.appendChild(all);
        group.appendChild(menu);
    }

    function scan(root) {
        Array.prototype.forEach.call((root || document).querySelectorAll('[data-transfer-export]'), enhance);
    }

    document.addEventListener('DOMContentLoaded', function () {
        scan(document);
        // Düğmesini betikle sonradan çizen ekranlar (Faturalar) için.
        new MutationObserver(function (changes) {
            changes.forEach(function (change) {
                Array.prototype.forEach.call(change.addedNodes, function (node) {
                    if (node.nodeType !== 1) { return; }
                    if (node.hasAttribute('data-transfer-export')) { enhance(node); } else { scan(node); }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    });
})();
