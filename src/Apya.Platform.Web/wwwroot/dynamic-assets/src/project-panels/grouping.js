/**
 * Saf gruplama/işaretleme yardımcıları — panel bileşenlerinden ayrı dursun ki
 * birim testleri DOM'suz koşsun.
 */

/**
 * Kayıtları görev başına gruplar. Sıra GÖREV LİSTESİNİN sırasıdır (sunucu
 * sıralaması korunur); kayıtsız görev grup üretmez. Listede olmayan bir
 * taskId'nin kaydı (yarış: panel açıkken görev silindi/taşındı) atılmaz —
 * `task: null` grubunda sona düşer, veri sessizce kaybolmasın.
 */
export function groupByTask(tasks, records, getTaskId) {
    const byTask = new Map(tasks.map((t) => [t.id, { task: t, records: [] }]));
    const orphans = { task: null, records: [] };

    for (const record of records) {
        const bucket = byTask.get(getTaskId(record));
        (bucket ? bucket.records : orphans.records).push(record);
    }

    const groups = [...byTask.values()].filter((g) => g.records.length > 0);
    if (orphans.records.length > 0) { groups.push(orphans); }
    return groups;
}

/**
 * Bloke eden kenarlar — handoff kuralı birebir: öncül `Status != Done` VE
 * `DueDate < bugün`. (Done = 4; iptal edilmiş öncül de kurala göre bloke
 * sayılır — kural durum adına değil "Done değil"e bakıyor.)
 */
export function blockedEdges(edges, taskById, now = new Date()) {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return edges.filter((e) => {
        const pred = taskById.get(e.predecessorTaskId);
        if (!pred || pred.status === 4) { return false; }
        return !!pred.dueDate && new Date(pred.dueDate) < todayStart;
    });
}
