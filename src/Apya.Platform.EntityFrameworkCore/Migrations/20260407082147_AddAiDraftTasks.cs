using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddAiDraftTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTaskDependencies_TaskId_PredecessorTaskId",
                table: "AppTaskDependencies");

            migrationBuilder.CreateTable(
                name: "AppDraftTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ImportBatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    EstimatedHours = table.Column<double>(type: "float", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_AppDraftTasks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskDependencies_TaskId_PredecessorTaskId",
                table: "AppTaskDependencies",
                columns: new[] { "TaskId", "PredecessorTaskId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppDraftTasks_ImportBatchId",
                table: "AppDraftTasks",
                column: "ImportBatchId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDraftTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTaskDependencies_TaskId_PredecessorTaskId",
                table: "AppTaskDependencies");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskDependencies_TaskId_PredecessorTaskId",
                table: "AppTaskDependencies",
                columns: new[] { "TaskId", "PredecessorTaskId" });
        }
    }
}
