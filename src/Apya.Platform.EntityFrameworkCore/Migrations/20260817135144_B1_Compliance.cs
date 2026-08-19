using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class B1_Compliance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActorRole",
                table: "AppDocumentAccessLogs",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Detail",
                table: "AppDocumentAccessLogs",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DocumentFileId",
                table: "AppDocumentAccessLogs",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppComplianceAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    PeriodCode = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
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
                    table.PrimaryKey("PK_AppComplianceAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppComplianceAssignments_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppCompliancePackages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Issuer = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Code = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsSystem = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppCompliancePackages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppComplianceItemStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    AssignmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    RequirementId = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkStepId = table.Column<Guid>(type: "uuid", nullable: true),
                    PeriodCode = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    DocumentFileId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsWaived = table.Column<bool>(type: "boolean", nullable: false),
                    WaiveReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_AppComplianceItemStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppComplianceItemStates_AppComplianceAssignments_Assignment~",
                        column: x => x.AssignmentId,
                        principalTable: "AppComplianceAssignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppComplianceRequirements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DocumentTypeId = table.Column<Guid>(type: "uuid", nullable: true),
                    Scope = table.Column<int>(type: "integer", nullable: false),
                    IsBlocking = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppComplianceRequirements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppComplianceRequirements_AppCompliancePackages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "AppCompliancePackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppComplianceRequirements_AppDocumentTypes_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "AppDocumentTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentAccessLogs_DocumentFileId_CreationTime",
                table: "AppDocumentAccessLogs",
                columns: new[] { "DocumentFileId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentAccessLogs_TenantId_CreationTime",
                table: "AppDocumentAccessLogs",
                columns: new[] { "TenantId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceAssignments_ProjectId_PackageId_PeriodCode",
                table: "AppComplianceAssignments",
                columns: new[] { "ProjectId", "PackageId", "PeriodCode" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceItemStates_AssignmentId_RequirementId_WorkStep~",
                table: "AppComplianceItemStates",
                columns: new[] { "AssignmentId", "RequirementId", "WorkStepId", "PeriodCode" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppCompliancePackages_TenantId_Code",
                table: "AppCompliancePackages",
                columns: new[] { "TenantId", "Code" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceRequirements_DocumentTypeId",
                table: "AppComplianceRequirements",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceRequirements_PackageId_Order",
                table: "AppComplianceRequirements",
                columns: new[] { "PackageId", "Order" });

            // Mevcut denetim izi kayıtlarını yeni DocumentFileId kolonuna bağla:
            // eski kayıtlar yalnız AttachmentId (versiyon) taşıyordu, Etkinlik sekmesi
            // ise BELGE bazında okuyor. Eki silinmiş kayıtlar null kalır — kaynağı yok.
            migrationBuilder.Sql(@"
UPDATE ""AppDocumentAccessLogs"" AS l
SET ""DocumentFileId"" = a.""DocumentFileId""
FROM ""AppDocumentAttachments"" AS a
WHERE a.""Id"" = l.""AttachmentId"" AND l.""AttachmentId"" IS NOT NULL;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppComplianceItemStates");

            migrationBuilder.DropTable(
                name: "AppComplianceRequirements");

            migrationBuilder.DropTable(
                name: "AppComplianceAssignments");

            migrationBuilder.DropTable(
                name: "AppCompliancePackages");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentAccessLogs_DocumentFileId_CreationTime",
                table: "AppDocumentAccessLogs");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentAccessLogs_TenantId_CreationTime",
                table: "AppDocumentAccessLogs");

            migrationBuilder.DropColumn(
                name: "ActorRole",
                table: "AppDocumentAccessLogs");

            migrationBuilder.DropColumn(
                name: "Detail",
                table: "AppDocumentAccessLogs");

            migrationBuilder.DropColumn(
                name: "DocumentFileId",
                table: "AppDocumentAccessLogs");
        }
    }
}
