using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_FirmDataExtractions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppFirmDataExtractions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DocumentFileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentAttachmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ConsentedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ConsentedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Error = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    PageCount = table.Column<int>(type: "int", nullable: true),
                    IsTruncated = table.Column<bool>(type: "bit", nullable: false),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFirmDataExtractions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppFirmDataSuggestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExtractionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DefinitionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RawValue = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    Confidence = table.Column<int>(type: "int", nullable: false),
                    Page = table.Column<int>(type: "int", nullable: true),
                    Excerpt = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AcceptedRawValue = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    DecidedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DecidedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFirmDataSuggestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppFirmDataSuggestions_AppFirmDataExtractions_ExtractionId",
                        column: x => x.ExtractionId,
                        principalTable: "AppFirmDataExtractions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppFirmDataSuggestions_AppFirmParameterDefinitions_DefinitionId",
                        column: x => x.DefinitionId,
                        principalTable: "AppFirmParameterDefinitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmDataExtractions_TenantId_CreationTime",
                table: "AppFirmDataExtractions",
                columns: new[] { "TenantId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmDataSuggestions_DefinitionId",
                table: "AppFirmDataSuggestions",
                column: "DefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmDataSuggestions_ExtractionId",
                table: "AppFirmDataSuggestions",
                column: "ExtractionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppFirmDataSuggestions");

            migrationBuilder.DropTable(
                name: "AppFirmDataExtractions");
        }
    }
}
