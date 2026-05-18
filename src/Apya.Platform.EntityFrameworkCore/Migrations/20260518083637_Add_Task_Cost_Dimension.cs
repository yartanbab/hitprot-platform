using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_Task_Cost_Dimension : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TaskId",
                table: "AppIncomeEntries",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TaskId",
                table: "AppExpenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppIncomeEntries_TaskId",
                table: "AppIncomeEntries",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AppExpenses_TaskId",
                table: "AppExpenses",
                column: "TaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppIncomeEntries_TaskId",
                table: "AppIncomeEntries");

            migrationBuilder.DropIndex(
                name: "IX_AppExpenses_TaskId",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "AppExpenses");
        }
    }
}
