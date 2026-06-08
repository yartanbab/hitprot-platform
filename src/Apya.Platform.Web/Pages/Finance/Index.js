// Para Hareketleri hub'ı — istemci taraflı tür filtresi (Tümü/Gelir/Gider/Fatura).
(function () {
    var filter = document.getElementById('TxFilter');
    if (!filter) return;

    filter.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-filter]');
        if (!btn) return;

        // Aktif buton stilini güncelle
        filter.querySelectorAll('button').forEach(function (b) {
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline-primary');
        });
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');

        var want = btn.getAttribute('data-filter');
        document.querySelectorAll('#TransactionsTable tbody tr[data-type]').forEach(function (row) {
            row.style.display = (want === 'all' || row.getAttribute('data-type') === want) ? '' : 'none';
        });
    });
})();
