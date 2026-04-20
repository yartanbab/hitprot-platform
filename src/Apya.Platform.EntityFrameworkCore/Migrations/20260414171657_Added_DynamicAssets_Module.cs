using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Added_DynamicAssets_Module : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppDocuments_Dynamic",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    IsTemplate = table.Column<bool>(type: "bit", nullable: false),
                    ParentTemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
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
                    table.PrimaryKey("PK_AppDocuments_Dynamic", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppEntityLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SourceEntityName = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SourceEntityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TargetEntityName = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    TargetEntityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RelationType = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppEntityLinks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RespondentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Answers = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppResponses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppWebhookDeliveryLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Payload = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponseCode = table.Column<int>(type: "int", nullable: false),
                    ResponseBody = table.Column<string>(type: "nvarchar(max)", maxLength: 4096, nullable: true),
                    TryCount = table.Column<int>(type: "int", nullable: false),
                    IsSuccess = table.Column<bool>(type: "bit", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppWebhookDeliveryLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppWebhookSubscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TargetUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    Secret = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_AppWebhookSubscriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppBlocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppDocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Settings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AgentContext = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppBlocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppBlocks_AppDocuments_Dynamic_AppDocumentId",
                        column: x => x.AppDocumentId,
                        principalTable: "AppDocuments_Dynamic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppBlocks_AppDocumentId_Order",
                table: "AppBlocks",
                columns: new[] { "AppDocumentId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_IsTemplate",
                table: "AppDocuments_Dynamic",
                column: "IsTemplate");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_ParentTemplateId",
                table: "AppDocuments_Dynamic",
                column: "ParentTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_Slug",
                table: "AppDocuments_Dynamic",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppEntityLinks_Source",
                table: "AppEntityLinks",
                columns: new[] { "SourceEntityName", "SourceEntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppEntityLinks_Target",
                table: "AppEntityLinks",
                columns: new[] { "TargetEntityName", "TargetEntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppEntityLinks_UniqueLink",
                table: "AppEntityLinks",
                columns: new[] { "SourceEntityName", "SourceEntityId", "TargetEntityName", "TargetEntityId", "RelationType" },
                unique: true,
                filter: "[RelationType] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AppResponses_DocumentId",
                table: "AppResponses",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppResponses_RespondentId",
                table: "AppResponses",
                column: "RespondentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppWebhookDeliveryLogs_SubscriptionId",
                table: "AppWebhookDeliveryLogs",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppWebhookDeliveryLogs_SubSuccess",
                table: "AppWebhookDeliveryLogs",
                columns: new[] { "SubscriptionId", "IsSuccess" });

            migrationBuilder.CreateIndex(
                name: "IX_AppWebhookSubscriptions_DocActive",
                table: "AppWebhookSubscriptions",
                columns: new[] { "DocumentId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_AppWebhookSubscriptions_DocumentId",
                table: "AppWebhookSubscriptions",
                column: "DocumentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppBlocks");

            migrationBuilder.DropTable(
                name: "AppEntityLinks");

            migrationBuilder.DropTable(
                name: "AppResponses");

            migrationBuilder.DropTable(
                name: "AppWebhookDeliveryLogs");

            migrationBuilder.DropTable(
                name: "AppWebhookSubscriptions");

            migrationBuilder.DropTable(
                name: "AppDocuments_Dynamic");
        }
    }
}
