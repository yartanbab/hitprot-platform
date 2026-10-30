using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddGrantNotificationTemplateAudience : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.AddColumn<int>(
                name: "Audience",
                table: "AppGrantNotificationTemplates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger_Audience",
                table: "AppGrantNotificationTemplates",
                columns: new[] { "TenantId", "Trigger", "Audience" },
                unique: true,
                filter: "[TenantId] IS NOT NULL AND [IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger_Audience",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.DropColumn(
                name: "Audience",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger",
                table: "AppGrantNotificationTemplates",
                columns: new[] { "TenantId", "Trigger" },
                unique: true,
                filter: "[TenantId] IS NOT NULL AND [IsDeleted] = 0");
        }
    }
}
