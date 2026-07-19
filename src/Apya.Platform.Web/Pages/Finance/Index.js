$(function () {
    apya.transfer.mount('ApyaTransferWidget', {
        onSuccess: function () {
            window.location.reload();
        }
    });
});
