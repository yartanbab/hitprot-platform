using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_Notification_Hierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActorName",
                table: "AppNotifications",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ActorUserId",
                table: "AppNotifications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "AppNotifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GroupKey",
                table: "AppNotifications",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastOccurredAt",
                table: "AppNotifications",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "OccurrenceCount",
                table: "AppNotifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Severity",
                table: "AppNotifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId_Category_IsRead",
                table: "AppNotifications",
                columns: new[] { "UserId", "Category", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId_GroupKey_IsRead",
                table: "AppNotifications",
                columns: new[] { "UserId", "GroupKey", "IsRead" });

            // Mevcut kayıtları hiyerarşiye taşı: kategori ve aciliyet türden türetilir,
            // sıralama artık LastOccurredAt üzerinden yapıldığı için o da doldurulmalı —
            // yoksa eski bildirimler 0001-01-01 ile listenin en sonuna düşer.
            // Eşleme NotificationTypeRegistry ile birebir aynıdır.
            migrationBuilder.Sql(@"
                UPDATE [AppNotifications]
                SET [OccurrenceCount] = 1,
                    [LastOccurredAt]  = [CreationTime],
                    [Category] = CASE [Type]
                        WHEN 5  THEN 2   -- ProjectMemberAdded  -> Projects
                        WHEN 7  THEN 5   -- AiWorkflowTriggered -> Ai
                        WHEN 8  THEN 3   -- DocumentExpiring    -> Documents
                        WHEN 9  THEN 4   -- GrantRecommended    -> Grants
                        WHEN 10 THEN 6   -- Feedback*           -> Feedback
                        WHEN 11 THEN 6
                        WHEN 12 THEN 6
                        ELSE 1           -- Task* ve Mention    -> Tasks
                    END,
                    [Severity] = CASE [Type]
                        WHEN 3  THEN 4   -- TaskDueSoon         -> Critical
                        WHEN 1  THEN 3   -- TaskAssigned        -> High
                        WHEN 6  THEN 3   -- Mention             -> High
                        WHEN 8  THEN 3   -- DocumentExpiring    -> High
                        WHEN 7  THEN 1   -- AiWorkflowTriggered -> Info
                        WHEN 10 THEN 1   -- FeedbackReceived    -> Info
                        WHEN 12 THEN 1   -- FeedbackStatusChng  -> Info
                        ELSE 2           -- geri kalanı         -> Normal
                    END;
            ");

            // Gruplanabilir türlerin okunmamış kayıtlarına anahtar ver ki bundan
            // sonra gelen olaylar yeni satır açmak yerine bunlarla birleşsin.
            migrationBuilder.Sql(@"
                UPDATE [AppNotifications]
                SET [GroupKey] = CONVERT(varchar(11), [Type]) + ':' + ISNULL([EntityType], '') + ':' + CONVERT(varchar(36), [EntityId])
                WHERE [Type] IN (2, 4, 6) AND [EntityId] IS NOT NULL;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppNotifications_UserId_Category_IsRead",
                table: "AppNotifications");

            migrationBuilder.DropIndex(
                name: "IX_AppNotifications_UserId_GroupKey_IsRead",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "ActorName",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "ActorUserId",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "GroupKey",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "LastOccurredAt",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "OccurrenceCount",
                table: "AppNotifications");

            migrationBuilder.DropColumn(
                name: "Severity",
                table: "AppNotifications");
        }
    }
}
