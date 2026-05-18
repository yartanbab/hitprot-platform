using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_Invoice_Customer_Direction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CustomerId",
                table: "AppInvoices",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Direction",
                table: "AppInvoices",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "TaskId",
                table: "AppInvoices",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_CustomerId",
                table: "AppInvoices",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_CustomerId",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "Direction",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "AppInvoices");
        }
    }
}
