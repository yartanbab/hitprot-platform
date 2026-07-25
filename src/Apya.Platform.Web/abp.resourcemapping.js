module.exports = {
    aliases: {

    },
    clean: [

    ],
    mappings: {
        // CDN'e bağımlı kalmasınlar diye yerelleştirildi (bkz. Tasks/Board/ProjectDetails.cshtml).
        "node_modules/sortablejs/Sortable.min.js": "wwwroot/libs/sortablejs/",
        "node_modules/frappe-gantt/dist/frappe-gantt.min.js": "wwwroot/libs/frappe-gantt/",
        "node_modules/frappe-gantt/dist/frappe-gantt.min.css": "wwwroot/libs/frappe-gantt/"
    }
};
