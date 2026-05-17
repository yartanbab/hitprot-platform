using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_Payment_CashAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CashAccountId",
                table: "AppPayments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppPayments_CashAccountId",
                table: "AppPayments",
                column: "CashAccountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppPayments_CashAccountId",
                table: "AppPayments");

            migrationBuilder.DropColumn(
                name: "CashAccountId",
                table: "AppPayments");
        }
    }
}
