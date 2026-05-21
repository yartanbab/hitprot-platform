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

        // TD-W-006: Reconnect lifecycle — kullanıcıya bağlantı durumunu bildir.
        const l = (typeof abp !== 'undefined' && abp.localization)
            ? abp.localization.getResource('Platform')
            : function (k) { return k; };

        this.connection.onreconnecting(function (error) {
            console.warn('[AiHubClient] reconnecting:', error);
            if (typeof abp !== 'undefined' && abp.notify) {
                abp.notify.warn(l('Connection:Reconnecting'), l('Connection:Title'));
            }
        });

        this.connection.onreconnected(function (connectionId) {
            if (typeof abp !== 'undefined' && abp.notify) {
                abp.notify.success(l('Connection:Reconnected'), l('Connection:Title'));
            }
        });

        this.connection.onclose(function (error) {
            console.error('[AiHubClient] connection closed:', error);
            if (typeof abp !== 'undefined' && abp.notify) {
                abp.notify.error(l('Connection:Lost'), l('Connection:ErrorTitle'), { sticky: true });
            }
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
