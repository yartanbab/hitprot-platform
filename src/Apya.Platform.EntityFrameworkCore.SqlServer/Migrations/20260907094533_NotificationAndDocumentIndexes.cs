using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class NotificationAndDocumentIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppNotifications_CreationTime",
                table: "AppNotifications");

            migrationBuilder.DropIndex(
                name: "IX_AppNotifications_UserId_IsRead",
                table: "AppNotifications");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentFiles_TenantId_DocumentId",
                table: "AppDocumentFiles");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId_IsRead",
                table: "AppNotifications",
                columns: new[] { "UserId", "IsRead" })
                .Annotation("SqlServer:Include", new[] { "TenantId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId_LastOccurredAt",
                table: "AppNotifications",
                columns: new[] { "UserId", "LastOccurredAt" },
                descending: new[] { false, true })
                .Annotation("SqlServer:Include", new[] { "TenantId", "IsDeleted", "IsRead", "Severity" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_TenantId_DocumentId_CreationTime",
                table: "AppDocumentFiles",
                columns: new[] { "TenantId", "DocumentId", "CreationTime" },
                descending: new[] { false, false, true })
                .Annotation("SqlServer:Include", new[] { "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppNotifications_UserId_IsRead",
                table: "AppNotifications");

            migrationBuilder.DropIndex(
                name: "IX_AppNotifications_UserId_LastOccurredAt",
                table: "AppNotifications");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentFiles_TenantId_DocumentId_CreationTime",
                table: "AppDocumentFiles");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_CreationTime",
                table: "AppNotifications",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId_IsRead",
                table: "AppNotifications",
                columns: new[] { "UserId", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_TenantId_DocumentId",
                table: "AppDocumentFiles",
                columns: new[] { "TenantId", "DocumentId" });
        }
    }
}
