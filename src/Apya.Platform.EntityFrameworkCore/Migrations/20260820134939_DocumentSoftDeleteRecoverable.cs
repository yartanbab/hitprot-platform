using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class DocumentSoftDeleteRecoverable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppDocumentFileTags_DocumentFileId_TagId",
                table: "AppDocumentFileTags");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AppDocumentFileTags",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AppDocumentAttachments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFileTags_DocumentFileId_TagId",
                table: "AppDocumentFileTags",
                columns: new[] { "DocumentFileId", "TagId" },
                unique: true,
                filter: "\"IsDeleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppDocumentFileTags_DocumentFileId_TagId",
                table: "AppDocumentFileTags");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AppDocumentFileTags");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AppDocumentAttachments");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFileTags_DocumentFileId_TagId",
                table: "AppDocumentFileTags",
                columns: new[] { "DocumentFileId", "TagId" },
                unique: true);
        }
    }
}
