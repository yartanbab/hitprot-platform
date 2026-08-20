using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class DocumentSuggestionDismissals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppDocumentSuggestionDismissals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DocumentFileId = table.Column<Guid>(type: "uuid", nullable: false),
                    SuggestionKey = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDocumentSuggestionDismissals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppDocumentSuggestionDismissals_AppDocumentFiles_DocumentFi~",
                        column: x => x.DocumentFileId,
                        principalTable: "AppDocumentFiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentSuggestionDismissals_DocumentFileId_SuggestionKey",
                table: "AppDocumentSuggestionDismissals",
                columns: new[] { "DocumentFileId", "SuggestionKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDocumentSuggestionDismissals");
        }
    }
}
