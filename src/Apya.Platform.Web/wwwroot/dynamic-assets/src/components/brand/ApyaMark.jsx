import React from 'react';

/**
 * APYA işareti — 13 ışın + pusula ibresi, tek renk (currentColor).
 *
 * Razor <apya-mark> (Brand/ApyaMarkSvg.cs) ve jQuery apya.mark() (/js/apya-mark.js)
 * ile AYNI SVG'yi basar; geometri sabitleri üçünde birebir aynıdır
 * (ApyaMark.test.jsx + BrandMarkParity_Tests kilitler).
 *
 * Hareket /css/apya-mark.css'te (global bundle): burada yalnız data-state basılır,
 * ışın sırası (--i) ve dinleme süresi (--ld) satır içi gelir. Durum değişince
 * yalnız öznitelik değişir; prefers-reduced-motion CSS'te karşılanır.
 *
 * @param {number}  size   px; 16 altında 3 ışınlı mikro sürüme düşer
 * @param {'ready'|'thinking'|'streaming'|'listening'|'suggest'|'off'} state
 * @param {boolean} print  baskı ibresi (opaklıksız)
 * @param {boolean} micro  mikro sürümü zorla/kapat; boşsa boyuta göre
 * @param {string}  label  ekran okuyucu adı; boşsa işaret süstür (aria-hidden)
 */
export const APYA_MARK_STATES = ['ready', 'thinking', 'streaming', 'listening', 'suggest', 'off'];

export const RAY_ANGLES = ['0.00', '27.69', '55.38', '83.08', '110.77', '138.46', '166.15',
    '193.85', '221.54', '249.23', '276.92', '304.62', '332.31'];
export const LISTEN_DURATIONS = ['1.12s', '0.70s', '0.95s', '0.95s', '0.70s', '1.12s', '0.79s',
    '0.87s', '1.04s', '0.62s', '1.04s', '0.87s', '0.79s'];
export const NEEDLE_NORTH = '50,36 55.5,50 50,52 44.5,50';
export const NEEDLE_SOUTH = '50,64 44.5,50 50,48 55.5,50';
export const PRINT_NEEDLE_NORTH = '50,34 56,50 50,52.5 44,50';
export const PRINT_NEEDLE_SOUTH = '50,60 45.5,50 50,48 54.5,50';
export const MICRO_NEEDLE_NORTH = '50,26 60,50 50,55 40,50';
export const MICRO_NEEDLE_SOUTH = '50,74 40,50 50,46 60,50';

export function ApyaMark({ size = 24, state = 'ready', print = false, micro, label, className, ...rest }) {
    const normalized = APYA_MARK_STATES.includes(state) ? state : 'ready';
    const isMicro = typeof micro === 'boolean' ? micro : size < 16;
    const a11y = label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': 'true', focusable: 'false' };

    return (
        <svg
            className={className ? `apya-mark ${className}` : 'apya-mark'}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            data-state={normalized}
            {...a11y}
            {...rest}
        >
            {isMicro ? (
                <>
                    <g fill="none" stroke="currentColor" strokeWidth="9">
                        {['0', '120', '240'].map((angle) => (
                            <line key={angle} x1="50" y1="18" x2="50" y2="4" transform={`rotate(${angle} 50 50)`} />
                        ))}
                    </g>
                    <polygon points={MICRO_NEEDLE_NORTH} fill="currentColor" />
                    <polygon points={MICRO_NEEDLE_SOUTH} fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
                </>
            ) : (
                <>
                    <g fill="none" stroke="currentColor" strokeWidth={normalized === 'suggest' || size < 32 ? '6' : '4.5'}>
                        {RAY_ANGLES.map((angle, i) => (
                            <g key={angle} transform={`rotate(${angle} 50 50)`}>
                                <line
                                    className="apya-mark__ray"
                                    style={{ '--i': i, '--ld': LISTEN_DURATIONS[i] }}
                                    x1="50" y1="20" x2="50" y2="4"
                                />
                            </g>
                        ))}
                    </g>
                    {print ? (
                        <>
                            <polygon points={PRINT_NEEDLE_NORTH} fill="currentColor" />
                            <polygon points={PRINT_NEEDLE_SOUTH} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
                        </>
                    ) : (
                        <>
                            <polygon points={NEEDLE_NORTH} fill="currentColor" />
                            <polygon points={NEEDLE_SOUTH} fill="currentColor" opacity=".38" />
                        </>
                    )}
                </>
            )}
        </svg>
    );
}
