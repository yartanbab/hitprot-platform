using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_ProjectBudget_SourceGrantIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SourceGrantLineId",
                table: "AppProjectBudgetLines",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SourceGrantTrancheId",
                table: "AppFundingTranches",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectBudgetLines_SourceGrantLineId",
                table: "AppProjectBudgetLines",
                column: "SourceGrantLineId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFundingTranches_SourceGrantTrancheId",
                table: "AppFundingTranches",
                column: "SourceGrantTrancheId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProjectBudgetLines_SourceGrantLineId",
                table: "AppProjectBudgetLines");

            migrationBuilder.DropIndex(
                name: "IX_AppFundingTranches_SourceGrantTrancheId",
                table: "AppFundingTranches");

            migrationBuilder.DropColumn(
                name: "SourceGrantLineId",
                table: "AppProjectBudgetLines");

            migrationBuilder.DropColumn(
                name: "SourceGrantTrancheId",
                table: "AppFundingTranches");
        }
    }
}
