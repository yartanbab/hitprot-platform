using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class TaskScopeAndFinanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "TaskId",
                table: "AppTaskChecklistItems",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "AppTaskChecklistItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskDependencies_PredecessorTaskId",
                table: "AppTaskDependencies",
                column: "PredecessorTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskChecklistItems_ProjectId",
                table: "AppTaskChecklistItems",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AppExpenses_ProjectId_ExpenseDate",
                table: "AppExpenses",
                columns: new[] { "ProjectId", "ExpenseDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTaskDependencies_PredecessorTaskId",
                table: "AppTaskDependencies");

            migrationBuilder.DropIndex(
                name: "IX_AppTaskChecklistItems_ProjectId",
                table: "AppTaskChecklistItems");

            migrationBuilder.DropIndex(
                name: "IX_AppExpenses_ProjectId_ExpenseDate",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "AppTaskChecklistItems");

            migrationBuilder.AlterColumn<Guid>(
                name: "TaskId",
                table: "AppTaskChecklistItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
