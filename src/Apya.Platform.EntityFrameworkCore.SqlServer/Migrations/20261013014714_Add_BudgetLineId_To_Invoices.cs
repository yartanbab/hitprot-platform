using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_BudgetLineId_To_Invoices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BudgetLineId",
                table: "AppInvoices",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_BudgetLineId",
                table: "AppInvoices",
                column: "BudgetLineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_BudgetLineId",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "BudgetLineId",
                table: "AppInvoices");
        }
    }
}
