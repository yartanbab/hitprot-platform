$(function () {
    var calendarService = apya.platform.calendars.calendar;
    
    // --- Initial Fetch ---
    refreshAccounts();

    function refreshAccounts() {
        if (new URLSearchParams(window.location.search).get('msg') === 'success') {
            abp.notify.success('Takvim başarıyla bağlandı!');
            // URL'i temizleyelim
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        calendarService.getMyAccounts().then(function (result) {
            updateUI(result);
        });
    }

    function updateUI(accounts) {
        // Reset all cards to disconnected
        $('.status-badge').removeClass('status-linked').addClass('status-unlinked').text('Bağlı Değil');
        $('.connected-email').remove();
        $('.btn-connect').removeClass('btn-danger').addClass('btn-outline-primary').html('<i class="fa fa-link me-2"></i>Hesap Bağla');
        
        // Apply connected state
        accounts.forEach(function (acc) {
            var $card = acc.provider === 1 ? $('#CardGoogle') : (acc.provider === 2 ? $('#CardOutlook') : null);
            if ($card) {
                $card.find('.status-badge').removeClass('status-unlinked').addClass('status-linked').text('Bağlandı');
                $card.find('.status-area').append(`<div class="connected-email small"><i class="fa fa-envelope me-1"></i>${acc.externalEmail}</div>`);
                
                var $btn = $card.find('.btn-connect');
                $btn.removeClass('btn-outline-primary').addClass('btn-danger').html('<i class="fa fa-unlink me-2"></i>Bağlantıyı Kes');
                $btn.attr('data-id', acc.id);
            }
        });
    }

    // --- Actions ---
    $(document).on('click', '.btn-connect', function (e) {
        var $btn = $(this);
        var provider = parseInt($btn.data('provider'));
        var accountId = $btn.attr('data-id');

        if (accountId) {
            // DISCONNECT
            abp.message.confirm('Bu hesabın takvim bağlantısını koparmak istiyor musunuz?', 'Bağlantıyı Kes').then(function(confirmed) {
                if(confirmed) {
                    calendarService.disconnectAccount(accountId).then(function() {
                        abp.notify.info('Hesap bağlantısı kesildi.');
                        refreshAccounts();
                    });
                }
            });
        } else {
            // CONNECT (Server provided Auth URL)
            calendarService.getAuthUrl(provider).then(function(url) {
                window.location.href = url;
            });
        }
    });
});
