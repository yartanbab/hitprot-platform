/* =============================================================================
   APYA CHART THEME — chart.js 4.4 için ortak tema yardımcısı
   -----------------------------------------------------------------------------
   HANDOFF "Grafikler (chart.js)" + DESIGN-SYSTEM.md §10.7'nin koddaki karşılığı.
   Daha önce her grafik ekranı kendi renklerini ham yazıyordu (Chart.js/Bootstrap
   varsayılan paleti: rgb(54,162,235), '#198754', '#0d6efd'…) → tasarım
   paletinden sapıyor ve tema değişince güncellenmiyordu.

   Kullanım:
       var chart = new Chart(ctx, apyaChart.options({ type: 'bar', data: {...} }));
       apyaChart.onThemeChange(function () { chart.destroy(); chart = build(); });

   Token okuma: değerler CSS custom property'lerinden RUNTIME'da alınır
   (getComputedStyle) — böylece light/dark ve olası token değişiklikleri
   otomatik yansır, burada ikinci bir renk kaynağı oluşmaz.
   ============================================================================= */
(function (window) {
    'use strict';

    function token(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name);
        v = (v || '').trim();
        return v || fallback || '';
    }

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    /* Kategorik seri paleti — sıra HANDOFF'un vurgu hiyerarşisini izler:
       aksiyon (accent) → marka → pozitif → uyarı → negatif → AI moru → nötr. */
    function palette() {
        return [
            token('--apya-accent-500', '#4F46E5'),
            token('--apya-brand-500', '#2563EB'),
            token('--apya-positive-500', '#059669'),
            token('--apya-warning-500', '#D97706'),
            token('--apya-negative-500', '#DC2626'),
            token('--apya-ai-500', '#7C3AED'),
            token('--apya-neutral-500', '#6B7280')
        ];
    }

    /* Tek isimden ton çözümü — 'positive' / 'negative' / 'warning' / 'accent' /
       'brand' / 'ai' / 'neutral'. Bilinmeyen ad olduğu gibi döner (ham hex
       geçmek isteyen çağıran için kaçış kapısı). */
    var TONES = {
        accent: '--apya-accent-500',
        brand: '--apya-brand-500',
        positive: '--apya-positive-500',
        negative: '--apya-negative-500',
        warning: '--apya-warning-500',
        ai: '--apya-ai-500',
        neutral: '--apya-neutral-500'
    };
    function tone(name) {
        return TONES[name] ? token(TONES[name]) : name;
    }

    /* Yarı saydam dolgu — bar/area zeminleri için (chip'lerdeki %14 deseninin
       grafik karşılığı; alanlar daha büyük olduğu için biraz daha düşük).
       CSS `color-mix()` KULLANILMAZ: Chart.js renkleri kendi ayrıştırıcısıyla
       (@kurkle/color) okur, canvas fillStyle'a doğrudan da geçmez — hem hover
       tonu üretimi hem gradient stop'ları bozulur. rgba() her yerde güvenli. */
    function alpha(color, a) {
        var c = (color || '').trim();
        var m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (m) {
            var h = m[1];
            if (h.length === 3) { h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; }
            return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' +
                             parseInt(h.slice(2, 4), 16) + ',' +
                             parseInt(h.slice(4, 6), 16) + ',' + a + ')';
        }
        m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
        if (m) {
            return 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',' + a + ')';
        }
        return c;
    }

    /* line grafiği için dikey gradient dolgu (HANDOFF: "line: gradient fill").
       ctx yoksa (henüz ölçülmemiş canvas) düz saydam renge düşer. */
    function gradient(ctx, color, area) {
        if (!ctx || !area) { return alpha(color, 0.12); }
        var g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
        g.addColorStop(0, alpha(color, 0.28));
        g.addColorStop(1, alpha(color, 0.0));
        return g;
    }

    /* HANDOFF grafik ayarları + token'lı eksen/ızgara/tooltip. */
    function baseOptions() {
        var grid = isDark() ? 'rgba(255,255,255,.06)' : '#EEF0F3';
        var tick = token('--apya-text-tertiary', '#9CA3AF');
        var label = token('--apya-text-secondary', '#4B5563');
        var tooltipBg = isDark() ? token('--apya-surface-elevated', '#1A1A1D') : '#111827';

        return {
            responsive: true,
            maintainAspectRatio: false,
            /* B2B: animasyon 200ms üstüne çıkmaz (tokens.css §1.11) */
            animation: { duration: 200 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: label,
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 11, family: token('--apya-font-sans') }
                    }
                },
                tooltip: {
                    backgroundColor: tooltipBg,
                    titleColor: '#F4F4F5',
                    bodyColor: '#D4D4D8',
                    borderColor: isDark() ? token('--apya-border-strong') : 'transparent',
                    borderWidth: isDark() ? 1 : 0,
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 4,
                    titleFont: { size: 12, family: token('--apya-font-sans'), weight: '600' },
                    bodyFont: { size: 11.5, family: token('--apya-font-mono') }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: tick, font: { size: 11, family: token('--apya-font-sans') } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: grid, drawBorder: false },
                    ticks: { color: tick, font: { size: 11, family: token('--apya-font-mono') } }
                }
            }
        };
    }

    /* Derin birleştirme — çağıranın verdiği options baseOptions'ı ezer. */
    function merge(base, over) {
        if (!over) { return base; }
        Object.keys(over).forEach(function (k) {
            var b = base[k], o = over[k];
            if (o && b && typeof o === 'object' && typeof b === 'object' && !Array.isArray(o)) {
                merge(b, o);
            } else {
                base[k] = o;
            }
        });
        return base;
    }

    /* Chart config'ini tema ile sarmalar. Dataset'lerde renk verilmemişse
       paletten sırayla atanır — çağıran renk düşünmek zorunda kalmaz. */
    function options(config) {
        var cfg = config || {};
        cfg.options = merge(baseOptions(), cfg.options);

        var p = palette();
        var isCircular = cfg.type === 'doughnut' || cfg.type === 'pie' || cfg.type === 'polarArea';

        if (isCircular) {
            /* Dilim grafikleri: eksen yok, legend sağda (HANDOFF: doughnut cutout '72%') */
            delete cfg.options.scales;
            if (cfg.type === 'doughnut' && cfg.options.cutout === undefined) {
                cfg.options.cutout = '72%';
            }
        }

        if (cfg.data && cfg.data.datasets) {
            cfg.data.datasets.forEach(function (ds, i) {
                var c = p[i % p.length];
                var type = ds.type || cfg.type;

                if (isCircular) {
                    if (!ds.backgroundColor) {
                        ds.backgroundColor = (ds.data || []).map(function (_, j) { return p[j % p.length]; });
                    }
                    if (ds.borderWidth === undefined) { ds.borderWidth = 0; }
                    if (cfg.type === 'doughnut' && ds.spacing === undefined) { ds.spacing = 2; }
                    return;
                }

                if (type === 'line') {
                    if (!ds.borderColor) { ds.borderColor = c; }
                    if (ds.tension === undefined) { ds.tension = 0.35; }
                    if (ds.pointRadius === undefined) { ds.pointRadius = 0; }
                    if (ds.borderWidth === undefined) { ds.borderWidth = 2; }
                    if (ds.fill && !ds.backgroundColor) { ds.backgroundColor = alpha(c, 0.12); }
                } else {
                    if (!ds.backgroundColor) { ds.backgroundColor = c; }
                    if (ds.borderRadius === undefined) { ds.borderRadius = 4; }
                    if (ds.maxBarThickness === undefined) { ds.maxBarThickness = 16; }
                    if (ds.borderWidth === undefined) { ds.borderWidth = 0; }
                }
            });
        }

        return cfg;
    }

    /* Tema değişiminde yeniden kurulum. dark-mode.js applyTheme() içinde
       'apya:themechange' yayınlar; grafik renkleri getComputedStyle ile
       okunduğu için chart'ın destroy+rebuild edilmesi gerekir. */
    function onThemeChange(handler) {
        document.addEventListener('apya:themechange', handler);
    }

    window.apyaChart = {
        token: token,
        isDark: isDark,
        palette: palette,
        tone: tone,
        alpha: alpha,
        gradient: gradient,
        options: options,
        onThemeChange: onThemeChange
    };
})(window);
