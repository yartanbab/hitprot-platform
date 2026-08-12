using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_TaskTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppTaskTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    TaskTitle = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    TaskDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    EstimatedHours = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TaskType = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
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
                    table.PrimaryKey("PK_AppTaskTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppTaskTemplateFeatures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskTemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FeatureCode = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTaskTemplateFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTaskTemplateFeatures_AppTaskTemplates_TaskTemplateId",
                        column: x => x.TaskTemplateId,
                        principalTable: "AppTaskTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppTaskTemplateItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskTemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTaskTemplateItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTaskTemplateItems_AppTaskTemplates_TaskTemplateId",
                        column: x => x.TaskTemplateId,
                        principalTable: "AppTaskTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppTaskTemplateTags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskTemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TagName = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTaskTemplateTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTaskTemplateTags_AppTaskTemplates_TaskTemplateId",
                        column: x => x.TaskTemplateId,
                        principalTable: "AppTaskTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskTemplateFeatures_TaskTemplateId_FeatureCode",
                table: "AppTaskTemplateFeatures",
                columns: new[] { "TaskTemplateId", "FeatureCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskTemplateItems_TaskTemplateId_Order",
                table: "AppTaskTemplateItems",
                columns: new[] { "TaskTemplateId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskTemplates_TenantId_Name",
                table: "AppTaskTemplates",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskTemplateTags_TaskTemplateId_TagName",
                table: "AppTaskTemplateTags",
                columns: new[] { "TaskTemplateId", "TagName" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppTaskTemplateFeatures");

            migrationBuilder.DropTable(
                name: "AppTaskTemplateItems");

            migrationBuilder.DropTable(
                name: "AppTaskTemplateTags");

            migrationBuilder.DropTable(
                name: "AppTaskTemplates");
        }
    }
}
