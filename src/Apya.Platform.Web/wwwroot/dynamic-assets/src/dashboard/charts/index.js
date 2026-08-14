/**
 * Grafik kataloğu — 16 tür, hepsi saf SVG/CSS ve token renkli.
 *
 * `CHART_COMPONENTS` anahtarları sunucudaki `DashboardChartType` enum'ıyla
 * BİREBİR aynıdır; kart düzeni bu adla kaydediliyor.
 */
export { NumberTrend, TrendDelta } from './NumberTrend';
export { AreaSpark } from './AreaSpark';
export { LineMulti } from './LineMulti';
export { GroupedBar } from './GroupedBar';
export { StackedBar, FullStacked } from './StackedBar';
export { RankBar } from './RankBar';
export { Donut } from './Donut';
export { Gauge } from './Gauge';
export { Heatmap } from './Heatmap';
export { Burndown } from './Burndown';
export { MiniGantt } from './MiniGantt';
export { Waterfall } from './Waterfall';
export { RiskMatrix } from './RiskMatrix';
export { Funnel } from './Funnel';
export { Bullet } from './Bullet';

export { CHART_MIN_SIZE, fitsChart } from './chartUtils';
