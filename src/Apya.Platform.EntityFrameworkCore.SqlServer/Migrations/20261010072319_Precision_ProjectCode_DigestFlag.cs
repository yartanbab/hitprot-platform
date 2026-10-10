using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Precision_ProjectCode_DigestFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Digest",
                table: "AppNotificationPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);

            // NTF-09: Bayrak ayrılmadan önce e-postası açık olan herkes özeti de alıyordu;
            // kimsenin tercihi sessizce değişmesin diye yeni kolon eskisinden kopyalanır.
            migrationBuilder.Sql("UPDATE [AppNotificationPreferences] SET [Digest] = [Email];");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_Code_Host",
                table: "AppProjects",
                column: "Code",
                unique: true,
                filter: "[TenantId] IS NULL AND [IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_TenantId_Code",
                table: "AppProjects",
                columns: new[] { "TenantId", "Code" },
                unique: true,
                filter: "[TenantId] IS NOT NULL AND [IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantIdeaInvitations_GrantCallId",
                table: "AppGrantIdeaInvitations",
                column: "GrantCallId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProjects_Code_Host",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_TenantId_Code",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantIdeaInvitations_GrantCallId",
                table: "AppGrantIdeaInvitations");

            migrationBuilder.DropColumn(
                name: "Digest",
                table: "AppNotificationPreferences");
        }
    }
}
