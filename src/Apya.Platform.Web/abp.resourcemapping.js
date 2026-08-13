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
        "node_modules/sortablejs/Sortable.min.js": "wwwroot/libs/sortablejs/"
    }
};
