/* =============================================================================
   APYA İŞARETİ — JS üreticisi
   -----------------------------------------------------------------------------
   apya.mark({ size, state, print, micro, label, className }) → <svg> HTML dizesi
   (grid/kart/DataTables render'ı ve JS ile açılan durumlar için).

   • Razor karşılığı : <apya-mark size="20" state="thinking" /> (ApyaMarkTagHelper)
   • React karşılığı : <ApyaMark size={20} state="thinking" />
   • Hareket          : /css/apya-mark.css — burada yalnız data-state basılır;
                        durumu değiştirmek için svg.setAttribute('data-state', '…')
                        yeterlidir, işaret yeniden çizilmez.

   Geometri sabitleri Brand/ApyaMarkSvg.cs ile BİREBİR aynıdır
   (BrandMarkParity_Tests kilitler). Global script bundle'a kayıtlı.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.mark) { return; }

    var STATES = ['ready', 'thinking', 'streaming', 'listening', 'suggest', 'off'];
    var RAY_ANGLES = ['0.00', '27.69', '55.38', '83.08', '110.77', '138.46', '166.15',
        '193.85', '221.54', '249.23', '276.92', '304.62', '332.31'];
    var LISTEN_DURATIONS = ['1.12s', '0.70s', '0.95s', '0.95s', '0.70s', '1.12s', '0.79s',
        '0.87s', '1.04s', '0.62s', '1.04s', '0.87s', '0.79s'];
    var NEEDLE_NORTH = '50,36 55.5,50 50,52 44.5,50';
    var NEEDLE_SOUTH = '50,64 44.5,50 50,48 55.5,50';
    var PRINT_NEEDLE_NORTH = '50,34 56,50 50,52.5 44,50';
    var PRINT_NEEDLE_SOUTH = '50,60 45.5,50 50,48 54.5,50';
    var MICRO_NEEDLE_NORTH = '50,26 60,50 50,55 40,50';
    var MICRO_NEEDLE_SOUTH = '50,74 40,50 50,46 60,50';

    function esc(value) {
        return String(value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function normalizeState(state) {
        var value = (state || '').toString().trim().toLowerCase();
        return STATES.indexOf(value) >= 0 ? value : 'ready';
    }

    function inner(size, state, print, micro) {
        var html = '';
        if (micro) {
            html += '<g fill="none" stroke="currentColor" stroke-width="9">';
            ['0', '120', '240'].forEach(function (angle) {
                html += '<line x1="50" y1="18" x2="50" y2="4" transform="rotate(' + angle + ' 50 50)"/>';
            });
            html += '</g>';
            html += '<polygon points="' + MICRO_NEEDLE_NORTH + '" fill="currentColor"/>';
            html += '<polygon points="' + MICRO_NEEDLE_SOUTH + '" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>';
            return html;
        }

        var stroke = (state === 'suggest' || size < 32) ? '6' : '4.5';
        html += '<g fill="none" stroke="currentColor" stroke-width="' + stroke + '">';
        for (var i = 0; i < RAY_ANGLES.length; i++) {
            html += '<g transform="rotate(' + RAY_ANGLES[i] + ' 50 50)">' +
                '<line class="apya-mark__ray" style="--i:' + i + ';--ld:' + LISTEN_DURATIONS[i] + '" x1="50" y1="20" x2="50" y2="4"/>' +
                '</g>';
        }
        html += '</g>';

        if (print) {
            html += '<polygon points="' + PRINT_NEEDLE_NORTH + '" fill="currentColor"/>';
            html += '<polygon points="' + PRINT_NEEDLE_SOUTH + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>';
        } else {
            html += '<polygon points="' + NEEDLE_NORTH + '" fill="currentColor"/>';
            html += '<polygon points="' + NEEDLE_SOUTH + '" fill="currentColor" opacity=".38"/>';
        }
        return html;
    }

    apya.mark = function (options) {
        var o = options || {};
        var size = parseInt(o.size, 10) > 0 ? parseInt(o.size, 10) : 24;
        var state = normalizeState(o.state);
        var micro = typeof o.micro === 'boolean' ? o.micro : size < 16;
        var cls = 'apya-mark' + (o.className ? ' ' + esc(String(o.className).trim()) : '');
        var a11y = o.label
            ? ' role="img" aria-label="' + esc(o.label) + '"'
            : ' aria-hidden="true" focusable="false"';

        return '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 100 100"' +
            ' data-state="' + state + '"' + a11y + '>' + inner(size, state, !!o.print, micro) + '</svg>';
    };
})();
