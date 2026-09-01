module.exports = {
    aliases: {

    },
    clean: [
        // frappe-gantt kaldırıldı (PR #147: zaman çizelgesi /js/apya-gantt.js'e geçti).
        // Daha önce kurulmuş kopyaları da temizlensin — aksi halde geliştirici
        // makinelerinde wwwroot/libs altında yetim kalırdı.
        "wwwroot/libs/frappe-gantt"
    ],
    mappings: {
        // CDN'e bağımlı kalmasınlar diye yerelleştirildi (bkz. Tasks/Board/ProjectDetails.cshtml).
        "node_modules/sortablejs/Sortable.min.js": "wwwroot/libs/sortablejs/",
        // 2a · başvuru sihirbazının canlı kanalı. React tarafı bu paketi Vite ile
        // demetliyor; Razor sayfası global `signalR` beklediği için tarayıcı
        // demeti ayrıca libs altına kopyalanır.
        "node_modules/@microsoft/signalr/dist/browser/signalr.min.js": "wwwroot/libs/signalr/"
    }
};
