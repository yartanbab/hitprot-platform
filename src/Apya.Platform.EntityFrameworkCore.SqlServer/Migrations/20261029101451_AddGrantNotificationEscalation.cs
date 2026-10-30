using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddGrantNotificationEscalation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger_Audience",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.AddColumn<int>(
                name: "AfterDays",
                table: "AppGrantNotificationTemplates",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEscalation",
                table: "AppGrantNotificationTemplates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StatusChangedAt",
                table: "AppGrantApplicationDocuments",
                type: "datetime2",
                nullable: true);

            /* Var olan evrakta durumun ne zaman değiştiği tutulmuyordu; en yakın iz son değişiklik zamanı.
               Hiç yüklenmemiş evrak (Bekleniyor = 0) boş kalır: onda bekleyen revizyon yok. */
            migrationBuilder.Sql("""
                UPDATE [AppGrantApplicationDocuments]
                SET [StatusChangedAt] = COALESCE([LastModificationTime], [CreationTime])
                WHERE [Status] <> 0
                """);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger_Audience_IsEscalation",
                table: "AppGrantNotificationTemplates",
                columns: new[] { "TenantId", "Trigger", "Audience", "IsEscalation" },
                unique: true,
                filter: "[TenantId] IS NOT NULL AND [IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger_Audience_IsEscalation",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.DropColumn(
                name: "AfterDays",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.DropColumn(
                name: "IsEscalation",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.DropColumn(
                name: "StatusChangedAt",
                table: "AppGrantApplicationDocuments");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger_Audience",
                table: "AppGrantNotificationTemplates",
                columns: new[] { "TenantId", "Trigger", "Audience" },
                unique: true,
                filter: "[TenantId] IS NOT NULL AND [IsDeleted] = 0");
        }
    }
}
