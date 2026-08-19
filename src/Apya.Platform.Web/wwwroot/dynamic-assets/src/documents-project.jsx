/**
 * Documents Project Island — Faz E (zaman cizelgesi + eslestirme)
 * -----------------------------------------------------------------------
 * TEK bundle, IKI mount noktasi: iki ekran ayni api koprusunu ve stilleri
 * paylasiyor; ayri entry uretmek ayni kodu iki kez indirtirdi.
 *
 * Vite -> /wwwroot/js/documents-project.js
 * Mount: #project-timeline-island  (Documents/Timeline.cshtml)
 *        #document-matching-island (Documents/Matching.cshtml)
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TimelineRoot } from './documents-project/TimelineRoot';
import { MatchingRoot } from './documents-project/MatchingRoot';

const timeline = document.getElementById('project-timeline-island');
if (timeline) {
  createRoot(timeline).render(<TimelineRoot />);
}

const matching = document.getElementById('document-matching-island');
if (matching) {
  createRoot(matching).render(<MatchingRoot />);
}
