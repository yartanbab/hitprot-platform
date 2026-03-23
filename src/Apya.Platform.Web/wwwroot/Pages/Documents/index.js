$(function () {
    var docService = apya.platform.documents.document;
    var currentDoc = null;
    var isNewDoc = false;

    // --- DOM Elements ---
    var $tree = $('#DocTree');
    var $welcome = $('#WikiWelcome');
    var $viewPanel = $('#DocViewPanel');
    var $editPanel = $('#DocEditPanel');

    var $viewTitle = $('#CurrentDocTitle');
    var $viewIcon = $('#CurrentDocIcon');
    var $viewBody = $('#DocBodyDisplay');

    var $editTitle = $('#EditDocTitle');
    var $editIcon = $('#EditDocIcon');
    var $editBody = $('#EditDocContent');

    // --- Initialize ---
    loadTree();

    // --- Tree Loading ---
    function loadTree(filter) {
        docService.getList({ 
            maxResultCount: 1000, 
            filterText: filter || ''
        }).then(function (result) {
            renderTree(result.items);
        });
    }

    function renderTree(items) {
        $tree.empty();
        if (items.length === 0) {
            $tree.html('<div class="text-center p-4 text-muted small">Henüz belge yok.</div>');
            return;
        }

        // Parent structure
        var rootItems = items.filter(x => !x.parentDocumentId);
        rootItems.forEach(item => {
            $tree.append(createTreeItem(item, items));
        });
    }

    function createTreeItem(item, allItems) {
        var subItems = allItems.filter(x => x.parentDocumentId === item.id);
        var icon = item.icon || '📄';
        var hasSubs = subItems.length > 0;
        
        var $el = $(`
            <div class="doc-wrapper">
                <div class="doc-item" data-id="${item.id}">
                    <span class="doc-icon">${icon}</span>
                    <span class="flex-grow-1">${item.title}</span>
                    ${hasSubs ? '<i class="fa fa-chevron-right ms-2 opacity-50 small"></i>' : ''}
                </div>
                <div class="doc-sub-list d-none"></div>
            </div>
        `);

        // Click to load details
        $el.find('.doc-item').click(function() {
            $('.doc-item').removeClass('active');
            $(this).addClass('active');
            loadDocument($(this).data('id'));
        });

        if (hasSubs) {
            var $subList = $el.find('.doc-sub-list');
            subItems.forEach(sub => {
                $subList.append(createTreeItem(sub, allItems));
            });
        }

        return $el;
    }

    // --- Document Actions ---
    function loadDocument(id) {
        docService.get(id).then(function(result) {
            currentDoc = result;
            isNewDoc = false;
            showView(result);
        });
    }

    function showView(doc) {
        $welcome.addClass('d-none');
        $editPanel.addClass('d-none');
        $viewPanel.removeClass('d-none').addClass('d-flex');
        
        $viewTitle.text(doc.title);
        $viewIcon.text(doc.icon || '📄');
        $viewBody.html(doc.content || '<p class="text-muted italic">Bu belge henüz bir içeriğe sahip değil.</p>');
    }

    function showEdit(doc) {
        $welcome.addClass('d-none');
        $viewPanel.addClass('d-none');
        $editPanel.removeClass('d-none').addClass('d-flex');

        $editTitle.val(doc ? doc.title : '');
        $editIcon.val(doc ? (doc.icon || '📄') : '📄');
        $editBody.val(doc ? doc.content : '');
        $editTitle.focus();
    }

    // --- Button Event Handlers ---
    $('#EditBtn').click(function() {
        showEdit(currentDoc);
    });

    $('#NewRootDocBtn').click(function() {
        currentDoc = null;
        isNewDoc = true;
        showEdit(null);
    });

    $('#CancelEditBtn').click(function() {
        if (isNewDoc) {
            $editPanel.addClass('d-none');
            $welcome.removeClass('d-none').addClass('d-flex');
        } else {
            showView(currentDoc);
        }
    });

    $('#SaveDocBtn').click(function() {
        var input = {
            title: $editTitle.val(),
            content: $editBody.val(),
            icon: $editIcon.val(),
            projectId: null, // Proje bazlı wiki için sonra eklenebilir
            parentDocumentId: null
        };

        if (isNewDoc) {
            docService.create(input).then(function(result) {
                abp.notify.success("Belge oluşturuldu.");
                loadTree();
                loadDocument(result.id);
            });
        } else {
            docService.update(currentDoc.id, input).then(function(result) {
                abp.notify.success("Belge güncellendi.");
                currentDoc = result;
                loadTree();
                showView(result);
            });
        }
    });

    $('#DeleteBtn').click(function() {
        if (!currentDoc) return;
        
        abp.message.confirm("Bu belgeyi silmek istediğinize emin misiniz?", "Silme Onayı")
            .then(function(confirm) {
                if(confirm) {
                    docService.delete(currentDoc.id).then(function() {
                        abp.notify.info("Belge silindi.");
                        currentDoc = null;
                        loadTree();
                        $viewPanel.addClass('d-none');
                        $welcome.removeClass('d-none').addClass('d-flex');
                    });
                }
            });
    });

    // --- Search ---
    $('#TreeSearch').on('input', function() {
        loadTree($(this).val());
    });
});
