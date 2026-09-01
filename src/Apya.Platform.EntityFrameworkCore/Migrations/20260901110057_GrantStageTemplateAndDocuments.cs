using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantStageTemplateAndDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StageTemplateId",
                table: "AppGrants",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppGrantDocumentRequirements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    GrantId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Obligation = table.Column<int>(type: "integer", nullable: false),
                    UploaderParty = table.Column<int>(type: "integer", nullable: false),
                    RequiresESignature = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_AppGrantDocumentRequirements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantDocumentRequirements_AppGrants_GrantId",
                        column: x => x.GrantId,
                        principalTable: "AppGrants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantStageTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: false),
                    Description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_AppGrantStageTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantStageTemplateSteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    StageTemplateId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: false),
                    Note = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Owner = table.Column<int>(type: "integer", nullable: false),
                    RequiredDocumentsNote = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    CompletionCondition = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    ReminderDays = table.Column<int>(type: "integer", nullable: true),
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
                    table.PrimaryKey("PK_AppGrantStageTemplateSteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantStageTemplateSteps_AppGrantStageTemplates_StageTemp~",
                        column: x => x.StageTemplateId,
                        principalTable: "AppGrantStageTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrants_StageTemplateId",
                table: "AppGrants",
                column: "StageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantDocumentRequirements_GrantId_Order",
                table: "AppGrantDocumentRequirements",
                columns: new[] { "GrantId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantStageTemplateSteps_StageTemplateId_Order",
                table: "AppGrantStageTemplateSteps",
                columns: new[] { "StageTemplateId", "Order" });

            migrationBuilder.AddForeignKey(
                name: "FK_AppGrants_AppGrantStageTemplates_StageTemplateId",
                table: "AppGrants",
                column: "StageTemplateId",
                principalTable: "AppGrantStageTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppGrants_AppGrantStageTemplates_StageTemplateId",
                table: "AppGrants");

            migrationBuilder.DropTable(
                name: "AppGrantDocumentRequirements");

            migrationBuilder.DropTable(
                name: "AppGrantStageTemplateSteps");

            migrationBuilder.DropTable(
                name: "AppGrantStageTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AppGrants_StageTemplateId",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "StageTemplateId",
                table: "AppGrants");
        }
    }
}
