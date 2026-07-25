using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_DocumentAttachment_TenantId_Versioning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "AppDocuments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsExpiryWarningSent",
                table: "AppDocuments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsLatest",
                table: "AppDocumentAttachments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppDocumentAttachments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "VersionGroupId",
                table: "AppDocumentAttachments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "VersionNumber",
                table: "AppDocumentAttachments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AppDocumentAccessLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DocumentId = table.Column<Guid>(type: "uuid", nullable: false),
                    AttachmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    Action = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDocumentAccessLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentAttachments_DocumentId_VersionGroupId",
                table: "AppDocumentAttachments",
                columns: new[] { "DocumentId", "VersionGroupId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentAccessLogs_DocumentId",
                table: "AppDocumentAccessLogs",
                column: "DocumentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDocumentAccessLogs");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentAttachments_DocumentId_VersionGroupId",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "AppDocuments");

            migrationBuilder.DropColumn(
                name: "IsExpiryWarningSent",
                table: "AppDocuments");

            migrationBuilder.DropColumn(
                name: "IsLatest",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "VersionGroupId",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "VersionNumber",
                table: "AppDocumentAttachments");
        }
    }
}
