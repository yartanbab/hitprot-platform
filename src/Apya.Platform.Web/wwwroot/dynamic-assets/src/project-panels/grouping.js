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
 * Çapraz-proje kip (/Tasks Panolar yüzeyi): kayıtları ÖNCE projeye böler;
 * proje içindeki görev gruplaması yine groupByTask'ın işi. Sıra proje
 * lookup'ının sırasıdır (sunucu ada göre sıralı döndürür). Kaydın projesi
 * görevinden çözülür; görevi listede olmayan kayıt için getRecordProjectId
 * (kontrol listesinin proje-seviyesi maddeleri) denenir. Projesi yine de
 * çözülemeyenler — projesiz görevlerin kayıtları dahil — `project: null`
 * kovasında SONA düşer, veri sessizce kaybolmasın.
 */
export function partitionByProject(projects, tasks, records, getTaskId, getRecordProjectId = null) {
    const taskById = new Map(tasks.map((t) => [t.id, t]));
    const buckets = new Map(projects.map((p) => [p.id, { project: p, tasks: [], records: [] }]));
    // Lookup'ta olmayan proje (yarış: panel açıkken proje eklendi) görev
    // verisindeki adıyla lookup sırasının ARKASINA eklenir.
    const ensure = (id, name) => {
        if (!buckets.has(id)) { buckets.set(id, { project: { id, name: name || '' }, tasks: [], records: [] }); }
        return buckets.get(id);
    };

    for (const t of tasks) {
        if (t.projectId) { ensure(t.projectId, t.projectName).tasks.push(t); }
    }

    const orphans = { project: null, tasks: [], records: [] };
    for (const record of records) {
        const task = taskById.get(getTaskId(record));
        const projectId = task?.projectId ?? (getRecordProjectId ? getRecordProjectId(record) : null);
        (projectId ? ensure(projectId, task?.projectName) : orphans).records.push(record);
    }

    // Projesiz görevler orphan kovasının görev listesine — groupByTask orada
    // da görev başlığıyla gruplayabilsin.
    orphans.tasks = tasks.filter((t) => !t.projectId);

    const groups = [...buckets.values()].filter((g) => g.records.length > 0);
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
