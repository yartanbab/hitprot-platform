using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class A1_DocumentsCore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContextType",
                table: "AppDocuments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystemFolder",
                table: "AppDocuments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "AppDocuments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ContentHash",
                table: "AppDocumentAttachments",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DocumentFileId",
                table: "AppDocumentAttachments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "OcrText",
                table: "AppDocumentAttachments",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppDocumentTags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
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
                    table.PrimaryKey("PK_AppDocumentTags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppDocumentTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Code = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Icon = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    RetentionMonths = table.Column<int>(type: "integer", nullable: true),
                    FileNamePattern = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
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
                    table.PrimaryKey("PK_AppDocumentTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppProjectWorkSteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProgressPercent = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppProjectWorkSteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProjectWorkSteps_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppDocumentTypeFields",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DocumentTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    FieldType = table.Column<int>(type: "integer", nullable: false),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    FillSource = table.Column<int>(type: "integer", nullable: false),
                    Visibility = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    OptionsJson = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_AppDocumentTypeFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppDocumentTypeFields_AppDocumentTypes_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "AppDocumentTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppDocumentFiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DocumentId = table.Column<Guid>(type: "uuid", nullable: false),
                    DocumentTypeId = table.Column<Guid>(type: "uuid", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    WorkStepId = table.Column<Guid>(type: "uuid", nullable: true),
                    DisplayName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: true),
                    DocumentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PeriodCode = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RetentionUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExternalRef = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    LatestAttachmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    VersionCount = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppDocumentFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppDocumentFiles_AppDocumentTypes_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "AppDocumentTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AppDocumentFiles_AppDocuments_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "AppDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppDocumentFiles_AppProjectWorkSteps_WorkStepId",
                        column: x => x.WorkStepId,
                        principalTable: "AppProjectWorkSteps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AppDocumentFiles_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "AppDocumentFieldValues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DocumentFileId = table.Column<Guid>(type: "uuid", nullable: false),
                    FieldId = table.Column<Guid>(type: "uuid", nullable: false),
                    ValueText = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ValueNumber = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    ValueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Confidence = table.Column<int>(type: "integer", nullable: true),
                    FilledBy = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppDocumentFieldValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppDocumentFieldValues_AppDocumentFiles_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "AppDocumentFiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppDocumentFieldValues_AppDocumentTypeFields_FieldId",
                        column: x => x.FieldId,
                        principalTable: "AppDocumentTypeFields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppDocumentFileTags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DocumentFileId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDocumentFileTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppDocumentFileTags_AppDocumentFiles_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "AppDocumentFiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppDocumentFileTags_AppDocumentTags_TagId",
                        column: x => x.TagId,
                        principalTable: "AppDocumentTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentAttachments_ContentHash",
                table: "AppDocumentAttachments",
                column: "ContentHash");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentAttachments_DocumentFileId",
                table: "AppDocumentAttachments",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFieldValues_DocumentFileId_FieldId",
                table: "AppDocumentFieldValues",
                columns: new[] { "DocumentFileId", "FieldId" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFieldValues_FieldId",
                table: "AppDocumentFieldValues",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_DocumentId",
                table: "AppDocumentFiles",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_DocumentTypeId",
                table: "AppDocumentFiles",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_ExpiryDate",
                table: "AppDocumentFiles",
                column: "ExpiryDate");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_ProjectId",
                table: "AppDocumentFiles",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_TenantId_DocumentId",
                table: "AppDocumentFiles",
                columns: new[] { "TenantId", "DocumentId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_TenantId_PeriodCode",
                table: "AppDocumentFiles",
                columns: new[] { "TenantId", "PeriodCode" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_TenantId_ProjectId",
                table: "AppDocumentFiles",
                columns: new[] { "TenantId", "ProjectId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFiles_WorkStepId",
                table: "AppDocumentFiles",
                column: "WorkStepId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFileTags_DocumentFileId_TagId",
                table: "AppDocumentFileTags",
                columns: new[] { "DocumentFileId", "TagId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentFileTags_TagId",
                table: "AppDocumentFileTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentTags_TenantId_Name",
                table: "AppDocumentTags",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentTypeFields_DocumentTypeId_Key",
                table: "AppDocumentTypeFields",
                columns: new[] { "DocumentTypeId", "Key" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocumentTypes_TenantId_Code",
                table: "AppDocumentTypes",
                columns: new[] { "TenantId", "Code" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectWorkSteps_ProjectId_Order",
                table: "AppProjectWorkSteps",
                columns: new[] { "ProjectId", "Order" });

            // ---------------------------------------------------------------
            // VERİ TAŞIMA — mevcut ekleri yeni DocumentFile çapasına bağlar.
            //
            // Eskiden "bir dosyanın versiyonları" tablosuz bir Guid ile
            // (VersionGroupId) ifade ediliyordu. Her grup için bir AppDocumentFiles
            // satırı üretilir ve Id olarak VersionGroupId kullanılır — eşleme
            // deterministiktir, VersionGroupId kolonu (silinmedi) taşımanın geri
            // alınabilir kaydı olarak kalır.
            //
            // Taşınan belgelerde tür bilinmiyor (DocumentTypeId NULL) → "eksik meta"
            // akıllı klasöründe listelenirler. Durum Final(2): bunlar gerçekten
            // yüklenmiş dosyalar, taslak değil.
            // ---------------------------------------------------------------
            migrationBuilder.Sql(@"
INSERT INTO ""AppDocumentFiles"" (
    ""Id"", ""TenantId"", ""DocumentId"", ""DocumentTypeId"", ""ProjectId"", ""WorkStepId"",
    ""DisplayName"", ""Amount"", ""Currency"", ""DocumentDate"", ""PeriodCode"", ""Status"",
    ""ExpiryDate"", ""RetentionUntil"", ""ExternalRef"", ""IsLocked"",
    ""LatestAttachmentId"", ""VersionCount"",
    ""ExtraProperties"", ""ConcurrencyStamp"", ""CreationTime"", ""CreatorId"",
    ""LastModificationTime"", ""LastModifierId"", ""IsDeleted"", ""DeleterId"", ""DeletionTime"")
SELECT
    l.""VersionGroupId"", l.""TenantId"", l.""DocumentId"", NULL, d.""ProjectId"", NULL,
    l.""FileName"", NULL, NULL, NULL, NULL, 2,
    NULL, NULL, NULL, false,
    l.""Id"", c.""Cnt"",
    '{}', '', l.""CreationTime"", l.""CreatorId"",
    NULL, NULL, false, NULL, NULL
FROM (
    SELECT DISTINCT ON (a.""VersionGroupId"") a.*
    FROM ""AppDocumentAttachments"" a
    ORDER BY a.""VersionGroupId"", a.""VersionNumber"" DESC
) l
JOIN ""AppDocuments"" d ON d.""Id"" = l.""DocumentId""
JOIN (
    SELECT ""VersionGroupId"", COUNT(*) AS ""Cnt""
    FROM ""AppDocumentAttachments""
    GROUP BY ""VersionGroupId""
) c ON c.""VersionGroupId"" = l.""VersionGroupId"";

UPDATE ""AppDocumentAttachments"" SET ""DocumentFileId"" = ""VersionGroupId"";
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDocumentFieldValues");

            migrationBuilder.DropTable(
                name: "AppDocumentFileTags");

            migrationBuilder.DropTable(
                name: "AppDocumentTypeFields");

            migrationBuilder.DropTable(
                name: "AppDocumentFiles");

            migrationBuilder.DropTable(
                name: "AppDocumentTags");

            migrationBuilder.DropTable(
                name: "AppDocumentTypes");

            migrationBuilder.DropTable(
                name: "AppProjectWorkSteps");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentAttachments_ContentHash",
                table: "AppDocumentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_AppDocumentAttachments_DocumentFileId",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "ContextType",
                table: "AppDocuments");

            migrationBuilder.DropColumn(
                name: "IsSystemFolder",
                table: "AppDocuments");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "AppDocuments");

            migrationBuilder.DropColumn(
                name: "ContentHash",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "DocumentFileId",
                table: "AppDocumentAttachments");

            migrationBuilder.DropColumn(
                name: "OcrText",
                table: "AppDocumentAttachments");
        }
    }
}
