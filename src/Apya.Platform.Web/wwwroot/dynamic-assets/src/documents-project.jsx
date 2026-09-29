/**
 * Documents Project Island — proje ekranlari (zaman cizelgesi + eslestirme + kapsam)
 * -----------------------------------------------------------------------
 * TEK bundle, UC mount noktasi: ekranlar ayni api koprusunu ve stilleri
 * paylasiyor; ayri entry uretmek ayni kodu tekrar tekrar indirtirdi.
 *
 * Vite -> /wwwroot/js/documents-project.js
 * Mount: #project-timeline-island  (Documents/Timeline.cshtml)
 *        #document-matching-island (Documents/Matching.cshtml)
 *        #project-scope-island     (Documents/Scope.cshtml)
 */
import React from 'react';
import { mountIsland } from './lib/mountIsland';
import './index.css';
import { TimelineRoot } from './documents-project/TimelineRoot';
import { MatchingRoot } from './documents-project/MatchingRoot';
import { ScopeRoot } from './documents-project/ScopeRoot';

const timeline = document.getElementById('project-timeline-island');
if (timeline) {
  mountIsland(timeline, 'documents-timeline', <TimelineRoot />);
}

const matching = document.getElementById('document-matching-island');
if (matching) {
  mountIsland(matching, 'documents-matching', <MatchingRoot />);
}

const scope = document.getElementById('project-scope-island');
if (scope) {
  mountIsland(scope, 'documents-scope', <ScopeRoot />);
}
