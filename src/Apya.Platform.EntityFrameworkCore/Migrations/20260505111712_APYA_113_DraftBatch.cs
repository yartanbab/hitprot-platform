using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class APYA_113_DraftBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DraftBatchId",
                schema: "ai",
                table: "AiDraftTasks",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AiDraftBatches",
                schema: "ai",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AiRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SourceFileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TotalItems = table.Column<int>(type: "int", nullable: false),
                    ApprovedItems = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_AiDraftBatches", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AiDraftTasks_DraftBatchId",
                schema: "ai",
                table: "AiDraftTasks",
                column: "DraftBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_AiDraftBatches_AiRequestId",
                schema: "ai",
                table: "AiDraftBatches",
                column: "AiRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_AiDraftBatches_Status_TenantId",
                schema: "ai",
                table: "AiDraftBatches",
                columns: new[] { "Status", "TenantId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AiDraftTasks_AiDraftBatches_DraftBatchId",
                schema: "ai",
                table: "AiDraftTasks",
                column: "DraftBatchId",
                principalSchema: "ai",
                principalTable: "AiDraftBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AiDraftTasks_AiDraftBatches_DraftBatchId",
                schema: "ai",
                table: "AiDraftTasks");

            migrationBuilder.DropTable(
                name: "AiDraftBatches",
                schema: "ai");

            migrationBuilder.DropIndex(
                name: "IX_AiDraftTasks_DraftBatchId",
                schema: "ai",
                table: "AiDraftTasks");

            migrationBuilder.DropColumn(
                name: "DraftBatchId",
                schema: "ai",
                table: "AiDraftTasks");
        }
    }
}
