using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class FormSlug_TenantScopedIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_Slug",
                table: "AppDocuments_Dynamic");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_Slug_Host",
                table: "AppDocuments_Dynamic",
                column: "Slug",
                unique: true,
                filter: "[TenantId] IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Slug",
                table: "AppDocuments_Dynamic",
                columns: new[] { "TenantId", "Slug" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_Slug_Host",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Slug",
                table: "AppDocuments_Dynamic");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_Slug",
                table: "AppDocuments_Dynamic",
                column: "Slug",
                unique: true);
        }
    }
}
