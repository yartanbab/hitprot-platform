using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskBudgetLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BudgetLineId",
                table: "AppTasks",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PlannedAmount",
                table: "AppTasks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_BudgetLineId",
                table: "AppTasks",
                column: "BudgetLineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTasks_BudgetLineId",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "BudgetLineId",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "PlannedAmount",
                table: "AppTasks");
        }
    }
}
