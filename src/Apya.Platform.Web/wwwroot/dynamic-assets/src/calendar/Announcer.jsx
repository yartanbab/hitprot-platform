import React from 'react';

/**
 * Ekran okuyucu duyuru bölgesi.
 *
 * Tasarım ayrımı (§11): taşıma/erteleme `polite` (kullanıcının işini bölmez),
 * senkron hatası `assertive` (kaçırılmamalı). İki AYRI bölge gerekir — tek bir
 * bölgenin nezaket düzeyi sonradan değiştirilirse okuyucular güvenilmez davranır.
 */
export function Announcer({ polite, assertive }) {
    return (
        <>
            <p role="status" aria-live="polite" className="sr-only">{polite}</p>
            <p role="alert" aria-live="assertive" className="sr-only">{assertive}</p>
        </>
    );
}
