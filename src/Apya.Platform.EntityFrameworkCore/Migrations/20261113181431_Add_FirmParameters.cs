using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_FirmParameters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppFirmParameterDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    DataType = table.Column<int>(type: "integer", nullable: false),
                    Group = table.Column<int>(type: "integer", nullable: false),
                    Requirement = table.Column<int>(type: "integer", nullable: false),
                    Audience = table.Column<int>(type: "integer", nullable: false),
                    AllowedSources = table.Column<int>(type: "integer", nullable: false),
                    ValidityMonths = table.Column<int>(type: "integer", nullable: true),
                    MinNumber = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    MaxNumber = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    MaxLength = table.Column<int>(type: "integer", nullable: true),
                    OptionsJson = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MatchUsage = table.Column<int>(type: "integer", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    SystemKey = table.Column<int>(type: "integer", nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFirmParameterDefinitions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppFirmParameterValues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DefinitionId = table.Column<Guid>(type: "uuid", nullable: false),
                    ValueText = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ValueNumber = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    ValueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ValueBool = table.Column<bool>(type: "boolean", nullable: true),
                    Source = table.Column<int>(type: "integer", nullable: false),
                    Verification = table.Column<int>(type: "integer", nullable: false),
                    Confidence = table.Column<int>(type: "integer", nullable: true),
                    SourceDocumentFileId = table.Column<Guid>(type: "uuid", nullable: true),
                    SourcePage = table.Column<int>(type: "integer", nullable: true),
                    SourceExcerpt = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    ConfirmedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFirmParameterValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppFirmParameterValues_AppFirmParameterDefinitions_Definiti~",
                        column: x => x.DefinitionId,
                        principalTable: "AppFirmParameterDefinitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmParameterDefinitions_Code",
                table: "AppFirmParameterDefinitions",
                column: "Code",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmParameterValues_DefinitionId",
                table: "AppFirmParameterValues",
                column: "DefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmParameterValues_TenantId_DefinitionId",
                table: "AppFirmParameterValues",
                columns: new[] { "TenantId", "DefinitionId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppFirmParameterValues");

            migrationBuilder.DropTable(
                name: "AppFirmParameterDefinitions");
        }
    }
}
