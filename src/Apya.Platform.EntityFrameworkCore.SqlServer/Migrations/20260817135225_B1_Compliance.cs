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
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Detail",
                table: "AppDocumentAccessLogs",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DocumentFileId",
                table: "AppDocumentAccessLogs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppComplianceAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PackageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PeriodCode = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Issuer = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCompliancePackages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppComplianceItemStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AssignmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequirementId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WorkStepId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PeriodCode = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: true),
                    DocumentFileId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsWaived = table.Column<bool>(type: "bit", nullable: false),
                    WaiveReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppComplianceItemStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppComplianceItemStates_AppComplianceAssignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "AppComplianceAssignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppComplianceRequirements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PackageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DocumentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Scope = table.Column<int>(type: "int", nullable: false),
                    IsBlocking = table.Column<bool>(type: "bit", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceItemStates_AssignmentId_RequirementId_WorkStepId_PeriodCode",
                table: "AppComplianceItemStates",
                columns: new[] { "AssignmentId", "RequirementId", "WorkStepId", "PeriodCode" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppCompliancePackages_TenantId_Code",
                table: "AppCompliancePackages",
                columns: new[] { "TenantId", "Code" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceRequirements_DocumentTypeId",
                table: "AppComplianceRequirements",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceRequirements_PackageId_Order",
                table: "AppComplianceRequirements",
                columns: new[] { "PackageId", "Order" });

            // Postgres tarafındaki ile aynı backfill — gerekçe için oraya bakın.
            migrationBuilder.Sql(@"
UPDATE l
SET l.[DocumentFileId] = a.[DocumentFileId]
FROM [AppDocumentAccessLogs] AS l
INNER JOIN [AppDocumentAttachments] AS a ON a.[Id] = l.[AttachmentId];
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
