using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddBudgetLineHierarchyAndCofinancing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "SupportRatePercent",
                table: "AppProjects",
                type: "decimal(5,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GrantAmount",
                table: "AppProjectBudgetLines",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ParentId",
                table: "AppProjectBudgetLines",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectBudgetLines_ParentId",
                table: "AppProjectBudgetLines",
                column: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProjectBudgetLines_ParentId",
                table: "AppProjectBudgetLines");

            migrationBuilder.DropColumn(
                name: "SupportRatePercent",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "GrantAmount",
                table: "AppProjectBudgetLines");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "AppProjectBudgetLines");
        }
    }
}
