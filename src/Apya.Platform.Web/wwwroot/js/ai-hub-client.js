/**
 * APYA-117 - AI Hub client.
 * Subscribes to a draft batch and dispatches a custom event when status changes.
 *
 * Usage:
 *   const client = new AiHubClient();
 *   await client.connect();
 *   await client.subscribeToBatch(batchId);
 *   document.addEventListener('apya:draft-batch-update', e => {
 *       console.log('Batch update:', e.detail);
 *       // e.detail = { batchId, status, totalItems, approvedItems, errorMessage }
 *   });
 */
(function () {
    'use strict';

    if (typeof signalR === 'undefined') {
        console.warn('[AiHubClient] signalR is not loaded.');
        return;
    }

    function AiHubClient() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/ai-hub')
            .withAutomaticReconnect()
            .build();

        const self = this;
        this.connection.on('ReceiveDraftBatchUpdate', function (payload) {
            document.dispatchEvent(new CustomEvent('apya:draft-batch-update', { detail: payload }));
        });
    }

    AiHubClient.prototype.connect = function () {
        return this.connection.start();
    };

    AiHubClient.prototype.subscribeToBatch = function (batchId) {
        return this.connection.invoke('SubscribeToBatchAsync', batchId);
    };

    AiHubClient.prototype.unsubscribeFromBatch = function (batchId) {
        return this.connection.invoke('UnsubscribeFromBatchAsync', batchId);
    };

    window.AiHubClient = AiHubClient;
})();
