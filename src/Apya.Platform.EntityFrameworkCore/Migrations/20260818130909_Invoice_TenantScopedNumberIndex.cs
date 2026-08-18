using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Invoice_TenantScopedNumberIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_InvoiceNumber",
                table: "AppInvoices");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_InvoiceNumber_Host",
                table: "AppInvoices",
                column: "InvoiceNumber",
                unique: true,
                filter: "\"TenantId\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_TenantId_InvoiceNumber",
                table: "AppInvoices",
                columns: new[] { "TenantId", "InvoiceNumber" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_InvoiceNumber_Host",
                table: "AppInvoices");

            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_TenantId_InvoiceNumber",
                table: "AppInvoices");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_InvoiceNumber",
                table: "AppInvoices",
                column: "InvoiceNumber",
                unique: true);
        }
    }
}
